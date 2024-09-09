import { UsersActionsOrgRoles } from '@/components/UsersActions/UsersActionsOrgRoles';
import { UserOrgPage } from '@/controllers/controller-types';
import { ServiceCredentialBindingObj } from '@/api/cf/cloudfoundry-types';
import { OverlayHeaderUsername } from './OverlayHeaderUsername';

export function OrgUserOrgRolesOverlay({
  orgGuid,
  user,
  onCancel,
  onSuccess,
  serviceAccount,
}: {
  orgGuid: string;
  user?: UserOrgPage | undefined | null;
  onCancel: Function;
  onSuccess: Function;
  serviceAccount?: ServiceCredentialBindingObj | undefined | null;
}) {
  if (!user) return null;
  return (
    <>
      <OverlayHeaderUsername
        header="update organization roles"
        serviceAccount={serviceAccount}
        username={user.username}
      />
      <div className="usa-prose">
        <p>
          By assigning specific roles, you can grant a user access to specific
          information and features within a given organization.
        </p>
        <UsersActionsOrgRoles
          orgGuid={orgGuid}
          userGuid={user.guid}
          onCancel={onCancel}
          onSuccess={onSuccess}
        />
      </div>
    </>
  );
}
