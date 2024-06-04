'use client';

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

export interface UsersListItemUserInterface {
  username: string;
  orgRoles: Array<any>;
  spaceRoles: Array<any>;
  lastLogin: string | null;
}

export function UsersListItem({ user }: { user: UsersListItemUserInterface }) {
  return (
    <GridListItem>
      <GridListItemTop>
        <UsersListUsername username={user.username} />
      </GridListItemTop>
      <GridListItemBottom>
        <GridListItemBottomLeft>
          <UsersListOrgRoles roles={user.orgRoles} />
        </GridListItemBottomLeft>
        <GridListItemBottomCenter>
          <UsersListSpaceRoles spaces={user.spaceRoles} />
        </GridListItemBottomCenter>
        <GridListItemBottomRight>
          <UsersListLastLogin timestamp={user.lastLogin} />
        </GridListItemBottomRight>
      </GridListItemBottom>
    </GridListItem>
  );
}
