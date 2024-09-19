// docs: https://nextjs.org/docs/app/building-your-application/routing/middleware
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { decodeJwt } from 'jose';
import { postToAuthTokenUrl, UAATokenResponseObj } from '@/api/auth';

export function login(request: NextRequest) {
  if (
    !process.env.UAA_ROOT_URL ||
    !process.env.UAA_AUTH_PATH ||
    !process.env.OAUTH_CLIENT_ID
  ) {
    throw new Error('UAA environment variables are not set');
  }
  const state = request.nextUrl.searchParams.get('state') || '';
  const loginUrl = new URL(
    process.env.UAA_ROOT_URL + process.env.UAA_AUTH_PATH
  );
  const params = new URLSearchParams(loginUrl.search);
  params.set('client_id', process.env.OAUTH_CLIENT_ID);
  params.set('state', state);
  params.set('response_type', 'code');
  const response = NextResponse.redirect(loginUrl + '?' + params.toString());
  response.cookies.set('state', state);
  return response;
}

export function logout() {
  if (
    !process.env.UAA_ROOT_URL ||
    !process.env.UAA_LOGOUT_PATH ||
    !process.env.ROOT_URL ||
    !process.env.AUTH_CALLBACK_PATH ||
    !process.env.OAUTH_CLIENT_ID
  ) {
    throw new Error('UAA environment variables are not set');
  }

  const logoutUrl = new URL(
    process.env.UAA_ROOT_URL + process.env.UAA_LOGOUT_PATH
  );
  const params = new URLSearchParams(logoutUrl.search);
  params.set('client_id', process.env.OAUTH_CLIENT_ID);
  params.set('redirect', process.env.ROOT_URL + process.env.AUTH_CALLBACK_PATH);
  const response = NextResponse.redirect(logoutUrl + '?' + params.toString());
  response.cookies.delete('authsession');
  return response;
}

export function setAuthCookie(
  data: UAATokenResponseObj,
  response: NextResponse
) {
  const decodedToken = decodeJwt(data.access_token);
  response.cookies.set(
    'authsession',
    JSON.stringify({
      accessToken: data.access_token,
      email: decodedToken.email,
      refreshToken: data.refresh_token,
      expiry: Date.now() + data.expires_in * 1000,
    })
  );
  return response;
}

export async function requestAndSetAuthToken(request: NextRequest) {
  if (
    !process.env.UAA_ROOT_URL ||
    !process.env.OAUTH_CLIENT_ID ||
    !process.env.OAUTH_CLIENT_SECRET
  ) {
    throw new Error('UAA environment variables are not set');
  }

  const stateCookie = request.cookies.get('state');
  let response = NextResponse.redirect(new URL('/', request.url));

  if (
    !stateCookie ||
    request.nextUrl.searchParams.get('state') != stateCookie['value']
  ) {
    return response;
  }
  const data = await postToAuthTokenUrl({
    code: request.nextUrl.searchParams.get('code') || '',
    grant_type: 'authorization_code',
    response_type: 'token',
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
  });
  response = setAuthCookie(data, response);
  response.cookies.delete('state');
  return response;
}

export async function refreshAuthToken(refreshToken: string) {
  if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET) {
    throw new Error('OAUTH environment variables are not set');
  }

  const data = await postToAuthTokenUrl({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
  });
  return data;
}

export async function authenticateRoute(request: NextRequest) {
  // get auth session cookie
  const authCookie = request.cookies.get('authsession');
  // if no cookie, redirect to login page
  if (!authCookie) return NextResponse.redirect(new URL('/', request.url));
  const authObj = JSON.parse(authCookie['value']);
  if (!authObj.expiry) return NextResponse.redirect(new URL('/', request.url));
  // if cookie expired, run refresh routine
  if (Date.now() > authObj.expiry) {
    const newAuthResponse = await refreshAuthToken(authObj.refreshToken);
    let nextRes = NextResponse.next();
    nextRes = setAuthCookie(newAuthResponse, nextRes);
    return nextRes;
  }
  // cookie is not expired, go to page
  return NextResponse.next();
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/test/authenticated')) {
    return authenticateRoute(request);
  }
  if (request.nextUrl.pathname.startsWith('/login')) {
    return login(request);
  }
  if (request.nextUrl.pathname.startsWith('/logout')) {
    return logout();
  }
  if (request.nextUrl.pathname.startsWith('/auth/login/callback')) {
    return requestAndSetAuthToken(request);
  }
}

// regex can be used here using path-to-regexp:
// https://github.com/pillarjs/path-to-regexp#path-to-regexp-1
// TODO: not sure why I'd need both route matching and conditionals above
export const config = {
  matcher: [
    '/auth/login/callback',
    '/logout',
    '/login',
    '/test/authenticated/:path*',
  ],
};
