'use server';
/***/
// Technical prototyping controller functions
// - These functions are not intended for long term use and may be thrown away
//     at any time
// - This layer is responsible for translating UI actions to API requests and back
/***/

import * as CF from '@/api/cf/cloudfoundry';
import {
  GetRoleArgs,
  ListRolesRes,
  RoleType,
} from '@/api/cf/cloudfoundry-types';

import { logDevError } from './controller-helpers';
import {
  AddOrgRoleArgs,
  AddSpaceRoleArgs,
  ControllerResult,
  ResultStatus,
  UserMessage,
} from './controller-types';

// HELPERS

// maps basic cloud foundry fetch response to frontend ready result
async function mapCfResult(
  apiResponse: Response,
  message?: UserMessage
): Promise<Result> {
  if (apiResponse.ok) {
    return {
      success: true,
      status: 'success',
      message: message ? message.success : undefined,
      // 202 (successful delete) does not return any json
      payload:
        apiResponse.status === 202 ? undefined : await apiResponse.json(),
    };
  } else if (apiResponse.status === 422) {
    const cfPayload = await apiResponse.json();
    logDevError(
      `${message ? message.fail : '422 error with cf request'}: ${JSON.stringify(cfPayload)}`
    );
    return {
      success: false,
      status: 'error',
      message: message ? message.fail : undefined,
      payload: cfPayload,
    };
  }

  logDevError(
    `${message ? message.fail : 'error with cf request'}: ${apiResponse.status}`
  );
  return {
    success: false,
    status: 'error',
    message: message ? message.fail : undefined,
  };
}

export async function associateUsersWithRoles(
  payload: ListRolesRes
): Promise<UserWithRoles[]> {
  if (!payload.included?.users) {
    return [];
  }

  const users = payload.included.users
    .map(function (userObj) {
      const user = structuredClone(userObj);
      const associatedRoles = payload.resources.filter(function (role) {
        return user.guid == role.relationships.user.data.guid;
      });
      return {
        guid: user.guid,
        username: user.username,
        origin: user.origin,
        roles: associatedRoles.map(function (role) {
          return {
            guid: role.guid,
            type: role.type,
          };
        }),
      };
    })
    .sort(function (a, b) {
      // sort null usernames at the bottom of the list
      return a.username ? a.username.localeCompare(b.username) : 1;
    });
  return users;
}

// TYPES AND INTERFACES

export interface Result {
  success: boolean;
  status?: ResultStatus;
  message?: string;
  payload?: any;
}

export interface UserWithRoles {
  guid: string;
  origin: string;
  orgRoles?: {
    guid: string;
    type: RoleType;
  }[];
  spaceRoles?: {
    spaceGuid?: string;
    spaceName?: string;
    guid: string;
    type: RoleType;
  }[];
  username: string;
}

// APPLICATIONS

export async function getApps(): Promise<Result> {
  const message = {
    fail: 'unable to list your applications',
  };
  try {
    const res = await CF.getApps({});
    return await mapCfResult(res, message);
  } catch (error: any) {
    logDevError(`${message.fail}: ${error.message}`);
    return {
      success: false,
      status: 'error',
      message: message.fail,
    };
  }
}

// ORGANIZATIONS

export async function getOrg(guid: string): Promise<Result> {
  const message = {
    fail: 'failed to retrieve organization information',
  };
  try {
    const res = await CF.getOrg(guid);
    if (!res.ok) {
      return {
        success: false,
        status: 'error',
        message: 'something went wrong with the request',
      };
    }
    return await mapCfResult(res, message);
  } catch (error: any) {
    logDevError(`${message.fail}: ${error.message}`);
    return {
      success: false,
      status: 'error',
      message: message.fail,
    };
  }
}

export async function getOrgs(): Promise<Result> {
  const message = {
    fail: 'unable to list your organizations',
  };
  try {
    const res = await CF.getOrgs();
    return await mapCfResult(res, message);
  } catch (error: any) {
    logDevError(`${message.fail}: ${error.message}`);
    return {
      success: false,
      status: 'error',
      message: message.fail,
    };
  }
}

