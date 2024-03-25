// For demo purposes only

// docs: https://nextjs.org/docs/app/building-your-application/routing/middleware

// latest info on why middleware may run multiple times: https://github.com/vercel/next.js/issues/39917

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { postToTokenUrlAndSetSession } from './api/auth';

// TODO: break these out into helper functions
export async function middleware(request) {
    if (request.nextUrl.pathname.startsWith('/logout')) {
        const logoutUrl = new URL(process.env.UAA_LOGOUT_URL);
        const params = new URLSearchParams(logoutUrl.search);
        params.set("client_id", process.env.OAUTH_CLIENT_ID);
        params.set("redirect", process.env.ROOT_URL);
        // TODO: not sure why our local uaa server isn't redirecting us back to our site
        const response = NextResponse.redirect(logoutUrl + "?" + params.toString());
        response.cookies.delete('authsession');
        return response;
    }

    if (request.nextUrl.pathname.startsWith('/auth/callback')) {
        if (!request.nextUrl.searchParams.get('state')) { // TODO: compare this state against client state
            return NextResponse.json({ error: 'No state param present' }, { status: 400 })
        }
        const data = await postToTokenUrlAndSetSession({
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
        return response;
    }

}

// regex can be used here using path-to-regexp:
// https://github.com/pillarjs/path-to-regexp#path-to-regexp-1
// TODO: not sure why I'd need both route matching and conditionals above
export const config = {
    matcher: ['/auth/callback', '/logout'],
}
