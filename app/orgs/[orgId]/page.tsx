import { UsersList } from '@/components/UsersList/UsersList';
import { getOrgPage } from '@/controllers/controllers';
import { PageHeader } from '@/components/PageHeader';

export default async function OrgPage({
  params,
}: {
  params: { orgId: string };
}) {
  const { payload } = await getOrgPage(params.orgId);
  const { roles, spaces, users, uaaUsers } = payload;

  return (
    <>
      <PageHeader
        heading="Manage users"
        intro="Add and remove users from an org. Add users to spaces and set access
        levels using role."
      />
      <UsersList
        users={users}
        roles={roles}
        spaces={spaces}
        uaaUsers={uaaUsers}
      />
    </>
  );
}
