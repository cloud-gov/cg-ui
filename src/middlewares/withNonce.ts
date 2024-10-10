import { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server';

import { MiddlewareFactory } from './types';

export const withNonce: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    request.headers.set('x-nonce', nonce);
    return next(request, _next);
  };
};
