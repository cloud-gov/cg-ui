import { UsersActionsSpaceRoles } from '@/components/UsersActions/UsersActionsSpaceRoles/UsersActionsSpaceRoles';

export default async function OrgUserSpaceRolesPage({
  params,
}: {
  params: { orgId: string; userId: string };
}) {
  return (
    <UsersActionsSpaceRoles orgGuid={params.orgId} userGuid={params.userId} />
  );
}
