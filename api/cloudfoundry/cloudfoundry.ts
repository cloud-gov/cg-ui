'use server';
/***/
// API library for cloud foundry requests
/***/

import { addData, deleteData, getData } from '../api';
import { getToken } from './token';

const CF_API_URL = process.env.CF_API_URL;

interface CfOrg {
  guid: string;
  created_at: string;
  updated_at: string;
  name: string;
  suspended: boolean;
  // relationships, metadata, and links are all objects, but as we
  // do not rely on them existing yet, they are not defined in the interface
  relationships: any;
  metadata: any;
  links: any;
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

interface SetOrgUserRole {
  orgGuid: string;
  roleType: string;
  username: string;
}

// TODO consider a generic addCFResource function that
// will take care of headers like content-type and the token

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
    const response = await addData(CF_API_URL + '/roles', data, {
      headers: {
        Authorization: `bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error: any) {
    throw new Error(`${error.message}, original body: ${JSON.stringify(data)}`);
  }
}

export async function deleteCFResource(path: string) {
  try {
    return await deleteData(CF_API_URL + path, {
      headers: {
        Authorization: `bearer ${getToken()}`,
      },
    });
  } catch (error: any) {
    throw new Error(`failed to remove user from org: ${error.message}`);
  }
}

export async function deleteCFOrgRole(roleGuid: string) {
  return await deleteCFResource('/roles/' + roleGuid);
}

export async function getCFApps() {
  return await getCFResources('/apps');
}

export async function getCFOrg(guid: string): Promise<CfOrg> {
  try {
    const body = await getData(CF_API_URL + '/organizations/' + guid, {
      headers: {
        Authorization: `bearer ${getToken()}`,
      },
    });
    if (body) {
      return body;
    } else {
      throw new Error('resource not found');
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// getCFOrgUsers uses the `/roles` endpoint and manipulates the response
// to return a list of users and their roles for an organization.
// This is in contrast to the `/organizations/[guid]/users` endpoint, which
// does not return role information
export async function getCFOrgUsers(guid: string): Promise<CfOrgUserRoleList> {
  const url =
    CF_API_URL + '/roles?organization_guids=' + guid + '&include=user';
  try {
    const body = await getData(url, {
      headers: {
        Authorization: `bearer ${getToken()}`,
      },
    });
    // build a hash of the users we can push roles onto
    const users: CfOrgUserRoleList = {};
    for (const user of body.included.users) {
      users[user.guid] = {
        username: user.username,
        origin: user.origin,
        roles: [],
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
    throw new Error('failed to get org user roles ' + error.message);
  }
}

export async function getCFOrgs() {
  return await getCFResources('/organizations');
}

export async function getCFResources(resourcePath: string) {
  try {
    const body = await getData(CF_API_URL + resourcePath, {
      headers: {
        Authorization: `bearer ${getToken()}`,
      },
    });
    if (body.resources) {
      return body.resources;
    } else {
      throw new Error('resources not found');
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}
