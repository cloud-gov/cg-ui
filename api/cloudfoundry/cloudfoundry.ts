'use server';
/***/
// API library for cloud foundry requests
/***/

import { request } from '../api';
import { getToken } from './token';

const CF_API_URL = process.env.CF_API_URL;

interface Cf422Error {
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
  statusCode: number | undefined;
  errors: string[];
  messages: string[];
  body: any | undefined;
}

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
    return {
      statusCode: undefined,
      errors: [error.message],
      messages: [],
      body: undefined,
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
  const res: ApiResponse = {
    statusCode: apiRes.status,
    errors: [],
    messages: [],
    body: undefined,
  };
  if (apiRes.status == 202) {
    // indicates resource was deleted successfully, no response body
    res.messages.push(apiRes.statusText);
  } else if (apiRes.ok) {
    res.messages.push(apiRes.statusText);
    res.body = await apiRes.json();
  } else if (apiRes.status == 422) {
    const msg = await apiRes.json();
    res.errors = msg.errors.map((e: Cf422Error) => e.detail);
  } else {
    res.errors.push(apiRes.statusText);
  }
  return res;
}

// Endpoint specific functions

export async function addCFOrgRole({
  orgGuid,
  roleType,
  username,
}: SetOrgUserRole) {
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
    const response = await cfRequest('/roles', 'post', data);
    return response;
  } catch (error: any) {
    throw new Error(`${error.message}, original body: ${JSON.stringify(data)}`);
  }
}

export async function deleteCFRole(roleGuid: string) {
  return await cfRequest('/roles/' + roleGuid, 'delete');
}

export async function deleteCFOrgUser(orgGuid: string, userGuid: string) {
  // TODO we technically already have a list of the org member roles on the page --
  // do we want to pass those from the form instead of having a separate API call here?
  try {
    const params = new URLSearchParams({
      organization_guids: orgGuid,
      user_guids: userGuid,
    });
    const roleRes = await cfRequest('/roles?' + params.toString());
    if (roleRes.errors.length > 0) {
      throw new Error(roleRes.errors.join(', '));
    }

    const combined: { messages: string[]; errors: string[] } = {
      messages: [],
      errors: [],
    };
    for (const role of roleRes.body.resources) {
      const guid = role.guid;
      const deleteRes = await cfRequest('/roles/' + guid, 'delete');

      // TODO what do we want to do when we have multiple responses which may
      // have varying status codes, etc?
      combined.messages.push(...deleteRes.messages);
      combined.errors.push(...deleteRes.errors);
    }
    return combined;
  } catch (error: any) {
    throw new Error('failed to remove user from org: ' + error.message);
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
    if (res.errors.length > 0) {
      throw new Error(res.errors.join(', '));
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
    throw new Error('failed to get org user roles: ' + error.message);
  }
}

export async function getCFOrgs() {
  return await cfRequest('/organizations', 'get');
}
