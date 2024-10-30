import { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server';

import { MiddlewareFactory } from './types';

export const withCSP: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    if (request.headers.get('x-nonce') != null) {
      const nonce = request.headers.get('x-nonce');
      const cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''};
        style-src 'self' 'nonce-${nonce}';
        img-src 'self' blob: data:;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        ${process.env.NODE_ENV !== 'development' ? 'upgrade-insecure-requests;' : ''};
      `;

      // Replace newline characters and spaces
      const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, ' ')
        .trim();
      request.headers.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
      );
      const response = await next(request, _next);
      if (response) {
        response.headers.set(
          'Content-Security-Policy',
          contentSecurityPolicyHeaderValue
        );
      }
      return response;
    } else {
      return next(request, _next);
    }
  };
};
