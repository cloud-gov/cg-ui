'user client';

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

function FormDefault({
  user,
  onSubmit,
  onCancel,
}: {
  user: UserObj;
  onSubmit: any;
  onCancel: MouseEventHandler;
}) {
  return (
    <>
      <p>
        Are you sure you want to remove <strong>{user.username}</strong> from
        this organization?
      </p>
      <div className="usa-modal__footer">
        <form action={onSubmit}>
          <Button type="submit">Remove</Button>{' '}
          <Button unstyled type="button" onClick={onCancel}>
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
    setActionStatus('default');
    setActionErrors([]);
  }
  function openModal(): undefined {
    setModalOpen(true);
  }

  const [actionStatus, setActionStatus] = useState('default');
  const [actionErrors, setActionErrors] = useState([] as string[]);

  async function onSubmit() {
    console.log('allSpaceRoleGuids', roles.allSpaceRoleGuids);
    console.log('allOrgRoleGuids', roles.allOrgRoleGuids);
    const result = (await removeFromOrg()) as ControllerResult;
    if (result?.meta?.status === 'success') {
      setActionStatus('success');
      !!removeUserCallback && removeUserCallback(user);
    }
    if (result?.meta?.status === 'error') {
      setActionStatus('error');
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
          {(actionStatus === 'default' || actionStatus === 'error') && (
            <FormDefault
              user={user}
              onSubmit={onSubmit}
              onCancel={closeModal}
            />
          )}
          {actionStatus === 'success' && <FormSuccess user={user} />}
        </Modal>
      )}
    </>
  );
}
