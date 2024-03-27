// For demo purposes only

// docs: https://nextjs.org/docs/app/building-your-application/routing/middleware

// latest info on why middleware may run multiple times: https://github.com/vercel/next.js/issues/39917

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { postToAuthTokenUrl } from './api/auth';

export function login(request) {
    const state = request.nextUrl.searchParams.get('state');
    const loginUrl = new URL(process.env.UAA_ROOT_URL + process.env.UAA_AUTH_PATH);
    const params = new URLSearchParams(loginUrl.search);
    params.set("client_id", process.env.OAUTH_CLIENT_ID);
    params.set("state", state);
    params.set("response_type", "code");
    const response = NextResponse.redirect(loginUrl + "?" + params.toString());
    response.cookies.set('state', state);
    return response;
}

export function logout() {
    const logoutUrl = new URL(process.env.UAA_ROOT_URL + process.env.UAA_LOGOUT_PATH);
    const params = new URLSearchParams(logoutUrl.search);
    params.set("client_id", process.env.OAUTH_CLIENT_ID);
    params.set("redirect", process.env.ROOT_URL);
    // TODO: not sure why our local uaa server isn't redirecting us back to our site
    const response = NextResponse.redirect(logoutUrl + "?" + params.toString());
    response.cookies.delete('authsession');
    return response;
}

export async function setAuthToken(request) {
    const stateCookie = request.cookies.get('state');
    if (!stateCookie ||
        request.nextUrl.searchParams.get('state') != stateCookie['value']) {
        return NextResponse.json({ error: 'state param does not match' }, { status: 400 })
    }
    const data = await postToAuthTokenUrl({
        code: request.nextUrl.searchParams.get('code'),
        grant_type: 'authorization_code',
        response_type: 'token',
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
    });
    const decodedToken = jwt.decode(data.access_token);
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('authsession', JSON.stringify({
        access_token: data.access_token,
        email: decodedToken.email,
        refreshToken: data.refresh_token,
        expiry: Date.now() + data.expires_in * 1000
    }));
    response.cookies.delete('state');
    return response;
}

export function middleware(request) {
    if (request.nextUrl.pathname.startsWith('/login')) {
        return login(request);
    }
    if (request.nextUrl.pathname.startsWith('/logout')) {
        return logout();
    }
    if (request.nextUrl.pathname.startsWith('/auth/callback')) {
        return setAuthToken(request);
    }
}

// regex can be used here using path-to-regexp:
// https://github.com/pillarjs/path-to-regexp#path-to-regexp-1
// TODO: not sure why I'd need both route matching and conditionals above
export const config = {
    matcher: ['/auth/callback', '/logout', '/login'],
}
