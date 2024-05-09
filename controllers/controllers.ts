'use server';
/***/
// Library for translating UI actions to API requests and back
/***/

import * as CF from '../api/cf/cloudfoundry';

export interface OrgUser {
  displayName: string;
  origin: string;
  roles: OrgUserRole[];
  username: string;
}

export interface OrgUserRole {
  guid: string;
  type: CF.OrgRole;
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
      throw new Error(`${message.fail}: ${roleRes.status}`);
    }

    const roleResBody = await roleRes.json();

    return {
      success: true,
      status: 'success',
      body: roleResBody,
    };

    // TODO come back and rethink how this works now that we're redoing everything

    // for (const role of roleRes.body.resources) {
    //   const guid = role.guid;
    //   const deleteRes = await cfRequest('/roles/' + guid, 'delete');

    //   // TODO what do we want to do when we have multiple responses which may
    //   // have varying status codes, etc?
    //   combined.messages.push(...deleteRes.messages);
    //   combined.errors.push(...deleteRes.errors);
    // }
    // return combined;
  } catch (error: any) {
    throw new Error('failed to remove user from org: ' + error.message);
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
    const res = await CF.getRoles([guid], []);

    if (!res.ok) {
      // TODO rethink how we want the error handling to work here
      throw new Error(`${message.fail}: problem with getRoles ${res.status}`);
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
