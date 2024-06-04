'use client';

// import { useState } from 'react';
import { GridList } from '@/components/GridList/GridList';
import { UsersListItem } from '@/components/UsersList/UsersListItem';
import { RolesByUser, SpacesBySpaceId } from '@/controllers/controller-types';
import { UserObj } from '@/api/cf/cloudfoundry-types';

export interface UsersListItemUserInterface extends UserObj {
  lastLogin: string | null;
}

export function UsersList({
  users,
  roles,
  spaces,
}: {
  users: Array<UsersListItemUserInterface>;
  roles: RolesByUser;
  spaces: SpacesBySpaceId;
}) {
  return (
    <GridList>
      {users.map((user, i) => (
        <UsersListItem
          key={`UsersListItem-${i}`}
          user={user}
          roles={roles[user.guid]}
          spaces={spaces}
        />
      ))}
    </GridList>
  );
}
