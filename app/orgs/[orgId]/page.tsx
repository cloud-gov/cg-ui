import { UsersList } from '@/components/UsersList/UsersList';
import { getOrgPage } from '@/controllers/controllers';
import { ManageUsersHeader } from '@/components/ManageUsersHeader';

export default async function OrgPage({
  params,
}: {
  params: { orgId: string };
}) {
  const { payload } = await getOrgPage(params.orgId);
  const { roles, spaces, users, uaaUsers } = payload;

  return (
    <>
      <ManageUsersHeader />
      <UsersList
        users={users}
        roles={roles}
        spaces={spaces}
        uaaUsers={uaaUsers}
      />
    </>
  );
}
