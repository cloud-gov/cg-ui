import { cookies } from 'next/headers';

export function getToken(): string {
  return getLocalToken() || getCFToken();
}

function getCFToken(): string {
  const authSession = cookies().get('authsession');
  if (authSession === undefined)
    throw new Error('please confirm you are logged in');
  try {
    return JSON.parse(authSession.value).accessToken;
  } catch (error: any) {
    throw new Error('unable to parse accessToken');
  }
}

function getLocalToken(): string | undefined {
  return process.env.CF_API_TOKEN;
}

export function isLoggedIn(): boolean {
  try {
    // Note: this only checks the auth cookie, not the CF_API_TOKEN when working locally
    const token = getCFToken();
    return !!token;
  } catch (error: any) {
    return false;
  }
}

export function getUserId() {
  return getLocalUserId() || getCFUserId();
}

export function getLocalUserId() {
  return process.env.CF_USER_ID;
}

export function getCFUserId() {
  const authSession = cookies().get('authsession');
  if (authSession === undefined)
    throw new Error('please confirm you are logged in');
  try {
    return JSON.parse(authSession.value).user_id;
  } catch (error: any) {
    throw new Error('unable to parse authsession user_id');
  }
}
