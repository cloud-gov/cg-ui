'use client';

import {
  RolesByUserItem,
  SpacesBySpaceId,
} from '@/controllers/controller-types';
import { UserLogonInfoDisplay } from '@/controllers/controller-types';
import {
  ServiceCredentialBindingObj,
  UserObj,
} from '@/api/cf/cloudfoundry-types';
import { GridListItem } from '@/components/GridList/GridListItem';
import { GridListItemTop } from '@/components/GridList/GridListItemTop';
import { GridListItemBottom } from '@/components/GridList/GridListItemBottom';
import { GridListItemBottomLeft } from '@/components/GridList/GridListItemBottomLeft';
import { GridListItemBottomRight } from '@/components/GridList/GridListItemBottomRight';
import { GridListItemBottomCenter } from '@/components/GridList/GridListItemBottomCenter';
import { UsersListOrgRoles } from '@/components/UsersList/UsersListOrgRoles';
import { UsersListSpaceRoles } from '@/components/UsersList/UsersListSpaceRoles';
import { UsersListLastLogin } from '@/components/UsersList/UsersListLastLogin';
import { UsersActionsRemoveFromOrg } from '@/components/UsersActions/UsersActionsRemoveFromOrg';
import { Username } from '@/components/Username';

export function UsersListItem({
  user,
  roles,
  serviceAccount,
  spaces,
  userLogonInfo,
  removeUserCallback,
  orgGuid,
}: {
  user: UserObj;
  roles: RolesByUserItem;
  serviceAccount: ServiceCredentialBindingObj | undefined;
  spaces: SpacesBySpaceId;
  userLogonInfo: UserLogonInfoDisplay | undefined;
  removeUserCallback?: Function;
  orgGuid: string;
}) {
  return (
    <GridListItem>
      <GridListItemTop>
        <div className="margin-bottom-2 tablet:margin-bottom-0">
          <h2 className="margin-bottom-0 text-break-all font-heading-md">
            <Username user={user} serviceAccount={serviceAccount} />
          </h2>
          <UsersActionsRemoveFromOrg
            user={user}
            roles={roles}
            removeUserCallback={removeUserCallback}
          />
        </div>
      </GridListItemTop>
      <GridListItemBottom>
        <GridListItemBottomLeft>
          <UsersListOrgRoles
            orgRoles={roles.org}
            orgGuid={orgGuid}
            userGuid={user.guid}
          />
        </GridListItemBottomLeft>
        <GridListItemBottomCenter>
          <UsersListSpaceRoles
            roles={roles.space}
            spaces={spaces}
            orgGuid={orgGuid}
            userGuid={user.guid}
          />
        </GridListItemBottomCenter>
        <GridListItemBottomRight>
          {userLogonInfo ? (
            <UsersListLastLogin userLogonInfo={userLogonInfo} />
          ) : (
            <div className="text-right text-base">
              No access information available
            </div>
          )}
        </GridListItemBottomRight>
      </GridListItemBottom>
    </GridListItem>
  );
}
