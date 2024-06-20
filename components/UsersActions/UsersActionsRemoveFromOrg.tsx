'user client';

import React from 'react';
import { UserObj } from '@/api/cf/cloudfoundry-types';
import { Button } from '@/components/uswds/Button';
import { Modal } from '@/components/uswds/Modal';
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
  return (
    <>
      <p>
        Are you sure you want to remove <strong>{user.username}</strong> from
        this organization?
      </p>
      {actionStatus === 'pending' && <p>Removal pending...</p>}
      <div className="usa-modal__footer">
        <form onSubmit={onSubmit}>
          <Button type="submit" disabled={actionStatus === 'pending'}>
            Remove
          </Button>{' '}
          <Button
            unstyled
            type="button"
            onClick={onCancel}
            disabled={actionStatus === 'pending'}
          >
            Cancel
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
}: {
  user: UserObj;
  roles: RolesByUserItem;
  removeUserCallback?: Function;
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
      !!removeUserCallback && removeUserCallback(user);
    }
    if (result?.meta?.status === 'error') {
      setActionStatus('error' as ActionStatus);
      result?.meta?.errors && setActionErrors(result.meta.errors);
    }
  }

  return (
    <>
      <Button unstyled className="font-body-2xs" onClick={openModal}>
        Remove from org
      </Button>
      {modalOpen && (
        <Modal id={`remove-from-org-user-${user.guid}`} close={closeModal}>
          {actionStatus === 'error' && <FormError errors={actionErrors} />}
          {(actionStatus === 'default' ||
            actionStatus === 'pending' ||
            actionStatus === 'error') && (
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
