'use client';

import React from 'react';
import { UserObj } from '@/api/cf/cloudfoundry-types';
import { Button } from '@/components/uswds/Button';
import { Modal, modalHeadingId } from '@/components/uswds/Modal';
import { MouseEventHandler, useState } from 'react';
import { Alert } from '../uswds/Alert';
import {
  ControllerResult,
  RolesByUserItem,
} from '@/controllers/controller-types';
import { removeFromOrg } from '@/app/orgs/[orgId]/actions';

type ActionStatus = 'default' | 'pending' | 'success' | 'error';

function FormDefault({
  user,
  onSubmit,
  onCancel,
  actionStatus,
}: {
  user: UserObj;
  onSubmit: any;
  onCancel: MouseEventHandler;
  actionStatus: ActionStatus;
}) {
  const isPending = actionStatus === 'pending';
  return (
    <>
      <p id={modalHeadingId(user)} className="font-sans-md text-bold">
        Are you sure you want to remove {user.username || 'this account'} from
        this organization?
      </p>
      <p>
        If you remove this account, you’ll have to add it back to this
        organization in order to restore its access.
      </p>
      {isPending && <p>Removal pending...</p>}
      <div className="usa-modal__footer">
        <form onSubmit={onSubmit}>
          <Button type="submit" disabled={isPending}>
            Yes, remove the account
          </Button>{' '}
          <Button
            unstyled
            type="button"
            onClick={onCancel}
            disabled={isPending}
          >
            Go back
          </Button>
        </form>
      </div>
    </>
  );
}

function FormSuccess({ user }: { user: UserObj }) {
  return (
    <Alert type="success">
      <strong>{user.username}</strong> has been successfully removed from the
      org.
    </Alert>
  );
}

function FormError({ errors }: { errors: string[] }) {
  return <Alert type="error">{errors.join(', ')}</Alert>;
}

export function UsersActionsRemoveFromOrg({
  user,
  roles,
  removeUserCallback,
  closeOnSuccess = false,
}: {
  user: UserObj;
  roles: RolesByUserItem;
  removeUserCallback?: Function;
  closeOnSuccess?: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  function closeModal(): undefined {
    setModalOpen(false);
    setActionStatus('default' as ActionStatus);
    setActionErrors([]);
  }
  function openModal(): undefined {
    setModalOpen(true);
  }

  const [actionStatus, setActionStatus] = useState('default' as ActionStatus);
  const [actionErrors, setActionErrors] = useState([] as string[]);

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setActionStatus('pending' as ActionStatus);
    const result = (await removeFromOrg(
      roles.allSpaceRoleGuids,
      roles.allOrgRoleGuids
    )) as ControllerResult;
    if (result?.meta?.status === 'success') {
      setActionStatus('success' as ActionStatus);
      closeOnSuccess && closeModal();
      !!removeUserCallback && removeUserCallback(user);
    }
    if (result?.meta?.status === 'error') {
      setActionStatus('error' as ActionStatus);
      result?.meta?.errors && setActionErrors(result.meta.errors);
    }
  }

  return (
    <>
      <Button
        className="usa-button--outline width-auto margin-0 mobile-lg:padding-y-1 mobile-lg:padding-x-105 mobile-lg:font-sans-xs"
        onClick={openModal}
      >
        Remove
      </Button>
      {modalOpen && (
        <Modal
          close={closeModal}
          modalId={`modal-remove-from-org-user-${user.guid}`}
          headingId={modalHeadingId(user)}
        >
          {actionStatus === 'error' && <FormError errors={actionErrors} />}
          {actionStatus !== 'success' && (
            <FormDefault
              user={user}
              onSubmit={onSubmit}
              onCancel={closeModal}
              actionStatus={actionStatus}
            />
          )}
          {actionStatus === 'success' && <FormSuccess user={user} />}
        </Modal>
      )}
    </>
  );
}
