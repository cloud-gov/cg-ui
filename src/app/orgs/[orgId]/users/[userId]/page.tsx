import { UsersActionsSpaceRoles } from '@/components/UsersActions/UsersActionsSpaceRoles/UsersActionsSpaceRoles';

type Params = Promise<{
  orgId: string;
  userId: string;
}>;

export default async function OrgUserSpaceRolesPage(props: { params: Params }) {
  const params = await props.params;
  return (
    <UsersActionsSpaceRoles orgGuid={params.orgId} userGuid={params.userId} />
  );
}
