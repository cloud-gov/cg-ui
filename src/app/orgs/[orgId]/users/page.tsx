/*
  These route segment configs should bust Data and Route caching
  So that the list of users is always up-to-date.
  More info: https://nextjs.org/docs/app/building-your-application/caching#segment-config-options
*/
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { UsersList } from '@/components/UsersList/UsersList';
import { getOrgUsersPage } from '@/controllers/controllers';
import { PageHeader } from '@/components/PageHeader';
import { AddUserButton } from '@/components/UsersList/AddUserButton';

export default async function OrgUsersPage({
  params,
}: {
  params: { orgId: string };
}) {
  const { payload } = await getOrgUsersPage(params.orgId);
  const { roles, serviceAccounts, spaces, users } = payload;

  return (
    <>
      <PageHeader heading="Manage users">
        <div className="tablet:display-flex">
          <div className="flex-fill usa-prose">
            <p className="tablet:margin-0">
              Add and remove users from this organization. Add users to spaces,
              and set their access levels by using roles.
            </p>
          </div>
          <div className="flex-align-self-end">
            <AddUserButton orgId={params.orgId} />
          </div>
        </div>
      </PageHeader>
      <UsersList
        users={users}
        roles={roles}
        serviceAccounts={serviceAccounts}
        spaces={spaces}
        orgGuid={params.orgId}
      />
    </>
  );
}
