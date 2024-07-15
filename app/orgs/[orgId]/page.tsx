/*
  These route segment configs should bust Data and Route caching
  So that the list of users is always up-to-date.
  More info: https://nextjs.org/docs/app/building-your-application/caching#segment-config-options
*/
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { UsersList } from '@/components/UsersList/UsersList';
import { getOrgPage } from '@/controllers/controllers';
import { PageHeader } from '@/components/PageHeader';
import { AddUserButton } from '@/components/UsersList/AddUserButton';

export default async function OrgPage({
  params,
}: {
  params: { orgId: string };
}) {
  const { payload } = await getOrgPage(params.orgId);
  const { roles, spaces, users, userLogonInfo } = payload;

  return (
    <>
      <PageHeader heading="Manage users">
        <div className="tablet:display-flex">
          <div className="flex-fill usa-prose">
            <p className="tablet:margin-0">
              Add and remove users from an org. Add users to spaces and set
              access levels using role.
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
        spaces={spaces}
        userLogonInfo={userLogonInfo}
        orgGuid={params.orgId}
      />
    </>
  );
}
