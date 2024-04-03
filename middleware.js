// docs: https://nextjs.org/docs/app/building-your-application/routing/middleware
import { NextResponse } from 'next/server';
import { decodeJwt } from 'jose';
import { postToAuthTokenUrl } from './api/auth';

export function login(request) {
  const state = request.nextUrl.searchParams.get('state');
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
  const logoutUrl = new URL(
    process.env.UAA_ROOT_URL + process.env.UAA_LOGOUT_PATH
  );
  const params = new URLSearchParams(logoutUrl.search);
  params.set('client_id', process.env.OAUTH_CLIENT_ID);
  params.set('redirect', process.env.ROOT_URL);
  // TODO: not sure why our local uaa server isn't redirecting us back to our site
  const response = NextResponse.redirect(logoutUrl + '?' + params.toString());
  response.cookies.delete('authsession');
  return response;
}

export function setAuthCookie(data, response) {
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

export async function requestAndSetAuthToken(request) {
  const stateCookie = request.cookies.get('state');
  if (
    !stateCookie ||
    request.nextUrl.searchParams.get('state') != stateCookie['value']
  ) {
    return NextResponse.json(
      { error: 'state param does not match' },
      { status: 400 }
    );
  }
  const data = await postToAuthTokenUrl({
    code: request.nextUrl.searchParams.get('code'),
    grant_type: 'authorization_code',
    response_type: 'token',
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
  });
  let response = NextResponse.redirect(new URL('/', request.url));
  response = setAuthCookie(data, response);
  response.cookies.delete('state');
  return response;
}

export async function refreshAuthToken(refreshToken) {
  const data = await postToAuthTokenUrl({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
  });
  return data;
}

export async function authenticateRoute(request) {
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

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/authenticated')) {
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
    '/authenticated/:path*',
  ],
};
