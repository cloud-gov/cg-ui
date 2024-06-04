import { UsersList } from '@/components/UsersList/UsersList';
import { getOrgPage } from '@/controllers/controllers';

export default async function OrgPage({
  params,
}: {
  params: { orgId: string };
}) {
  const { payload } = await getOrgPage(params.orgId);
  const { roles, spaces, users } = payload;

  return (
    <>
      <UsersList users={users} roles={roles} spaces={spaces} />
    </>
  );
}
