'use client';

import { useState } from 'react';
import { GridList } from '@/components/GridList/GridList';
import { UsersListItem } from '@/components/UsersList/UsersListItem';
import {
  RolesByUser,
  SpacesBySpaceId,
  UAAUsersById,
} from '@/controllers/controller-types';
import { UserObj } from '@/api/cf/cloudfoundry-types';
import { sortObjectsByParam } from '@/helpers/arrays';
import { Modal } from '@/components/uswds/Modal';
import { Alert } from '@/components/uswds/Alert';

export function UsersList({
  users,
  roles,
  spaces,
  uaaUsers,
  orgGuid,
}: {
  users: Array<UserObj>;
  roles: RolesByUser;
  spaces: SpacesBySpaceId;
  uaaUsers: UAAUsersById;
  orgGuid: string;
}) {
  const [removedUserGuids, setRemovedUserGuids] = useState([] as string[]);

  function usersSorted(usersList: Array<UserObj>): Array<UserObj> {
    return sortObjectsByParam(usersList, 'username');
  }

  function usersFiltered(usersList: Array<UserObj>): Array<UserObj> {
    return usersList.filter(
      (user: UserObj) => !removedUserGuids.find((guid) => guid === user.guid)
    );
  }

  function removeUserCallback(user: UserObj) {
    setRemovedUserGuids([...removedUserGuids, user.guid]);
    openModal(user);
  }

  const [removedUsername, setRemovedUsername] = useState('');

  function closeModal(): undefined {
    setRemovedUsername('');
  }
  function openModal(user: UserObj): undefined {
    setRemovedUsername(user.username);
  }

  return (
    <GridList>
      {removedUsername && (
        <Modal close={closeModal} id="removeUserSuccess">
          <Alert type="success">
            <strong>{removedUsername}</strong> has successfully been removed.
          </Alert>
        </Modal>
      )}
      {usersSorted(usersFiltered(users)).map((user) => {
        if (uaaUsers[user.guid]) {
          return (
            <UsersListItem
              key={`UsersListItem-${user.guid}`}
              user={user}
              roles={roles[user.guid]}
              spaces={spaces}
              uaaUser={uaaUsers[user.guid]}
              removeUserCallback={removeUserCallback}
              orgGuid={orgGuid}
            />
          );
        }
      })}
    </GridList>
  );
}
