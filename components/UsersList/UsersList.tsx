'use client';

import { GridList } from '@/components/GridList/GridList';
import { UsersListItem } from '@/components/UsersList/UsersListItem';
import {
  RolesByUser,
  SpacesBySpaceId,
  UAAUsersById,
} from '@/controllers/controller-types';
import { UserObj } from '@/api/cf/cloudfoundry-types';

export function UsersList({
  users,
  roles,
  spaces,
  uaaUsers,
}: {
  users: Array<UserObj>;
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
