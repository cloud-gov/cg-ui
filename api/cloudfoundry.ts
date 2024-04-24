'use server';
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
      },
    });
    const resData = await response.json();
    if (response.ok) {
      return resData;
    } else {
      throw new Error(
        `an error occurred with response code ${response.status}, error: ${resData.error}, error_description: ${resData.error_description}, original body: ${data}`
      );
    }
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
  return getCFResources('/organizations/' + guid + '/users');
}

export async function getCFOrgs() {
  return getCFResources('/organizations');
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

// if developing locally, uses the token you manually set
// otherwise, uses a token returned from UAA
function getToken(): string {
  return getLocalToken() || getCFToken();
}

function getCFToken(): string {
  const authSession = cookies().get('authsession');
  if (authSession === undefined) throw new Error();
  try {
    return JSON.parse(authSession.value).accessToken;
  } catch (error: any) {
    throw new Error('accessToken not found, please confirm you are logged in');
  }
}

function getLocalToken(): string | undefined {
  return process.env.CF_API_TOKEN;
}
