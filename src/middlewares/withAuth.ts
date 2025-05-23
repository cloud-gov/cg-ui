import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from 'next/server';
import { MiddlewareFactory } from './types';
import { decodeJwt } from 'jose';
import { postToAuthTokenUrl, UAATokenResponseObj } from '@/api/auth';
import { logInPath } from '@/helpers/authentication';

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
      user_id: decodedToken.user_id,
      user_name: decodedToken.user_name,
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
  let response;
  let lastPagePath;
  if ((lastPagePath = request.cookies.get('last_page')?.value)) {
    response = NextResponse.redirect(new URL(lastPagePath, request.url));
  } else {
    response = NextResponse.redirect(new URL('/', request.url));
  }

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
  response.cookies.delete('last_page');
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

export function redirectToLogin(request: NextRequest): NextResponse {
  const loginPath = logInPath();
  const response = NextResponse.redirect(new URL(loginPath, request.url));
  response.cookies.set('last_page', request.nextUrl.pathname);
  return response;
}

export async function authenticateRoute(request: NextRequest) {
  let response = NextResponse.next();
  // get auth session cookie
  const authCookie = request.cookies.get('authsession');
  // if no cookie, redirect to login page
  if (!authCookie) return redirectToLogin(request);

  const authObj = JSON.parse(authCookie['value']);
  // if no expiration at all, redirect to login page
  if (!authObj.expiry) return redirectToLogin(request);
  // if cookie expired, run refresh routine
  if (Date.now() > authObj.expiry) {
    const newAuthResponse = await refreshAuthToken(authObj.refreshToken);
    response = setAuthCookie(newAuthResponse, response);
    return response;
  }
  // they're logged in already
  response = setLastViewedOrg(request, response);
  // go to page
  return response;
}

export function setLastViewedOrg(request: NextRequest, response: NextResponse) {
  const matches = request.nextUrl.pathname.match(
    /orgs\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})/
  );
  let id;
  if (matches && (id = matches[1])) {
    response.cookies.set('lastViewedOrgId', id);
  }
  return response;
}

export const withAuth: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pn = request.nextUrl.pathname;
    if (pn.startsWith('/test/authenticated') || pn.startsWith('/orgs')) {
      return authenticateRoute(request);
    }
    if (pn.startsWith('/login')) {
      return login(request);
    }
    if (pn.startsWith('/logout')) {
      return logout();
    }
    if (pn.startsWith('/auth/login/callback')) {
      return requestAndSetAuthToken(request);
    }

    return next(request, _next);
  };
};
