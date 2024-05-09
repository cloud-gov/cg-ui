'use server';
/***/
// Library for translating UI actions to API requests and back
/***/

import * as CF from '../api/cf/cloudfoundry';

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

interface Result {
  success: boolean | undefined;
  status?: ResultStatus;
  message?: string;
  body?: any;
}

// taken from USWDS alert options: https://designsystem.digital.gov/components/alert/
type ResultStatus = 'success' | 'info' | 'warning' | 'error' | 'emergency';

interface UserMessage {
  success?: string;
  fail?: string;
}

// maps cloud foundry fetch response to user friendly message
async function mapCfResult(
  apiResponse: Response,
  message?: UserMessage
): Promise<Result> {
  if (apiResponse.ok) {
    return {
      success: true,
      status: 'success',
      message: message ? message.success : undefined,
      // 202 (successful delete) does not return any body
      body: apiResponse.status == 202 ? undefined : await apiResponse.json(),
    };
  } else if (apiResponse.status == 422) {
    return {
      success: false,
      status: 'error',
      message: message ? message.fail : undefined,
      body: await apiResponse.json(),
    };
  }
  return {
    success: false,
    status: 'error',
    message: message ? message.fail : undefined,
  };
}

export async function addOrgRole(
  orgGuid: string,
  roleType: CF.OrgRole,
  username: string
): Promise<Result> {
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
    console.log(`${message.fail}: ${error.message}`);
    return {
      success: false,
      status: 'error',
      message: message.fail,
    };
  }
}

export async function deleteOrgUser(orgGuid: string, userGuid: string) {
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

    const roleResBody = await roleRes.json();

    const responses = await Promise.all(
      roleResBody.resources.map((role: any) => CF.deleteRole(role.guid))
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

export async function getApps(): Promise<Result> {
  const message = {
    fail: 'unable to list applications',
  };
  try {
    const res = await CF.getApps();
    return await mapCfResult(res, message);
  } catch (error: any) {
    console.error(`${message.fail}: ${error.message}`);
    return {
      success: false,
      status: 'error',
      message: message.fail,
    };
  }
}

export async function getOrgUsers(guid: string): Promise<OrgUserRoleList> {
  const message = {
    fail: 'unable to get list of users',
  };
  try {
    const res = await CF.getRoles([guid], [], ['user']);

    if (!res.ok) {
      // TODO rethink how we want the error handling to work here
      throw new Error(`problem with getRoles ${res.status}`);
    }

    const body = await res.json();
    // build a hash of the users we can push roles onto
    const users: OrgUserRoleList = {};
    for (const user of body.included.users) {
      users[user.guid] = {
        displayName: user.presentation_name,
        origin: user.origin,
        roles: [],
        username: user.username,
      };
    }
    // iterate through the roles and attach to individual users
    for (const role of body.resources) {
      const userGuid = role.relationships.user.data.guid;
      if (userGuid in users) {
        users[userGuid].roles.push({
          type: role.type,
          guid: role.guid,
        });
      }
    }
    return users;
  } catch (error: any) {
    throw new Error(`${message.fail}: ${error.message}`);
  }
}
