import { UsersActionsOrgRoles } from '@/components/UsersActions/UsersActionsOrgRoles';
import { Username } from '@/components/UserAccount/Username';
import { UserOrgPage } from '@/controllers/controller-types';
import { ServiceCredentialBindingObj } from '@/api/cf/cloudfoundry-types';
import { Tag } from '@/components/uswds/Tag';

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
      <h4
        className="margin-top-0 margin-bottom-7 text-uppercase text-light underline-base-light text-underline"
        style={{ textUnderlineOffset: '0.7em' }}
      >
        update organization roles
      </h4>
      {serviceAccount && (
        <Tag
          className={'bg-primary font-sans-3xs text-white text-light text-ls-3'}
          label="service"
        />
      )}
      <h2 className="margin-top-1">
        <Username username={user.username} />
      </h2>
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
