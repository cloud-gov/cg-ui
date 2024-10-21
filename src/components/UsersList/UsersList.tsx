'use client';

import { useState } from 'react';
import {
  RolesByUser,
  SpacesBySpaceId,
  UserOrgPage,
} from '@/controllers/controller-types';
import { ServiceCredentialBindingObj } from '@/api/cf/cloudfoundry-types';
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
import { OverlayDrawer } from '@/components/OverlayDrawer';
import { OrgUserOrgRolesOverlay } from '@/components/Overlays/OrgUserOrgRolesOverlay';
import { Button } from '@/components/uswds/Button';
import { SpaceRolesOverlay } from '@/components/Overlays/SpaceRolesOverlay';

type SortDirection = 'asc' | 'desc';

type OverlayType = 'org' | 'space';

export function UsersList({
  users,
  roles,
  serviceAccounts,
  spaces,
  orgGuid,
}: {
  users: Array<UserOrgPage>;
  roles: RolesByUser;
  serviceAccounts: { [id: string]: ServiceCredentialBindingObj };
  spaces: SpacesBySpaceId;
  orgGuid: string;
}) {
  // State
  const [removedUserGuids, setRemovedUserGuids] = useState([] as string[]);
  const [removedUsername, setRemovedUsername] = useState('');
  const [searchValue, setSearchValue] = useState('' as string);
  const [sortParam, setSortParam] = useState('username' as string);
  const [sortDir, setSortDir] = useState('asc' as SortDirection);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayType, setOverlayType] = useState('org' as OverlayType);
  const [currentMemberId, setCurrentMemberId] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Searching/Filtering
  const onSearchAction = (value: string) => {
    if (value.trim().length <= 0) {
      setSearchValue('');
    } else {
      setSearchValue(value.trim());
    }
  };

  function usersFiltered(usersList: Array<UserOrgPage>): Array<UserOrgPage> {
    const filteredForRemoval = usersList.filter(
      (user: UserOrgPage) =>
        !removedUserGuids.find((guid) => guid === user.guid)
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

  // Sorting
  interface SortParamsTable {
    [colName: string]: string;
  }
  const sortParamsTable = {
    'account name': 'username',
    'organization roles': 'orgRolesCount',
    'access permissions': 'spaceRolesCount',
    expires: 'daysToExpiration',
    'last login': 'lastLogonTime',
  } as SortParamsTable;

  function usersSorted(usersList: Array<UserOrgPage>): Array<UserOrgPage> {
    return sortObjectsByParam(usersList, sortParam, sortDir);
  }

  const onSortAction = (colName: string) => {
    if (sortParamsTable[colName] === sortParam) {
      if (sortDir === 'asc') setSortDir('desc' as SortDirection);
      if (sortDir === 'desc') setSortDir('asc' as SortDirection);
    } else {
      setSortDir('asc' as SortDirection);
      setSortParam(sortParamsTable[colName]);
    }
  };

  // Remove Modal
  const modalHeadingId = (name: string) => `removeUserSuccess-${name}`;

  function closeModal(): undefined {
    setRemovedUsername('');
  }

  function openModal(user: UserOrgPage): undefined {
    setRemovedUsername(user.username);
  }

  function removeUserCallback(user: UserOrgPage) {
    setRemovedUserGuids([...removedUserGuids, user.guid]);
    openModal(user);
  }

  // Overlays
  const openOverlay = (userId: string, type: OverlayType = 'org') => {
    setOverlayType(type);
    setCurrentMemberId(userId);
    setOverlayOpen(true);
  };

  const closeOverlay = () => {
    setOverlayOpen(false);
    setCurrentMemberId('');
  };

  const onRolesEditSuccess = (userId: string, type: OverlayType = 'org') => {
    const username = users.find((user) => user.guid === userId)?.username;
    const usernameText = username ? `for ${username}` : '';
    const rolesText = type === 'org' ? 'organization' : 'space';
    const msg = `The ${rolesText} roles ${usernameText} have been updated.`;
    closeOverlay();
    // delaying this to get aria-live region to announce success
    setTimeout(() => {
      setSuccessMsg(msg);
    }, 500);
  };

  // Success alert
  const dismissSuccessMsg = () => {
    setSuccessMsg('');
  };

  // Helpers
  const currentUsers = usersSorted(usersFiltered(users));
  const usersResultsText = currentUsers.length === 1 ? 'user' : 'users';
  const searchAriaLiveText = `${currentUsers.length} ${usersResultsText} found for ${searchValue}`;
  const spacesCount = Object.keys(spaces).length;
  const currentMember =
    users.find((user) => user.guid === currentMemberId) || null;
  const overlayAriaLabel = `Edit ${overlayType === 'org' ? 'organization roles' : 'access permissions'} for ${currentMember ? currentMember?.username : 'this user'}`;

  return (
    <>
      {/*
      aria-live region needs to show up on initial page render.
      More info: https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/
      */}
      <div
        role="region"
        aria-live="assertive"
        aria-atomic={true}
        className="usa-sr-only"
      >
        {successMsg}
      </div>
      <OverlayDrawer
        ariaLabel={overlayAriaLabel}
        id="overlay-drawer-manage-users"
        isOpen={overlayOpen}
        close={() => closeOverlay()}
      >
        {overlayType === 'org' && (
          <OrgUserOrgRolesOverlay
            onCancel={() => {
              closeOverlay();
            }}
            onSuccess={onRolesEditSuccess}
            orgGuid={orgGuid}
            serviceAccount={serviceAccounts[currentMember?.username || '']}
            user={currentMember}
          />
        )}
        {overlayType === 'space' && (
          <SpaceRolesOverlay
            onCancel={() => {
              closeOverlay();
            }}
            onSuccess={onRolesEditSuccess}
            orgGuid={orgGuid}
            serviceAccount={serviceAccounts[currentMember?.username || '']}
            user={currentMember}
          />
        )}
      </OverlayDrawer>

      {successMsg && (
        <Alert
          type="success"
          className="margin-bottom-4"
          heading="Your changes have been saved."
        >
          {successMsg}{' '}
          <Button
            onClick={() => dismissSuccessMsg()}
            className="usa-button--unstyled text-bold text-ink"
          >
            (Dismiss this message.)
          </Button>
        </Alert>
      )}

      <ListSearchInput
        onSubmit={onSearchAction}
        labelText="Find account names that match:"
      />
      {/*
      aria-live region needs to show up on initial page render.
      More info: https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/
      */}
      <div role="region" aria-live="assertive" aria-atomic={true}>
        {searchValue && (
          <div className="margin-bottom-2">
            <strong>{searchAriaLiveText}</strong>
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
          <TableHeadCell
            data="account name"
            sortDir={sortParam === 'username' ? sortDir : 'unsorted'}
            onSortClick={onSortAction}
          />
          <TableHeadCell
            data="organization roles"
            sortDir={sortParam === 'orgRolesCount' ? sortDir : 'unsorted'}
            onSortClick={onSortAction}
          />
          <TableHeadCell
            data="access permissions"
            sortDir={sortParam === 'spaceRolesCount' ? sortDir : 'unsorted'}
            onSortClick={onSortAction}
          />
          <TableHeadCell
            data="expires"
            sortDir={sortParam === 'daysToExpiration' ? sortDir : 'unsorted'}
            onSortClick={onSortAction}
          />
          <TableHeadCell
            data="last login"
            sortDir={sortParam === 'lastLogonTime' ? sortDir : 'unsorted'}
            onSortClick={onSortAction}
          />
          <TableHeadCell />
        </TableHead>

        <TableBody>
          {currentUsers.map((user, index) => (
            <TableRow key={`table-row-${index}`}>
              <TableCell
                colName="account name"
                rowheader={true}
                sort={sortParam === 'username'}
              >
                <div className="display-flex flex-justify">
                  <span className="mobile-lg:text-bold maxw-card-lg text-ellipsis">
                    <Username
                      username={user.username}
                      serviceAccount={serviceAccounts[user.username]}
                    />
                  </span>
                </div>
              </TableCell>

              <TableCell
                colName="organization roles"
                sort={sortParam === 'orgRolesCount'}
              >
                <UsersListOrgRoles
                  orgRolesCount={user.orgRolesCount}
                  onClick={() => {
                    openOverlay(user.guid, 'org');
                  }}
                />
              </TableCell>

              <TableCell
                colName="access permissions"
                sort={sortParam === 'spaceRolesCount'}
              >
                <UsersListSpaceRoles
                  spaceRolesCount={user.spaceRolesCount}
                  spacesCount={spacesCount}
                  onClick={() => {
                    openOverlay(user.guid, 'space');
                  }}
                />
              </TableCell>

              <TableCell
                colName="expires"
                sort={sortParam === 'daysToExpiration'}
              >
                <UserAccountExpires daysToExpiration={user.daysToExpiration} />
              </TableCell>

              <TableCell
                colName="last login"
                sort={sortParam === 'lastLogonTime'}
              >
                <UserAccountLastLogin lastLogonTime={user.lastLogonTime} />
              </TableCell>

              <TableCell className="text-center mobile-lg:text-right">
                <UsersActionsRemoveFromOrg
                  user={user}
                  roles={roles[user.guid]}
                  removeUserCallback={removeUserCallback}
                  closeOnSuccess={true}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
