import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from 'next/server';
import { MiddlewareFactory } from './types';
import * as CF from '@/api/cf/cloudfoundry';
import { logDevError } from '@/controllers/controller-helpers';

export async function redirectToOrg(request: NextRequest) {
  let lastViewedOrgId;
  if ((lastViewedOrgId = request.cookies.get('lastViewedOrgId')?.value)) {
    return NextResponse.redirect(
      new URL(`/orgs/${lastViewedOrgId}`, request.url)
    );
  } else {
    try {
      const orgsRes = await CF.getOrgs();
      const orgs = (await orgsRes.json()).resources;
      const orgId = orgs[0].guid;
      return NextResponse.redirect(new URL(`/orgs/${orgId}`, request.url));
    } catch (error: any) {
      logDevError(error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}

export const withLandingPage: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pn = request.nextUrl.pathname;
    if (pn === '/') {
      return redirectToOrg(request);
    }
    return next(request, _next);
  };
};
