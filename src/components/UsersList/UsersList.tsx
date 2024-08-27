'use client';

import { useState } from 'react';
import { RolesByUser, SpacesBySpaceId } from '@/controllers/controller-types';
import { UserLogonInfoById } from '@/api/aws/s3-types';
import {
  ServiceCredentialBindingObj,
  UserObj,
} from '@/api/cf/cloudfoundry-types';
import { sortObjectsByParam, filterObjectsByParams } from '@/helpers/arrays';
import { Modal } from '@/components/uswds/Modal';
import { Alert } from '@/components/uswds/Alert';
import { ListSearchInput } from '@/components/ListSearchInput';
import { Table } from '@/components/uswds/Table/Table';
import { TableHead } from '@/components/uswds/Table/TableHead';
import { TableHeadCell } from '@/components/uswds/Table/TableHeadCell';
import { TableBody } from '@/components/uswds/Table/TableBody';
import { TableRow } from '@/components/uswds/Table/TableRow';
import { TableCell } from '@/components/uswds/Table/TableCell';
import { Username } from '@/components/UserAccount/Username';
import { UsersListOrgRoles } from '@/components/UsersList/UsersListOrgRoles';
import { UsersListSpaceRoles } from '@/components/UsersList/UsersListSpaceRoles';
import { UserAccountExpires } from '@/components/UserAccount/UserAccountExpires';
import { UserAccountLastLogin } from '@/components/UserAccount/UserAccountLastLogin';
import { UsersActionsRemoveFromOrg } from '@/components/UsersActions/UsersActionsRemoveFromOrg';

export function UsersList({
  users,
  roles,
  serviceAccounts,
  spaces,
  userLogonInfo,
  orgGuid,
}: {
  users: Array<UserObj>;
  roles: RolesByUser;
  serviceAccounts: { [id: string]: ServiceCredentialBindingObj };
  spaces: SpacesBySpaceId;
  userLogonInfo: UserLogonInfoById;
  orgGuid: string;
}) {
  const [removedUserGuids, setRemovedUserGuids] = useState([] as string[]);
  const [searchValue, setSearchValue] = useState('' as string);

  function usersSorted(usersList: Array<UserObj>): Array<UserObj> {
    return sortObjectsByParam(usersList, 'username');
  }

  function usersFiltered(usersList: Array<UserObj>): Array<UserObj> {
    const filteredForRemoval = usersList.filter(
      (user: UserObj) => !removedUserGuids.find((guid) => guid === user.guid)
    );
    if (searchValue) {
      return filterObjectsByParams(filteredForRemoval, {
        username: searchValue,
        presentation_name: searchValue,
      });
    } else {
      return filteredForRemoval;
    }
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

  const onSearchAction = (value: string) => {
    if (value.trim().length <= 0) {
      setSearchValue('');
    } else {
      setSearchValue(value.trim());
    }
  };

  const modalHeadingId = (name: string) => `removeUserSuccess-${name}`;
  const currentUsers = usersSorted(usersFiltered(users));
  const usersResultsText = currentUsers.length === 1 ? 'user' : 'users';

  return (
    <>
      <ListSearchInput
        onSubmit={onSearchAction}
        labelText="search the list of users by username"
      />
      {/*
      aria-live region needs to show up on initial page render.
      More info: https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/
      */}
      <div role="region" aria-live="polite">
        {searchValue && (
          <div className="margin-bottom-2">
            <strong>
              {currentUsers.length} {usersResultsText} found for{' '}
              {`"${searchValue}"`}
            </strong>
          </div>
        )}
      </div>
      {removedUsername && (
        <Modal
          close={closeModal}
          modalId="removeUserSuccess"
          headingId={modalHeadingId(removedUsername)}
        >
          <Alert type="success" id={modalHeadingId(removedUsername)}>
            <strong>{removedUsername}</strong> has successfully been removed.
          </Alert>
        </Modal>
      )}

      <Table
        caption="users for this organization"
        sortText="This table is now sorted by Account Name in descending order."
      >
        <TableHead>
          <TableHeadCell data="account name" />
          <TableHeadCell data="organization roles" />
          <TableHeadCell data="access permissions" />
          <TableHeadCell data="expires" />
          <TableHeadCell data="last login" />
          <TableHeadCell />
        </TableHead>

        <TableBody>
          {currentUsers.map((user, index) => (
            <TableRow key={`table-row-${index}`}>
              <TableCell colName="account name" rowheader={true}>
                <div className="display-flex flex-justify">
                  <span className="mobile-lg:text-bold maxw-card-lg text-ellipsis">
                    <Username
                      user={user}
                      serviceAccount={serviceAccounts[user.username]}
                    />
                  </span>
                </div>
              </TableCell>

              <TableCell colName="organization roles">
                <UsersListOrgRoles
                  orgRoles={roles[user.guid]?.org || []}
                  orgGuid={orgGuid}
                  userGuid={user.guid}
                />
              </TableCell>

              <TableCell colName="access permissions">
                <UsersListSpaceRoles
                  roles={roles[user.guid]?.space || []}
                  spaces={spaces}
                  orgGuid={orgGuid}
                  userGuid={user.guid}
                />
              </TableCell>

              <TableCell colName="expires">
                <UserAccountExpires
                  userLogonInfo={
                    userLogonInfo ? userLogonInfo[user.guid] : undefined
                  }
                />
              </TableCell>

              <TableCell colName="last login">
                <UserAccountLastLogin
                  userLogonInfo={
                    userLogonInfo ? userLogonInfo[user.guid] : undefined
                  }
                />
              </TableCell>

              <TableCell className="text-center mobile-lg:text-right">
                <UsersActionsRemoveFromOrg
                  user={user}
                  roles={roles[user.guid]}
                  removeUserCallback={removeUserCallback}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
