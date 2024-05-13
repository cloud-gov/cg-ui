'use server';
/***/
// Library for translating UI actions to API requests and back
/***/

import * as CF from '@api/cf/cloudfoundry';

interface AddOrgRoleArgs {
  orgGuid: string;
  roleType: CF.OrgRole;
  username: string;
}

export interface OrgUser {
  displayName: string;
  origin: string;
  roles: {
    guid: string;
    type: CF.OrgRole;
  }[];
  username: string;
}

export interface OrgUserRoleList {
  [guid: string]: OrgUser;
}

export interface Result {
  success: boolean;
  status?: ResultStatus;
  message?: string;
  payload?: any;
}

// taken from USWDS alert options: https://designsystem.digital.gov/components/alert/
type ResultStatus = 'success' | 'info' | 'warning' | 'error' | 'emergency';

interface UserMessage {
  success?: string;
  fail?: string;
}

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
      payload: apiResponse.status == 202 ? undefined : await apiResponse.json(),
    };
  } else if (apiResponse.status == 422) {
    const cfPayload = await apiResponse.json();
    if (process.env.NODE_ENV == 'development') {
      console.error(
        `${message ? message.fail : '422 error with cf request'}: ${JSON.stringify(cfPayload)}`
      );
    }
    return {
      success: false,
      status: 'error',
      message: message ? message.fail : undefined,
      payload: cfPayload,
    };
  }

  if (process.env.NODE_ENV == 'development') {
    console.error(
      `${message ? message.fail : 'error with cf request'}: ${apiResponse.status}`
    );
  }
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

export async function deleteOrgUser(
  orgGuid: string,
  userGuid: string
): Promise<Result> {
  // TODO we technically already have a list of the org member roles on the page --
  // do we want to pass those from the form instead of having a separate API call here?
  const message = {
    success: `removed ${userGuid} from org`,
    fail: `unable to remove ${userGuid} from org`,
  };
  try {
    const roleRes = await CF.getRoles([orgGuid], [userGuid]);

    if (!roleRes.ok) {
      // TODO probably want better logging here
      throw new Error(`${roleRes.status}`);
    }

    const roleResJson = await roleRes.json();

    const responses = await Promise.all(
      roleResJson.resources.map((role: any) => CF.deleteRole(role.guid))
    );

    // if any responses were not successful, throw an error so it can be logged and returned to the user
    if (responses.some((res: Response) => !res.ok)) {
      throw new Error('failed to remove all roles');
    }

    return {
      success: true,
      status: 'success',
      message: message.success,
    };
  } catch (error: any) {
    throw new Error(`${message.fail}: ${error.message}`);
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
    if (process.env.NODE_ENV == 'development') {
      console.error(`${message.fail}: ${error.message}`);
    }
    return {
      success: false,
      status: 'error',
      message: message.fail,
    };
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
    if (process.env.NODE_ENV == 'development') {
      console.error(`${message.fail}: ${error.message}`);
    }
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
    return await mapCfResult(res, message);
  } catch (error: any) {
    if (process.env.NODE_ENV == 'development') {
      console.error(`${message.fail}: ${error.message}`);
    }
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
    if (process.env.NODE_ENV == 'development') {
      console.error(`${message.fail}: ${error.message}`);
    }
    return {
      success: false,
      status: 'error',
      message: message.fail,
    };
  }
}

export async function getOrgUsers(guid: string): Promise<Result> {
  const message = {
    fail: 'unable to list the org users',
  };
  try {
    const res = await CF.getRoles([guid], [], ['user']);

    if (!res.ok) {
      // TODO rethink how we want the error handling to work here
      throw new Error(`problem with getRoles ${res.status}`);
    }

    const payload = await res.json();
    // build a hash of the users we can push roles onto
    const users: OrgUserRoleList = {};
    for (const user of payload.included.users) {
      users[user.guid] = {
        displayName: user.presentation_name,
        origin: user.origin,
        roles: [],
        username: user.username,
      };
    }
    // iterate through the roles and attach to individual users
    for (const role of payload.resources) {
      const userGuid = role.relationships.user.data.guid;
      if (userGuid in users) {
        users[userGuid].roles.push({
          type: role.type,
          guid: role.guid,
        });
      }
    }
    return {
      success: true,
      status: 'success',
      payload: users,
    };
  } catch (error: any) {
    throw new Error(`${message.fail}: ${error.message}`);
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
    if (process.env.NODE_ENV == 'development') {
      console.error(`${message.fail}: ${error.message}`);
    }
    return {
      success: false,
      status: 'error',
      message: message.fail,
    };
  }
}

export async function getSpaces(org_guids: string[]): Promise<Result> {
  const message = {
    fail: 'unable to list the organization spaces',
  };
  try {
    const res = await CF.getSpaces(org_guids);
    return await mapCfResult(res, message);
  } catch (error: any) {
    if (process.env.NODE_ENV == 'development') {
      console.error(`${message.fail}: ${error.message}`);
    }
    return {
      success: false,
      status: 'error',
      message: message.fail,
    };
  }
}
