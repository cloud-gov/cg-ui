'use client';

// import { useState } from 'react';
import { GridList } from '@/components/GridList/GridList';
import { UsersListItem } from '@/components/UsersList/UsersListItem';
import {
  RolesByUser,
  SpacesBySpaceId,
  UAAUsersById,
} from '@/controllers/controller-types';
import { UserObj } from '@/api/cf/cloudfoundry-types';

export interface UsersListItemUserInterface extends UserObj {
  lastLogin: string | null;
}

export function UsersList({
  users,
  roles,
  spaces,
  uaaUsers,
}: {
  users: Array<UsersListItemUserInterface>;
  roles: RolesByUser;
  spaces: SpacesBySpaceId;
  uaaUsers: UAAUsersById;
}) {
  return (
    <GridList>
      {users.map((user, i) => {
        if (uaaUsers[user.guid]) {
          return (
            <UsersListItem
              key={`UsersListItem-${i}`}
              user={user}
              roles={roles[user.guid]}
              spaces={spaces}
              uaaUser={uaaUsers[user.guid]}
            />
          );
        }
      })}
    </GridList>
  );
}
