'use server';

import { getOrgsPage } from '@/controllers/controllers';
import { OrganizationsList } from '@/components/OrganizationsList/OrganizationsList';
import { PageHeader } from '@/components/PageHeader';
import { LastViewedOrgLink } from '@/components/LastViewedOrgLink';
import { Timestamp } from '@/components/Timestamp';

export default async function OrgsPage() {
  const { payload } = await getOrgsPage();

  return (
    <div className="margin-top-4">
      <PageHeader
        heading="Your organizations"
        intro="These are all the organizations you can access. In each, you can view users and applications, and access usage information."
      />
      <LastViewedOrgLink />
      <div className="width-full margin-top-3 margin-bottom-2 border-bottom border-gray-cool-20"></div>
      <Timestamp timestamp={payload.lastUpdatedAt} />
      <OrganizationsList
        orgs={payload.orgs}
        userCounts={payload.userCounts}
        appCounts={payload.appCounts}
        memoryAllocated={payload.memoryAllocated}
        memoryCurrentUsage={payload.memoryCurrentUsage}
        spaceCounts={payload.spaceCounts}
        roles={payload.roles}
      />
    </div>
  );
}
