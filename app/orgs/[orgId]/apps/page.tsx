import { PageHeader } from '@/components/PageHeader';
import { getOrgAppsPage } from '@/controllers/controllers';
import { AppsList } from '@/components/AppsList/AppsList';

export default async function OrgPage({
  params,
}: {
  params: { orgId: string };
}) {
  const { payload } = await getOrgAppsPage(params.orgId);
  const { apps, spaces } = payload;

  return (
    <>
      <PageHeader
        heading="View applications"
        intro="View all applications for an organization"
      />
      <AppsList apps={apps} orgGuid={params.orgId} spaces={spaces} />
    </>
  );
}
