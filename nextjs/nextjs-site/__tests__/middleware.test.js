import {
    describe, expect, it, beforeAll, afterEach
}                           from '@jest/globals';
import { middleware } from '../middleware.js';
import { NextRequest, NextResponse } from 'next/server';
// Need to disable eslint for this import because
// you need to import the module you're going to mock with Jest
// eslint-disable-next-line no-unused-vars
import { postToAuthTokenUrl } from '../api/auth';

const mockAuthResponse = {
    // this is an encoded access token from our local/dev uaa server
    // it should have an email when decoded
    access_token: 'eyJhbGciOiJIUzI1NiIsImprdSI6Imh0dHBzOi8vbG9jYWxob3N0OjgwODAvdWFhL3Rva2VuX2tleXMiLCJraWQiOiJsZWdhY3ktdG9rZW4ta2V5IiwidHlwIjoiSldUIn0.eyJqdGkiOiI4Zjk3Y2U2ZTg2NmQ0NDJhYmZkZGY4ZjFhODBhZjZkZCIsInN1YiI6ImU4YmYzYTc1LWVjNTktNGZhNS1hZjY5LTYwYTI5NmFmNTRiNiIsInNjb3BlIjpbIm9wZW5pZCJdLCJjbGllbnRfaWQiOiJteV9jbGllbnRfaWQiLCJjaWQiOiJteV9jbGllbnRfaWQiLCJhenAiOiJteV9jbGllbnRfaWQiLCJncmFudF90eXBlIjoiYXV0aG9yaXphdGlvbl9jb2RlIiwidXNlcl9pZCI6ImU4YmYzYTc1LWVjNTktNGZhNS1hZjY5LTYwYTI5NmFmNTRiNiIsIm9yaWdpbiI6InVhYSIsInVzZXJfbmFtZSI6ImFkbWluQGV4YW1wbGUuY29tIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImF1dGhfdGltZSI6MTcxMTQ4NzkwMCwicmV2X3NpZyI6IjljMWQ5MmMxIiwiaWF0IjoxNzExNDg3OTAwLCJleHAiOjE3MTE1MzExMDAsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91YWEvb2F1dGgvdG9rZW4iLCJ6aWQiOiJ1YWEiLCJhdWQiOlsibXlfY2xpZW50X2lkIiwib3BlbmlkIl19.4uaiEamDGxNLS0a_CjiVaNXrfeHRojam3eMnT8aqxWI',
    refresh_token: 'foobar',
    expires_in: 43199
}

/* global jest */
/* eslint no-undef: "off" */
jest.mock('../api/auth', () => ({
    postToAuthTokenUrl: jest.fn(() => mockAuthResponse )
}));
/* eslint no-undef: "error" */

describe('/login', () => {
    // setup
    const request = new NextRequest(new URL('/login?state=baz', process.env.ROOT_URL));
    let response;
    beforeAll(async () => {
        // run
        response = await middleware(request);
    });

    it('sets the state cookie', () => {
        expect(response.cookies.get('state')['value']).toBe('baz');
    });

    it('redirects to uaa auth path with proper query params', () => {
        const location = response.headers.get('location');
        expect(location).toMatch(process.env.UAA_ROOT_URL + process.env.UAA_AUTH_PATH);
        expect(location).toMatch('client_id=');
        expect(location).toMatch('state=baz');
        expect(location).toMatch('response_type=code');
    });
});

describe('auth/callback', () => {
    describe('when states do not match', () => {
        it('does not set auth session when states do not match', async () => {
            // setup
            const request = new NextRequest(new URL('/auth/callback?state=bar', process.env.ROOT_URL));
            request.cookies.set('state', 'foo');
            // run
            const response = await middleware(request);
            // assert
            expect(response.cookies.get('authsession')).toBeUndefined();
        });
    });

    describe('when states match', () => {
        let request;
        let response;
        beforeAll(async () => {
            // setup
            request = new NextRequest(new URL('/auth/callback?state=foo', process.env.ROOT_URL));
            request.cookies.set('state', 'foo');
            // run
            response = await middleware(request);
        });

        it('sets the auth session', async () => {
            expect(response.cookies.get('authsession')).toBeDefined();
        });
        it('unsets the state cookie', async () => {
            expect(response.cookies.get('state')['value']).toBe('');
        });
    });
});

describe('/logout', () => {
    const request = new NextRequest(new URL('/logout', process.env.ROOT_URL));
    let response;

    beforeAll(async () => {
        // setup
        request.cookies.set('authsession', 'foobar');
        expect(request.cookies.get('authsession')['value']).toMatch('foobar');
        // run
        response = await middleware(request);
    });

    it('deletes the auth session cookie', () => {
        expect(response.cookies.get('authsession')['value']).toBe('');
    });

    it('redirects to the logout url with the proper query params', () => {
        const location = response.headers.get('location');
        expect(location).toMatch(process.env.UAA_ROOT_URL + process.env.UAA_LOGOUT_PATH);
        expect(location).toMatch('client_id=');
        expect(location).toMatch('redirect=');
    });
});

describe('/authenticated/:path*', () => {
    describe('when not logged in', () => {
        it('redirects back to homepage', async () => {
            // setup
            const request = new NextRequest(new URL('/authenticated/example', process.env.ROOT_URL));
            // run
            const response = await middleware(request);
            // assert
            expect(response.headers.get('location')).toBe(process.env.ROOT_URL);
        });
    });

    describe('when auth token is expired', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('refreshes token, then sends you to requested page', async() => {
            // setup
            const request = new NextRequest(new URL('/authenticated/example', process.env.ROOT_URL));
            request.cookies.set('authsession', JSON.stringify({
                access_token: 'oldToken',
                refreshToken: 'fooRefreshToken',
                expiry: Date.now() - 1000
            }));
            const responseSpy = jest.spyOn(NextResponse, 'next');
            // run
            const response = await middleware(request);
            // assert auth cookie is refreshed
            const newAuthCookie = JSON.parse(response.cookies.get('authsession')['value']);
            expect(newAuthCookie.access_token).toMatch(mockAuthResponse.access_token);
            // assert passthrough
            expect(responseSpy).toHaveBeenCalledTimes(1);

        });
    });

    describe('when auth token is not expired', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('sends you to requested page', async () => {
            // setup
            const request = new NextRequest(new URL('/authenticated/example', process.env.ROOT_URL));
            request.cookies.set('authsession', JSON.stringify({
                expiry: Date.now() + 10000000
            }));
            const responseSpy = jest.spyOn(NextResponse, 'next');
            // run
            await middleware(request);
            // assert
            expect(responseSpy).toHaveBeenCalledTimes(1);
        });
    })
});
