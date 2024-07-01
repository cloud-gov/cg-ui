'use server';
/***/
// Library for translating UI actions to API requests and back
/***/
import { revalidatePath } from 'next/cache';
import * as CF from '@/api/cf/cloudfoundry';
import * as UAA from '@/api/uaa/uaa';
import { GetRoleArgs, SpaceObj, UserObj } from '@/api/cf/cloudfoundry-types';
import {
  AddOrgRoleArgs,
  AddSpaceRoleArgs,
  ControllerResult,
  Result,
  UserMessage,
  UAAUsersById,
} from './controller-types';
import {
  associateUsersWithRoles,
  associateUsersWithRolesTest,
  createFakeUaaUser,
  resourceKeyedById,
  pollForJobCompletion,
  logDevError,
} from './controller-helpers';
import { sortObjectsByParam } from '@/helpers/arrays';

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

export async function deleteOrgUserTest(
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

export async function getApps(): Promise<Result> {
  const message = {
    fail: 'unable to list your applications',
  };
  try {
    const res = await CF.getApps();
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
    const userRoleList = await associateUsersWithRolesTest(payload);
    return {
      success: true,
      status: 'success',
      payload: userRoleList,
    };
  } catch (error: any) {
    throw new Error(`${message.fail}: ${error.message}`);
  }
}

export async function getOrgPage(orgGuid: string): Promise<ControllerResult> {
  const [orgUserRolesRes, spacesRes] = await Promise.all([
    // use this request to roles to also obtain the organization details and list the org users
    CF.getRoles({ orgGuids: [orgGuid], include: ['organization', 'user'] }),
    CF.getSpaces([orgGuid]),
  ]);
  [orgUserRolesRes, spacesRes].map((res) => {
    if (!res.ok) {
      logDevError(
        `api error on cf org page with http code ${res.status} for url: ${res.url}`
      );
      throw new Error('something went wrong with the request');
    }
  });

  const orgUserRolesPayload = await orgUserRolesRes.json();
  const users = orgUserRolesPayload.included.users;
  const userGuids = users.map(function (user: UserObj) {
    return user.guid;
  });

  const spaces = (await spacesRes.json()).resources;
  const spacesBySpaceId = resourceKeyedById(spaces);
  const spaceGuids = spaces.map(function (space: SpaceObj) {
    return space.guid;
  });

  const [spaceRolesRes, userInfoRes] = await Promise.all([
    await CF.getRoles({ spaceGuids: spaceGuids }),
    await UAA.getUsers(
      ['id', 'active', 'verified', 'previousLogonTime'],
      'id',
      userGuids
    ),
  ]);

  if (!spaceRolesRes.ok) {
    logDevError(
      `api error on cf org page with http code ${spaceRolesRes.status} for url: ${spaceRolesRes.url}`
    );
    throw new Error('something went wrong with the request');
  }
  if (!userInfoRes.ok && userInfoRes.status != 403) {
    logDevError(
      `uaa api error on cf org page with http code ${userInfoRes.status} for url: ${userInfoRes.url}`
    );
    throw new Error('something went wrong with the request');
  }
  const uaaUsers =
    userInfoRes.status === 403
      ? resourceKeyedById(
          users.map(function (user: UserObj) {
            return createFakeUaaUser(user);
          })
        )
      : (resourceKeyedById(
          (await userInfoRes.json()).resources
        ) as UAAUsersById);

  const spaceRoles = (await spaceRolesRes.json()).resources;
  const rolesByUser = associateUsersWithRoles(
    orgUserRolesPayload.resources.concat(spaceRoles)
  );

  return {
    meta: { status: 'success' },
    payload: {
      org: orgUserRolesPayload.included.organizations[0],
      roles: rolesByUser,
      spaces: spacesBySpaceId,
      users: users,
      uaaUsers: uaaUsers,
    },
  };
}

export async function getOrgTestPage(
  orgGuid: string
): Promise<ControllerResult> {
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
  const userRoleList = await associateUsersWithRolesTest(await usersRes.json());
  return {
    meta: { status: 'success' },
    payload: {
      org: await orgRes.json(),
      users: userRoleList,
      spaces: (await spacesRes.json()).resources,
    },
  };
}

export async function getUser(userGuid: string): Promise<ControllerResult> {
  const res = await CF.getUser(userGuid);
  if (!res.ok) {
    logDevError(`unable to retrieve user information: ${res.status}`);
    return {
      payload: null,
      meta: {
        status: 'error',
      },
    };
  }
  return {
    payload: await res.json(),
    meta: {
      status: 'success',
    },
  };
}

export async function getOrgUserSpacesPage(
  orgGuid: string,
  userGuid: string
): Promise<ControllerResult> {
  const spacesRes = await CF.getSpaces([orgGuid]);
  if (!spacesRes.ok) {
    logDevError(
      `api error on cf org page with http code ${spacesRes.status} for url: ${spacesRes.url}`
    );
    throw new Error('something went wrong with the request');
  }
  const spacesPayload = (await spacesRes.json()).resources;
  const spaceGuids = spacesPayload.map(function (space: SpaceObj) {
    return space.guid;
  });

  const userRolesRes = await CF.getRoles({
    spaceGuids: spaceGuids,
    userGuids: [userGuid],
  });

  if (!userRolesRes.ok) {
    logDevError(
      `api error on cf org page with http code ${userRolesRes.status} for url: ${userRolesRes.url}`
    );
    throw new Error('something went wrong with the request');
  }

  const userRolesPayload = await userRolesRes.json();
  const userRolesBySpaceId = userRolesPayload.resources.reduce(
    (acc: any, item: any) => {
      const key = item.relationships.space.data.guid;
      acc[key] = key in acc ? acc[key].concat([item]) : [item];
      return acc;
    },
    {}
  );

  return {
    meta: { status: 'success' },
    payload: {
      roles: userRolesBySpaceId,
      spaces: sortObjectsByParam(spacesPayload, 'name'),
    },
  };
}

export async function removeUserFromOrg(
  allSpaceRoleGuids: string[],
  allOrgRoleGuids: string[]
): Promise<ControllerResult> {
  try {
    const spaceRolesResponses = await Promise.all(
      allSpaceRoleGuids.map((guid) => CF.deleteRole(guid))
    );
    const jobLocations = spaceRolesResponses.map((response) => {
      if (!response.ok) {
        throw new Error(
          'Unable to remove user from space role. Please try again'
        );
      }
      return response.headers.get('Location');
    });
    await Promise.all(jobLocations.map((loc) => pollForJobCompletion(loc)));
    const orgRoleResponses = await Promise.all(
      allOrgRoleGuids.map((guid) => CF.deleteRole(guid))
    );
    orgRoleResponses.map((response) => {
      if (!response.ok) {
        throw new Error(
          'Unable to remove user from org role. Please try again'
        );
      }
    });
    // Bust the Nextjs cache for getting the org users:
    // https://nextjs.org/docs/app/api-reference/functions/revalidatePath
    if (process.env.NODE_ENV !== 'test') {
      revalidatePath('/roles');
    }
    return {
      meta: {
        status: 'success',
      },
      payload: {},
    };
  } catch (e: any) {
    logDevError(`error in removeUserFromOrg: ${e.message}`);
    return {
      meta: {
        status: 'error',
        errors: [e.message],
      },
      payload: {},
    };
  }
}

export async function getEditOrgRoles(
  orgGuid: string,
  userGuid: string
): Promise<ControllerResult> {
  const args: GetRoleArgs = {
    userGuids: [userGuid],
    orgGuids: [orgGuid],
  };
  const response = await CF.getRoles(args);
  if (!response.ok) {
    logDevError(
      `api error on cf edit org page with http code ${response.status} for url: ${response.url}`
    );
    throw new Error(
      'Something went wrong with loading the form. Please try again later.'
    );
  }
  return {
    meta: { status: 'success' },
    payload: await response.json(),
  };
}
