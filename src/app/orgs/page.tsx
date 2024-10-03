'use server';

import { getOrgsPage } from '@/controllers/controllers';
import { OrganizationsList } from '@/components/OrganizationsList/OrganizationsList';
import { PageHeader } from '@/components/PageHeader';

export default async function OrgsPage() {
  const { payload } = await getOrgsPage();

  return (
    <>
      <PageHeader heading="Organizations" />
      <OrganizationsList
        orgs={payload.orgs}
        userCounts={payload.userCounts}
        appCounts={payload.appCounts}
        memoryAllocated={payload.memoryAllocated}
        memoryCurrentUsage={payload.memoryCurrentUsage}
        spaceCounts={payload.spaceCounts}
      />
    </>
  );
}
