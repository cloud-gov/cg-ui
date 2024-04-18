/***/
// API library for cloud foundry requests
/***/
import { cookies } from 'next/headers';
import { getData } from './api';

const CF_API_URL = process.env.CF_API_URL;

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
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function getCFApps() {
  return getCFResources('/apps');
}

export async function getCFOrg(guid: string) {
  try {
    const body = await getData(CF_API_URL + '/organizations/' + guid, {
      headers: {
        Authorization: `bearer ${getToken()}`,
      },
    });
    if (body) {
      return body;
    } else {
      throw new Error('resources not found');
    }
  } catch (error) {
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
  } catch (error) {
    throw new Error('accessToken not found, please confirm you are logged in');
  }
}

export function getLocalToken(): string | undefined {
  return process.env.CF_API_TOKEN;
}
