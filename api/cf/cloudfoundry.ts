'use server';
/***/
// API library for cloud foundry requests
/***/

import { request } from '../api';
import { getToken } from './token';
import { AddRoleApiData, AddRoleArgs, GetRoleArgs } from './cloudfoundry-types';

const CF_API_URL = process.env.CF_API_URL;

type MethodType = 'delete' | 'get' | 'patch' | 'post';

interface ApiRequestOptions {
  method: MethodType;
  headers: {
    Authorization: string;
    'Content-Type'?: string;
  };
  body?: any;
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
    if (process.env.NODE_ENV == 'development') {
      console.error(
        `request to ${path} with method ${method} failed: ${error.statusCode} -- ${error.message}`
      );
    }
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
  spaceGuid,
  username,
}: AddRoleArgs): Promise<Response> {
  const data: AddRoleApiData = {
    type: roleType,
    relationships: {
      user: {
        data: {
          username: username,
        },
      },
    },
  };
  if (orgGuid) {
    data.relationships.organization = {
      data: { guid: orgGuid },
    };
  }
  if (spaceGuid) {
    data.relationships.space = {
      data: { guid: spaceGuid },
    };
  }
  return await cfRequest('/roles', 'post', data);
}

export async function deleteRole(roleGuid: string): Promise<Response> {
  return await cfRequest('/roles/' + roleGuid, 'delete');
}

// note: filters work as an "and" in the CF list roles API
// therefore, if you try to filter by both an org and a space GUID you
// will receive 0 results
export async function getRoles({
  include,
  orgGuids,
  spaceGuids,
  userGuids,
}: GetRoleArgs): Promise<Response> {
  // params are all comma separated lists
  const params: {
    include?: string;
    organization_guids?: string;
    per_page: string;
    space_guids?: string;
    user_guids?: string;
  } = {
    // set to max allowed value
    per_page: '5000',
  };
  if (include && include.length > 0) {
    params['include'] = include.join(',');
  }
  if (orgGuids && orgGuids.length > 0) {
    params['organization_guids'] = orgGuids.join(',');
  }
  if (spaceGuids && spaceGuids.length > 0) {
    params['space_guids'] = spaceGuids.join(',');
  }
  if (userGuids && userGuids.length > 0) {
    params['user_guids'] = userGuids.join(',');
  }
  const urlParams = new URLSearchParams(params);
  return await cfRequest('/roles?' + urlParams.toString());
}

// SPACES

export async function getSpace(guid: string): Promise<Response> {
  return await cfRequest('/spaces/' + guid, 'get');
}

export async function getSpaces(org_guids?: string[]): Promise<Response> {
  if (org_guids && org_guids.length > 0) {
    const params = new URLSearchParams({
      organization_guids: org_guids.join(','),
    });
    return await cfRequest('/spaces?' + params.toString());
  }
  return await cfRequest('/spaces');
}
