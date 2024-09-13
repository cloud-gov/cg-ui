import { UsersActionsSpaceRoles } from '@/components/UsersActions/UsersActionsSpaceRoles/UsersActionsSpaceRoles';
import { UserOrgPage } from '@/controllers/controller-types';
import { ServiceCredentialBindingObj } from '@/api/cf/cloudfoundry-types';
import { OverlayHeaderUsername } from '@/components/Overlays/OverlayHeaderUsername';

export function SpaceRolesOverlay({
  onCancel,
  onSuccess,
  orgGuid,
  serviceAccount,
  user,
}: {
  onCancel: Function;
  onSuccess: Function;
  orgGuid: string;
  serviceAccount?: ServiceCredentialBindingObj | undefined | null;
  user?: UserOrgPage | undefined | null;
}) {
  if (!user) return;
  return (
    <>
      <OverlayHeaderUsername
        header="update access permissions"
        serviceAccount={serviceAccount}
        username={user.username}
      />
      <UsersActionsSpaceRoles
        orgGuid={orgGuid}
        userGuid={user.guid}
        onCancel={onCancel}
        onSuccess={onSuccess}
      />
    </>
  );
}
