'use client';

import {
  RolesByUserItem,
  SpacesBySpaceId,
  UAAUser,
} from '@/controllers/controller-types';
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

export interface UsersListItemUserInterface extends UserObj {
  lastLogin: string | null;
}

export function UsersListItem({
  user,
  roles,
  spaces,
  uaaUser,
}: {
  user: UsersListItemUserInterface;
  roles: RolesByUserItem;
  spaces: SpacesBySpaceId;
  uaaUser: UAAUser;
}) {
  return (
    <GridListItem>
      <GridListItemTop>
        <UsersListUsername username={user.username} />
      </GridListItemTop>
      <GridListItemBottom>
        <GridListItemBottomLeft>
          <UsersListOrgRoles orgRoles={roles.org} />
        </GridListItemBottomLeft>
        <GridListItemBottomCenter>
          <UsersListSpaceRoles roles={roles.space} spaces={spaces} />
        </GridListItemBottomCenter>
        <GridListItemBottomRight>
          <UsersListLastLogin timestamp={uaaUser.previousLogonTime} />
        </GridListItemBottomRight>
      </GridListItemBottom>
    </GridListItem>
  );
}
