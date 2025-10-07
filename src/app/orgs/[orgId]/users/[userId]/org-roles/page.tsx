import { UsersActionsOrgRoles } from '@/components/UsersActions/UsersActionsOrgRoles';

type Params = Promise<{
  orgId: string;
  userId: string;
}>;

export default async function OrgUserOrgRolesPage(props: { params: Params }) {
  const params = await props.params;
  return (
    <div className="maxw-mobile-lg">
      <div className="usa-prose">
        <h4>Org roles</h4>
        <p>
          Optional. By assigning additional roles, you can grant access to org
          level information and features.
        </p>
        <UsersActionsOrgRoles
          orgGuid={params.orgId}
          userGuid={params.userId}
          onCancelPath={`/orgs/${params.orgId}/users`}
        />
      </div>
    </div>
  );
}
