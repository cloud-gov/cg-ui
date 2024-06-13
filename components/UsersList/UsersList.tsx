'use client';

import { GridList } from '@/components/GridList/GridList';
import { UsersListItem } from '@/components/UsersList/UsersListItem';
import {
  RolesByUser,
  SpacesBySpaceId,
  UAAUsersById,
} from '@/controllers/controller-types';
import { UserObj } from '@/api/cf/cloudfoundry-types';
import { sortObjectsByParam } from '@/helpers/arrays';

export function UsersList({
  users,
  roles,
  spaces,
  uaaUsers,
  // orgGuid,
  removeUser,
}: {
  users: Array<UserObj>;
  roles: RolesByUser;
  spaces: SpacesBySpaceId;
  uaaUsers: UAAUsersById;
  // orgGuid: string;
  removeUser: Function;
}) {
  const usersSorted = sortObjectsByParam(users, 'username');

  return (
    <GridList>
      {usersSorted.map((user, i) => {
        if (uaaUsers[user.guid]) {
          return (
            <UsersListItem
              key={`UsersListItem-${i}`}
              user={user}
              roles={roles[user.guid]}
              spaces={spaces}
              uaaUser={uaaUsers[user.guid]}
              // orgGuid={orgGuid}
              removeUser={removeUser}
            />
          );
        }
      })}
    </GridList>
  );
}
