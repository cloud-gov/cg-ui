import { stackMiddlewares } from './middlewares/stackMiddlewares';
import { withAuth } from './middlewares/withAuth';
import { withNonce } from './middlewares/withNonce';
import { withCSP } from './middlewares/withCSP';
import { withLandingPage } from './middlewares/withLandingPage';

export default stackMiddlewares([
  withNonce,
  withCSP,
  withAuth,
  withLandingPage,
]);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
