'user client';

import { UserObj } from '@/api/cf/cloudfoundry-types';
import { Button } from '@/components/uswds/Button';
import { Modal } from '@/components/uswds/Modal';
import { FormEventHandler, MouseEventHandler, useState } from 'react';
import { Alert } from '../uswds/Alert';

type ActionStatus = 'default' | 'success' | 'error';

function FormDefault({
  user,
  onSubmit,
  onCancel,
}: {
  user: UserObj;
  onSubmit: FormEventHandler;
  onCancel: MouseEventHandler;
}) {
  return (
    <>
      <p>
        Are you sure you want to remove <strong>{user.username}</strong> from
        this organization?
      </p>
      <div className="usa-modal__footer">
        <Button onClick={onSubmit}>Remove</Button>{' '}
        <Button unstyled onClick={onCancel}>
          Cancel
        </Button>
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

function FormError() {
  return <Alert type="error">Something went wrong:</Alert>;
}

export function UsersActionsRemoveFromOrg({
  user,
  // orgGuid,
  formAction,
}: {
  user: UserObj;
  // orgGuid: string;
  formAction: any;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState('default' as ActionStatus);

  function closeModal(): undefined {
    setModalOpen(false);
  }
  function openModal(): undefined {
    setModalOpen(true);
  }

  function submitForm() {
    formAction('hi');
    setActionStatus('success');
  }

  return (
    <>
      <Button unstyled className="font-body-2xs" onClick={openModal}>
        Remove from org
      </Button>
      {modalOpen && (
        <Modal id={`remove-from-org-user-${user.guid}`} close={closeModal}>
          {actionStatus === 'error' && <FormError />}
          {(actionStatus === 'default' || actionStatus === 'error') && (
            <FormDefault
              user={user}
              onSubmit={submitForm}
              onCancel={closeModal}
            />
          )}
          {actionStatus === 'success' && <FormSuccess user={user} />}
        </Modal>
      )}
    </>
  );
}
