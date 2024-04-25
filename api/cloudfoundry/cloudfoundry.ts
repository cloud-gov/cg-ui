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

interface NewRole {
  orgGuid: string;
  roleType: string;
  username: string;
}

// TODO consider a generic addCFResource function that
// will take care of headers like content-type and the token

export async function addCFOrgRole({ orgGuid, roleType, username }: NewRole) {
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

export async function getCFOrgUsers(guid: string) {
  return await getCFResources('/organizations/' + guid + '/users');
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
