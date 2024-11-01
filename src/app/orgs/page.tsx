'use server';

import { headers } from 'next/headers';
import { getOrgsPage } from '@/controllers/controllers';
import { OrganizationsList } from '@/components/OrganizationsList/OrganizationsList';
import { PageHeader } from '@/components/PageHeader';
import { LastViewedOrgLink } from '@/components/LastViewedOrgLink';
import { Timestamp } from '@/components/Timestamp';

export default async function OrgsPage() {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || undefined;
  const { payload } = await getOrgsPage();

  return (
    <div className="margin-top-4">
      <PageHeader
        heading="Your organizations"
        intro="These are all the organizations you can access. In each, you can view users and applications, and access usage information."
      />
      <LastViewedOrgLink />
      <div className="width-full margin-top-3 margin-bottom-2 border-bottom border-gray-cool-20"></div>
      <p className="margin-0 margin-bottom-4 font-sans-2xs">
        Page last updated: <Timestamp timestamp={payload.lastUpdatedAt} />
      </p>
      <OrganizationsList
        orgs={payload.orgs}
        userCounts={payload.userCounts}
        appCounts={payload.appCounts}
        memoryAllocated={payload.memoryAllocated}
        memoryCurrentUsage={payload.memoryCurrentUsage}
        spaceCounts={payload.spaceCounts}
        roles={payload.roles}
        nonce={nonce}
      />
    </div>
  );
}
