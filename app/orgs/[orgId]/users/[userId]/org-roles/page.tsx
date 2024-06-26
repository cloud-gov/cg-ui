import { PageHeader } from '@/components/PageHeader';
import { UsersActionsOrgRoles } from '@/components/UsersActions/UsersActionsOrgRoles';

export default function OrgUserOrgRolesPage() {
  const username = 'bento.bear@gsa.gov'; // TODO: replace with real username

  return (
    <div className="maxw-mobile-lg">
      <div className="usa-prose">
        <PageHeader heading={username} />
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
