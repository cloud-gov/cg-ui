'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import {
  CfOrgUser,
  CfOrgUserRoleList,
} from '../../api/cloudfoundry/cloudfoundry';
import { Modal } from '../Modal';
import { removeRole } from '../../app/cloudfoundry/orgs/[guid]/actions';

export function OrgMembersList({ users }: { users: CfOrgUserRoleList }) {
  const initialState = {
    success: false,
    message: '',
  };
  const [confirm, setConfirm] = useState('');
  const [formState, formAction] = useFormState(removeRole, initialState);

  return (
    <>
      <ul>
        {Object.entries(users).map(([guid, user]: [string, CfOrgUser]) => (
          <li key={guid}>
            <strong>
              {user.username}, {user.origin}
            </strong>
            <ul>
              {user.roles.map((role) => (
                <li key={role.guid}>
                  {confirm === role.guid && (
                    <Modal close={() => setConfirm('')}>
                      {!formState.success && formState.message && (
                        <div>Error</div>
                      )}
                      {!formState.success && !formState.message && (
                        <>
                          <div>
                            are you sure you want to remove the role{' '}
                            <strong>{role.type}</strong> for{' '}
                            <strong>
                              {user.username}, {user.origin}
                            </strong>
                            ?
                          </div>
                          <form action={formAction}>
                            <input
                              type="hidden"
                              name="roleGuid"
                              id="roleGuid"
                              value={role.guid}
                            />
                            <button role="button" type="submit">
                              yes
                            </button>
                          </form>
                          <button type="button" onClick={() => setConfirm('')}>
                            cancel
                          </button>
                        </>
                      )}
                      {formState.success && <div>Success!</div>}
                      {formState.message && (
                        <div>Message: {formState.message}</div>
                      )}
                      {formState.message && (
                        <button onClick={() => setConfirm('')}>close</button>
                      )}
                    </Modal>
                  )}
                  <button
                    onClick={() => setConfirm(role.guid)}
                    className="display-inline-block margin-right-1"
                  >
                    x
                  </button>
                  <span>{role.type}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}
