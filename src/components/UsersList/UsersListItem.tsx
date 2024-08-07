'use client';

import {
  RolesByUserItem,
  SpacesBySpaceId,
} from '@/controllers/controller-types';
import { UserLogonInfoDisplay } from '@/controllers/controller-types';
import { UserObj } from '@/api/cf/cloudfoundry-types';
import { GridListItem } from '@/components/GridList/GridListItem';
import { GridListItemTop } from '@/components/GridList/GridListItemTop';
import { GridListItemBottom } from '@/components/GridList/GridListItemBottom';
import { GridListItemBottomLeft } from '@/components/GridList/GridListItemBottomLeft';
import { GridListItemBottomRight } from '@/components/GridList/GridListItemBottomRight';
import { GridListItemBottomCenter } from '@/components/GridList/GridListItemBottomCenter';
import { UsersListUsername } from '@/components/UsersList/UsersListUsername';
import { UsersListOrgRoles } from '@/components/UsersList/UsersListOrgRoles';
import { UsersListSpaceRoles } from '@/components/UsersList/UsersListSpaceRoles';
import { UsersListLastLogin } from '@/components/UsersList/UsersListLastLogin';
import { UsersActionsRemoveFromOrg } from '../UsersActions/UsersActionsRemoveFromOrg';

export function UsersListItem({
  user,
  roles,
  spaces,
  userLogonInfo,
  removeUserCallback,
  orgGuid,
}: {
  user: UserObj;
  roles: RolesByUserItem;
  spaces: SpacesBySpaceId;
  userLogonInfo: UserLogonInfoDisplay | undefined;
  removeUserCallback?: Function;
  orgGuid: string;
}) {
  return (
    <GridListItem>
      <GridListItemTop>
        <div className="margin-bottom-2 tablet:margin-bottom-0">
          <UsersListUsername username={user.username} />
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
