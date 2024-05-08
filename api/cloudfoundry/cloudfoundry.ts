'use server';
/***/
// API library for cloud foundry requests
/***/

import { request } from '../api';
import { getToken } from './token';

const CF_API_URL = process.env.CF_API_URL;

// the CF API sends back a similar response for 404 and 422 errors
interface Cf40XError {
  detail: string;
  title: string;
  code: number;
}

interface CfOrgUserRole {
  guid: string;
  type: 'organization_manager' | 'organizion_user' | 'organization_auditor';
}

export interface CfOrgUser {
  displayName: string;
  origin: string;
  roles: CfOrgUserRole[];
  username: string;
}

export interface CfOrgUserRoleList {
  [guid: string]: CfOrgUser;
}

type MethodType = 'delete' | 'get' | 'patch' | 'post';

interface ApiRequestOptions {
  method: MethodType;
  headers: {
    Authorization: string;
    'Content-Type'?: string;
  };
  body?: any;
}

interface ApiResponse {
  status: ApiResponseStatus | undefined;
  messages: string[];
  body?: any;
}

// drawing status from USWDS alert types: https://designsystem.digital.gov/components/alert/
type ApiResponseStatus = 'success' | 'info' | 'warning' | 'error';

interface SetOrgUserRole {
  orgGuid: string;
  roleType: string;
  username: string;
}

export async function cfRequest(
  path: string,
  method: MethodType = 'get',
  data?: any
): Promise<ApiResponse> {
  try {
    const options = await cfRequestOptions(method, data);
    const apiRes = await request(CF_API_URL + path, options);
    return cfResponse(apiRes);
  } catch (error: any) {
    console.error(`${method} request to ${path} failed: ${error.message}`);
    return {
      status: 'error',
      messages: [error.message],
    };
  }
}

async function cfRequestOptions(
  method: MethodType,
  data: any
): Promise<ApiRequestOptions> {
  const options: ApiRequestOptions = {
    method: method,
    headers: {
      Authorization: `bearer ${getToken()}`,
    },
  };
  if (data) {
    options.body = JSON.stringify(data);
    options.headers['Content-Type'] = 'application/json';
  }
  return options;
}

async function cfResponse(apiRes: any): Promise<ApiResponse> {
  if (apiRes.ok) {
    return {
      status: 'success',
      messages: [apiRes.statusText],
      // 202 responses do not have any json to parse
      body: apiRes.status != 202 ? await apiRes.json() : undefined,
    };
  } else if (apiRes.status == 422) {
    const msg = await apiRes.json();
    return {
      status: 'error',
      messages: msg.errors.map((e: Cf40XError) => e.detail),
    };
  }

  return {
    status: 'error',
    messages: [apiRes.statusText],
  };
}

// Endpoint specific functions

export async function addCFOrgRole({
  orgGuid,
  roleType,
  username,
}: SetOrgUserRole): Promise<ApiResponse> {
  const data = {
    type: roleType,
    relationships: {
      user: {
        data: {
          username: username,
        },
      },
      organization: {
        data: {
          guid: orgGuid,
        },
      },
    },
  };
  try {
    return await cfRequest('/roles', 'post', data);
  } catch (error: any) {
    console.error(
      `Unable to add org role ${roleType} for ${username} and org ${orgGuid}: ${error.message}`
    );
    return {
      status: 'error',
      messages: ['failed to add ' + username + ' as a ' + roleType],
    };
  }
}

export async function deleteCFRole(roleGuid: string) {
  return await cfRequest('/roles/' + roleGuid, 'delete');
}

export async function deleteCFOrgUser(
  orgGuid: string,
  userGuid: string
): Promise<ApiResponse> {
  // TODO we technically already have a list of the org member roles on the page --
  // do we want to pass those from the form instead of having a separate API call here?
  try {
    const params = new URLSearchParams({
      organization_guids: orgGuid,
      user_guids: userGuid,
    });
    const roleRes = await cfRequest('/roles?' + params.toString());
    if (roleRes.status != 'success') {
      throw new Error(roleRes.messages.join(', '));
    }

    const responses = await Promise.all(
      roleRes.body.resources.map((role: any) =>
        cfRequest('/roles/' + role.guid, 'delete')
      )
    );

    // if any responses were not successful, throw an error so it can be logged and returned to the user
    if (responses.some((res) => res.status != 'success')) {
      throw new Error();
    }

    return {
      status: 'success',
      messages: [],
    };
  } catch (error: any) {
    console.error(
      `failed to remove user ${userGuid} from org ${orgGuid}: ${error.message}`
    );
    return {
      status: 'error',
      messages: ['failed to remove user from org'],
    };
  }
}

export async function getCFApps() {
  return await cfRequest('/apps', 'get');
}

export async function getCFOrg(guid: string) {
  return await cfRequest('/organizations/' + guid, 'get');
}

// getCFOrgUsers uses the `/roles` endpoint and manipulates the response
// to return a list of users and their roles for an organization.
// This is in contrast to the `/organizations/[guid]/users` endpoint, which
// does not return role information
export async function getCFOrgUsers(guid: string): Promise<CfOrgUserRoleList> {
  try {
    const params = new URLSearchParams({
      organization_guids: guid,
      include: 'user',
    });
    const res = await cfRequest('/roles?' + params.toString());
    if (res.status != 'success') {
      throw new Error(res.messages.join(', '));
    }
    // build a hash of the users we can push roles onto
    const users: CfOrgUserRoleList = {};
    for (const user of res.body.included.users) {
      users[user.guid] = {
        displayName: user.presentation_name,
        origin: user.origin,
        roles: [],
        username: user.username,
      };
    }
    // iterate through the roles and attach to individual users
    for (const role of res.body.resources) {
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
    console.error(
      `failed to get org user roles for org ${guid}: ${error.message}`
    );
    throw new Error('failed to get org user roles: ' + error.message);
  }
}

export async function getCFOrgs() {
  return await cfRequest('/organizations', 'get');
}
