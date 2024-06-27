import { UsersActionsOrgRoles } from '@/components/UsersActions/UsersActionsOrgRoles';

export default function OrgUserOrgRolesPage() {
  return (
    <div className="maxw-mobile-lg">
      <div className="usa-prose">
        <h4>Org roles</h4>
        <p>
          Optional. By assigning additional roles, you can grant access to org
          level information and features.
        </p>
        <UsersActionsOrgRoles />
      </div>
    </div>
  );
}
