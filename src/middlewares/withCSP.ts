import { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server';

import { MiddlewareFactory } from './types';

export const withCSP: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    if (request.headers.get('x-nonce') != null) {
      const nonce = request.headers.get('x-nonce') as string;
      const cspHeader = `
        default-src 'self';
        connect-src 'self' *.us-gov-west-1.aws-us-gov.cloud.gov ${process.env.NEXT_PUBLIC_BLOG_FEED_URL};
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: ${process.env.NODE_ENV === 'production' ? '' : `'unsafe-eval'`};
        style-src 'self' 'nonce-${nonce}';
        img-src 'self' blob: data:;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        ${process.env.NODE_ENV === 'production' ? '' : 'upgrade-insecure-requests;'};
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
        response.headers.set('x-nonce', nonce);
      }
      return response;
    } else {
      return next(request, _next);
    }
  };
};
