import { cookies } from 'next/headers';

export async function getToken(): Promise<string> {
  return getLocalToken() || (await getCFToken());
}

async function getCFToken(): Promise<string> {
  const cookieStore = await cookies();
  const authSession = cookieStore.get('authsession');
  if (authSession === undefined)
    throw new Error('please confirm you are logged in');
  try {
    return JSON.parse(authSession.value).accessToken;
  } catch (error: any) {
    throw new Error(`unable to parse accessToken: ${error}`);
  }
}

function getLocalToken(): string | undefined {
  return process.env.CF_API_TOKEN;
}

export async function isLoggedIn(): Promise<boolean> {
  try {
    // Note: this only checks the auth cookie, not the CF_API_TOKEN when working locally
    const token = await getCFToken();
    return !!token;
  } catch {
    return false;
  }
}

export async function getUserId() {
  return getLocalUserId() || (await getCFUserId());
}

export function getLocalUserId() {
  return process.env.CF_USER_ID;
}

export async function getCFUserId() {
  const cookieStore = await cookies();
  const authSession = cookieStore.get('authsession');
  if (authSession === undefined)
    throw new Error('please confirm you are logged in');
  try {
    return JSON.parse(authSession.value).user_id;
  } catch (error: any) {
    throw new Error(`unable to parse authsession user_id: ${error}`);
  }
}
