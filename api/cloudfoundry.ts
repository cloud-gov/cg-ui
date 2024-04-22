/***/
// API library for cloud foundry requests
/***/
import { cookies } from 'next/headers';
import { addData, deleteData, getData } from './api';

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

export async function addCFOrgRole({ orgGuid, roleType, username }: NewRole) {
  try {
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
    return await addData(CF_API_URL + '/roles', data);
  } catch (error: any) {
    throw new Error(`failed to add user to org: ${error.message}`);
  }
}

export async function deleteCFOrgRole(roleGuid: string) {
  try {
    return await deleteData(CF_API_URL + '/roles/' + roleGuid);
  } catch (error: any) {
    throw new Error(`failed to remove user from org: ${error.message}`);
  }
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

export async function getCFApps() {
  return getCFResources('/apps');
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
  return getCFResources('/organizations/' + guid + '/users');
}

export async function getCFOrgs() {
  return getCFResources('/organizations');
}

// if developing locally, uses the token you manually set
// otherwise, uses a token returned from UAA
export function getToken(): string {
  return getLocalToken() || getCFToken();
}

export function getCFToken(): string {
  const authSession = cookies().get('authsession');
  if (authSession === undefined) throw new Error();
  try {
    return JSON.parse(authSession.value).accessToken;
  } catch (error: any) {
    throw new Error('accessToken not found, please confirm you are logged in');
  }
}

export function getLocalToken(): string | undefined {
  return process.env.CF_API_TOKEN;
}
