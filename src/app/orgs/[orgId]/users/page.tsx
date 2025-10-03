/*
  These route segment configs should bust Data and Route caching
  So that the list of users is always up-to-date.
  More info: https://nextjs.org/docs/app/building-your-application/caching#segment-config-options
*/
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { RoleObj } from '@/api/cf/cloudfoundry-types';
import { UsersList } from '@/components/UsersList/UsersList';
import { getOrgUsersPage } from '@/controllers/controllers';
import { PageHeader } from '@/components/PageHeader';
import { AddUserButton } from '@/components/UsersList/AddUserButton';
import { Alert } from '@/components/uswds/Alert';

type Params = Promise<{ orgId: string }>;

export default async function OrgUsersPage(props: { params: Params }) {
  const params = await props.params;
  const { payload } = await getOrgUsersPage(params.orgId);
  const { roles, serviceAccounts, spaces, users, currentUserRoles } = payload;
  const allowManageUsers = currentUserRoles.find(
    (role: RoleObj) => role.type === 'organization_manager'
  );

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
            {allowManageUsers && <AddUserButton orgId={params.orgId} />}
          </div>
        </div>
      </PageHeader>
      {!allowManageUsers && (
        <div className="tablet-lg:grid-col-8 margin-bottom-4">
          <Alert type="warning" isVisible={true}>
            You must be a manager of the current organization to make changes to
            these details.
          </Alert>
        </div>
      )}{' '}
      <UsersList
        users={users}
        roles={roles}
        serviceAccounts={serviceAccounts}
        spaces={spaces}
        orgGuid={params.orgId}
        allowChanges={allowManageUsers}
      />
    </>
  );
}
