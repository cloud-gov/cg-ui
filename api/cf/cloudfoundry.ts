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

export type SpaceRole =
  | 'space_manager'
  | 'space_developer'
  | 'space_auditor'
  | 'space_supporter';

type MethodType = 'delete' | 'get' | 'patch' | 'post';

interface ApiRequestOptions {
  method: MethodType;
  headers: {
    Authorization: string;
    'Content-Type'?: string;
  };
  body?: any;
}

interface AddRoleApiData {
  type: string;
  relationships: {
    user: {
      data: {
        username: string;
      };
    };
    organization?: {
      data: {
        guid: string;
      };
    };
    space?: {
      data: {
        guid: string;
      };
    };
  };
}

interface addRoleArgs {
  orgGuid?: string;
  roleType: string;
  spaceGuid?: string;
  username: string;
}

export interface getRoleArgs {
  include?: string[];
  orgGuids?: string[];
  spaceGuids?: string[];
  userGuids?: string[];
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
}: addRoleArgs): Promise<Response> {
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

// TODO think about how we want to handle arguments for something
// that could be pretty flexible depending on what we need (no filters vs org filters vs includes, etc)
export async function getRoles({
  include,
  orgGuids,
  spaceGuids,
  userGuids,
}: getRoleArgs): Promise<Response> {
  // params are all comma separated lists
  const params: {
    include?: string;
    organization_guids?: string;
    space_guids?: string;
    user_guids?: string;
  } = {};
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
