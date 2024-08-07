import { cookies } from 'next/headers';

// if developing locally, uses the token you manually set
// otherwise, uses a token returned from UAA
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
