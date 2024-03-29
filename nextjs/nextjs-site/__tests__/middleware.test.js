import {
    describe, expect, it, beforeAll
}                           from '@jest/globals';
import { middleware } from '../middleware.js';
import { NextRequest } from 'next/server';
// Need to disable eslint for this import because
// you need to import the module you're going to mock with Jest
// eslint-disable-next-line no-unused-vars
import { postToTokenUrlAndSetSession } from '../api/auth';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('../api/auth', () => ({
    postToTokenUrlAndSetSession: jest.fn(() => {
        return {
            // this is an encoded access token from our local/dev uaa server
            access_token: 'eyJhbGciOiJIUzI1NiIsImprdSI6Imh0dHBzOi8vbG9jYWxob3N0OjgwODAvdWFhL3Rva2VuX2tleXMiLCJraWQiOiJsZWdhY3ktdG9rZW4ta2V5IiwidHlwIjoiSldUIn0.eyJqdGkiOiI4Zjk3Y2U2ZTg2NmQ0NDJhYmZkZGY4ZjFhODBhZjZkZCIsInN1YiI6ImU4YmYzYTc1LWVjNTktNGZhNS1hZjY5LTYwYTI5NmFmNTRiNiIsInNjb3BlIjpbIm9wZW5pZCJdLCJjbGllbnRfaWQiOiJteV9jbGllbnRfaWQiLCJjaWQiOiJteV9jbGllbnRfaWQiLCJhenAiOiJteV9jbGllbnRfaWQiLCJncmFudF90eXBlIjoiYXV0aG9yaXphdGlvbl9jb2RlIiwidXNlcl9pZCI6ImU4YmYzYTc1LWVjNTktNGZhNS1hZjY5LTYwYTI5NmFmNTRiNiIsIm9yaWdpbiI6InVhYSIsInVzZXJfbmFtZSI6ImFkbWluQGV4YW1wbGUuY29tIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImF1dGhfdGltZSI6MTcxMTQ4NzkwMCwicmV2X3NpZyI6IjljMWQ5MmMxIiwiaWF0IjoxNzExNDg3OTAwLCJleHAiOjE3MTE1MzExMDAsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91YWEvb2F1dGgvdG9rZW4iLCJ6aWQiOiJ1YWEiLCJhdWQiOlsibXlfY2xpZW50X2lkIiwib3BlbmlkIl19.4uaiEamDGxNLS0a_CjiVaNXrfeHRojam3eMnT8aqxWI',
            refresh_token: 'foobar',
            expires_in: 43199
        }
    })
}));
/* eslint no-undef: "error" */

describe('login', () => {
    it('does not set auth session when state url param is not present', async () => {
        // setup
        const request = new NextRequest(new URL('/auth/callback', process.env.ROOT_URL));
        // run
        const response = await middleware(request);
        // assert
        expect(response.cookies.get('authsession')).toBeUndefined();
    });

    it('sets the auth session when state url param is present', async () => {
        // setup
        const request = new NextRequest(new URL('/auth/callback?state=foo', process.env.ROOT_URL));
        // run
        const response = await middleware(request);
        // assert
        expect(response.cookies.get('authsession')).toBeDefined();
    });
});

describe('logout', () => {
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
        expect(location).toMatch(process.env.UAA_LOGOUT_URL);
        expect(location).toMatch('client_id=');
        expect(location).toMatch('redirect=');
    });
});
