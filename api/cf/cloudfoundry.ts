'use server';

/***/
// API library for cloud foundry requests
/***/

import { cfRequest, prepPathParams } from './cloudfoundry-helpers';
import {
  AddRoleApiData,
  AddRoleArgs,
  GetAppArgs,
  GetRoleArgs,
  GetServiceCredentialBindingsArgs,
  GetSpaceArgs,
} from './cloudfoundry-types';

/***/
// ENDPOINT SPECIFIC FUNCTIONS
/***/

// APPS

export async function getApp(guid: string): Promise<Response> {
  return await cfRequest('/apps/' + guid, 'get');
}

export async function getAppProcesses(guid: string): Promise<Response> {
  return await cfRequest(`/apps/${guid}/processes`, 'get');
}

export async function getApps({ ...args }: GetAppArgs = {}): Promise<Response> {
  // set per_page to maximum allowed value
  const pathParams = await prepPathParams({ ...args, per_page: '5000' });
  return await cfRequest('/apps' + pathParams);
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
  userGuid,
}: AddRoleArgs): Promise<Response> {
  const userData = {} as AddRoleApiData['relationships']['user']['data'];
  if (username) userData.username = username;
  if (userGuid) userData.guid = userGuid;
  const data: AddRoleApiData = {
    type: roleType,
    relationships: {
      user: {
        data: userData,
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
  ...args
}: GetRoleArgs = {}): Promise<Response> {
  // params are all comma separated lists
  const pathParams = await prepPathParams({ ...args, per_page: '5000' });
  return await cfRequest('/roles' + pathParams);
}

// SERVICES

export async function getServiceCredentialBindings({
  ...args
}: GetServiceCredentialBindingsArgs): Promise<Response> {
  const pathParams = await prepPathParams(args);
  return await cfRequest('/service_credential_bindings' + pathParams);
}

// SPACES

export async function getSpace(guid: string): Promise<Response> {
  return await cfRequest('/spaces/' + guid, 'get');
}

export async function getSpaces({
  ...args
}: GetSpaceArgs = {}): Promise<Response> {
  const pathParams = await prepPathParams(args);
  return await cfRequest('/spaces' + pathParams);
}

// USERS

export async function getUser(guid: string): Promise<Response> {
  return await cfRequest('/users/' + guid, 'get');
}
