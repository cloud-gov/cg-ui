'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Modal, modalHeadingId } from '../uswds/Modal';
import { RoleType } from '@/api/cf/cloudfoundry-types';
import {
  removeRole,
  removeUser,
} from '@/app/prototype/cloudfoundry/orgs/[orgGuid]/actions';

interface UserWithRoles {
  guid: string;
  origin: string;
  roles: {
    guid: string;
    type: RoleType;
  }[];
  username: string;
}

function MemberLabel({ user }: { user: UserWithRoles }) {
  return (
    <span className="font-body-lg text-heavy">
      {user.username}
      {user.origin && ' [' + user.origin + ']'}
    </span>
  );
}

export function OrgMembersList({
  org,
  users,
}: {
  org: any;
  users: UserWithRoles[];
}) {
  const [confirmRoleRemove, setConfirmRoleRemove] = useState('');
  const [formStateRoleRemove, formActionRoleRemove] = useFormState(removeRole, {
    success: false,
    message: '',
  });

  const [confirmUserRemove, setConfirmUserRemove] = useState<string>('');
  const [formStateUserRemove, formActionUserRemove] = useFormState(removeUser, {
    success: false,
    message: '',
  });

  return (
    <>
      <ul className="height-card-lg overflow-x-hidden outline-1px">
        {users.map((user: UserWithRoles) => (
          <li key={user.guid}>
            <button
              onClick={() => setConfirmUserRemove(user.guid)}
              className="display-inline-block margin-right-1"
            >
              x
            </button>
            <strong>
              <MemberLabel user={user} />
            </strong>
            {confirmUserRemove === user.guid && (
              <Modal
                close={() => setConfirmUserRemove('')}
                modalId={`modal-${user.guid}`}
                headingId={modalHeadingId(user)}
              >
                {!formStateUserRemove.success &&
                  formStateUserRemove.message && <div>Error</div>}
                {!formStateUserRemove.success &&
                  !formStateUserRemove.message && (
                    <>
                      <p id={modalHeadingId(user)}>
                        are you sure you want to remove the user{' '}
                        <MemberLabel user={user} />
                        from the <strong>{org.name}</strong> organization?
                      </p>
                      <form action={formActionUserRemove}>
                        <input
                          type="hidden"
                          name="orgGuid"
                          id="orgGuid-{org.guid}"
                          value={org.guid}
                        />
                        <input
                          type="hidden"
                          name="userGuid"
                          id="userGuid-{guid}"
                          value={user.guid}
                        />
                        <button role="button" type="submit">
                          yes
                        </button>
                      </form>
                      <button
                        type="button"
                        onClick={() => setConfirmUserRemove('')}
                      >
                        cancel
                      </button>
                    </>
                  )}
                {formStateUserRemove.success && <div>Success!</div>}
                {formStateUserRemove.message && (
                  <div>Message: {formStateUserRemove.message}</div>
                )}
                {formStateUserRemove.message && (
                  <button onClick={() => setConfirmUserRemove('')}>
                    close
                  </button>
                )}
              </Modal>
            )}
            <ul>
              {user.roles.map((role) => (
                <li key={role.guid}>
                  {confirmRoleRemove === role.guid && (
                    <Modal
                      close={() => setConfirmRoleRemove('')}
                      modalId={`modal-${role.guid}`}
                      headingId={modalHeadingId(role)}
                    >
                      {!formStateRoleRemove.success &&
                        formStateRoleRemove.message && <div>Error</div>}
                      {!formStateRoleRemove.success &&
                        !formStateRoleRemove.message && (
                          <>
                            <p id={modalHeadingId(role)}>
                              are you sure you want to remove the role{' '}
                              <strong>{role.type}</strong> for{' '}
                              <strong>
                                <MemberLabel user={user} />
                              </strong>
                              ?
                            </p>
                            <form action={formActionRoleRemove}>
                              <input
                                type="hidden"
                                name="roleGuid"
                                id="roleGuid-{role.guid}"
                                value={role.guid}
                              />
                              <button role="button" type="submit">
                                yes
                              </button>
                            </form>
                            <button
                              type="button"
                              onClick={() => setConfirmRoleRemove('')}
                            >
                              cancel
                            </button>
                          </>
                        )}
                      {formStateRoleRemove.success && <div>Success!</div>}
                      {formStateRoleRemove.message && (
                        <div>Message: {formStateRoleRemove.message}</div>
                      )}
                      {formStateRoleRemove.message && (
                        <button onClick={() => setConfirmRoleRemove('')}>
                          close
                        </button>
                      )}
                    </Modal>
                  )}
                  <button
                    onClick={() => setConfirmRoleRemove(role.guid)}
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