export async function getOrgPage(orgGuid: string): Promise<ControllerResult> {
  const [orgRes, usersRes, spacesRes] = await Promise.all([
    CF.getOrg(orgGuid),
    CF.getRoles({ orgGuids: [orgGuid], include: ['user'] }),
    CF.getSpaces([orgGuid]),
  ]);
  [orgRes, usersRes, spacesRes].map((res) => {
    if (!res.ok) {
      logDevError(
        `api error on cf org page with http code ${res.status} for url: ${res.url}`
      );
      throw new Error('something went wrong with the request');
    }
  });
  const userRoleList = await associateUsersWithRoles(await usersRes.json());
  return {
    meta: { status: 'success' },
    payload: {
      org: await orgRes.json(),
      users: userRoleList,
      spaces: (await spacesRes.json()).resources,
    },
  };
}

// ROLES

export async function addOrgRole({
  orgGuid,
  roleType,
  username,
}: AddOrgRoleArgs): Promise<Result> {
  const message = {
    success: `added ${username} to org`,
    fail: `unable to add ${username} to org`,
  };
  try {
    const res = await CF.addRole({
      orgGuid: orgGuid,
      roleType: roleType,
      username: username,
    });
    return await mapCfResult(res, message);
  } catch (error: any) {
    return {
      success: false,
      status: 'error',
      message: `${message.fail}: ${error.message}`,
    };
  }
}

export async function addSpaceRole({
  spaceGuid,
  roleType,
  username,
}: AddSpaceRoleArgs): Promise<Result> {
  const message = {
    success: `added ${username} to space`,
    fail: `unable to add ${username} to space`,
  };
  try {
    const res = await CF.addRole({
      spaceGuid: spaceGuid,
      roleType: roleType,
      username: username,
    });
    return await mapCfResult(res, message);
  } catch (error: any) {
    return {
      success: false,
      status: 'error',
      message: `${message.fail}: ${error.message}`,
    };
  }
}

async function deleteGroupUser(
  groupType: string,
  guids: string[],
  userGuid: string
) {
  try {
    const args: GetRoleArgs = {
      userGuids: [userGuid],
    };
    groupType === 'org' ? (args.orgGuids = guids) : (args.spaceGuids = guids);
    const roleRes = await CF.getRoles(args);

    if (!roleRes.ok) {
      // TODO probably want better logging here
      throw new Error(
        `unable to obtain roles for user ${userGuid}: ${roleRes.status}`
      );
    }

    const roleResJson = await roleRes.json();
    const responses = await Promise.all(
      roleResJson.resources.map((role: any) => CF.deleteRole(role.guid))
    );

    // if any responses were not successful, throw an error so it can be logged and returned to the user
    if (responses.some((res: Response) => !res.ok)) {
      throw new Error('failed to remove all roles');
    }
  } catch (error: any) {
    throw new Error(
      `something went wrong removing ${userGuid} from ${groupType}: ${error.message}`
    );
  }
}

export async function deleteOrgUser(
  orgGuid: string,
  userGuid: string
): Promise<Result> {
  try {
    await deleteGroupUser('org', [orgGuid], userGuid);

    return {
      success: true,
      status: 'success',
      message: 'removed user from org',
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteSpaceUser(
  spaceGuid: string,
  userGuid: string
): Promise<Result> {
  try {
    await deleteGroupUser('space', [spaceGuid], userGuid);

    return {
      success: true,
      status: 'success',
      message: 'removed user from space',
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteRole(guid: string): Promise<Result> {
  const message = {
    success: `deleted role ${guid}`,
    fail: `failed to delete role ${guid}`,
  };
  try {
    const res = await CF.deleteRole(guid);
    return await mapCfResult(res, message);
  } catch (error: any) {
    logDevError(`${message.fail}: ${error.message}`);
    return {
      success: false,
      status: 'error',
      message: message.fail,
    };
  }
}

export async function getSpaceUsers(guid: string): Promise<Result> {
  const message = {
    fail: 'unable to list the space users',
  };
  try {
    const res = await CF.getRoles({ spaceGuids: [guid], include: ['user'] });

    if (!res.ok) {
      // TODO rethink how we want the error handling to work here
      throw new Error(`problem with getRoles ${res.status}`);
    }

    const payload = await res.json();
    const userRoleList = await associateUsersWithRoles(payload);
    return {
      success: true,
      status: 'success',
      payload: userRoleList,
    };
  } catch (error: any) {
    throw new Error(`${message.fail}: ${error.message}`);
  }
}

// SPACES

export async function getSpace(guid: string): Promise<Result> {
  const message = {
    fail: 'unable to retrieve space information',
  };
  try {
    const res = await CF.getSpace(guid);
    return await mapCfResult(res, message);
  } catch (error: any) {
    logDevError(`${message.fail}: ${error.message}`);
    return {
      success: false,
      status: 'error',
      message: message.fail,
    };
  }
}
