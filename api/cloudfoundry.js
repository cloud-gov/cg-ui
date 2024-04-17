/***/
// API library for cloud foundry requests
/***/
import { cookies } from 'next/headers';
import { getData } from './api';

const CF_API_URL = process.env.CF_API_URL;
const token = getToken();

export async function getCFApps() {
  try {
    const body = await getData(CF_API_URL + '/apps', {
      headers: {
        Authorization: token,
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

// if developing locally, uses the token you manually set
// otherwise, uses a token returned from UAA
export function getToken() {
  return getLocalToken() || getCFToken();
}

export function getCFToken() {
  const authSession = cookies().get('authsession');
  try {
    return JSON.parse(authSession.value).accessToken;
  } catch (error) {
    throw new Error('accessToken not found, please confirm you are logged in');
  }
}

export function getLocalToken() {
  return process.env.CF_API_TOKEN;
}
