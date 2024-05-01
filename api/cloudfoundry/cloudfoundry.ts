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
  statusCode: number;
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
) {
  const options = await cfRequestOptions(method, data);
  const apiRes = await request(CF_API_URL + path, options);
  return cfResponse(apiRes);
}

async function cfRequestOptions(method: MethodType, data: any) {
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

export async function deleteCFOrgRole(roleGuid: string) {
  return await cfRequest('/roles/' + roleGuid, 'delete');
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
  const url = '/roles?organization_guids=' + guid + '&include=user';
  try {
    const res = await cfRequest(url);
    // build a hash of the users we can push roles onto
    const users: CfOrgUserRoleList = {};
    for (const user of res.body.included.users) {
      users[user.guid] = {
        username: user.username,
        origin: user.origin,
        roles: [],
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
    throw new Error('failed to get org user roles ' + error.message);
  }
}

export async function getCFOrgs() {
  return await cfRequest('/organizations', 'get');
}
