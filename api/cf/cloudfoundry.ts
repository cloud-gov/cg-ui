'use server';
/***/
// API library for cloud foundry requests
/***/

import { request } from '../api';
import { getToken } from './token';

const CF_API_URL = process.env.CF_API_URL;

export type OrgRole =
  | 'organization_manager'
  | 'organizion_user'
  | 'organization_auditor';

type MethodType = 'delete' | 'get' | 'patch' | 'post';

interface ApiRequestOptions {
  method: MethodType;
  headers: {
    Authorization: string;
    'Content-Type'?: string;
  };
  body?: any;
}

interface addRoleForUsernameArgs {
  orgGuid?: string;
  roleType: string;
  username: string;
}

export async function cfRequest(
  path: string,
  method: MethodType = 'get',
  data?: any
): Promise<Response> {
  try {
    const options = await cfRequestOptions(method, data);
    return await request(CF_API_URL + path, options);
  } catch (error: any) {
    console.error(
      `request to ${path} with method ${method} failed: ${error.statusCode} -- ${error.message}`
    );
    throw new Error(`something went wrong: ${error.message}`);
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

/***/
// ENDPOINT SPECIFIC FUNCTIONS
/***/

// APPS

export async function getApps(): Promise<Response> {
  return await cfRequest('/apps', 'get');
}

// ORGANIZATIONS

export async function getOrg(guid: string): Promise<Response> {
  return await cfRequest('/organizations/' + guid, 'get');
}

export async function getOrgs(): Promise<Response> {
  return await cfRequest('/organizations', 'get');
}

// ROLES

// NOTE: addRole relies on username rather than user guid
export async function addRole({
  orgGuid,
  roleType,
  username,
}: addRoleForUsernameArgs): Promise<Response> {
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
  return await cfRequest('/roles', 'post', data);
}

export async function deleteRole(roleGuid: string): Promise<Response> {
  return await cfRequest('/roles/' + roleGuid, 'delete');
}

// TODO think about how we want to handle arguments for something
// that could be pretty flexible depending on what we need (no filters vs org filters vs includes, etc)
export async function getRoles(
  orgGuids: string[],
  userGuids: string[]
): Promise<Response> {
  const params = new URLSearchParams({
    organization_guids: orgGuids.join(','),
    user_guids: userGuids.join(','),
    // current behavior is to always assume we want access to usernames
    include: 'user',
  });
  return await cfRequest('/roles?' + params.toString());
}
