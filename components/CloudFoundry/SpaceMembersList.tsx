'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Modal } from '../Modal';
import { RoleType } from '@/api/cf/cloudfoundry-types';
import {
  removeRole,
  removeUser,
} from '@/app/test/cloudfoundry/orgs/[orgGuid]/spaces/[spaceGuid]/actions';

function MemberLabel({
  user,
}: {
  user: {
    guid: string;
    origin: string;
    roles: {
      guid: string;
      type: RoleType;
    }[];
    username: string;
  };
}) {
  return (
    <>
      {user.username}
      {user.origin && ' [' + user.origin + ']'}
    </>
  );
}

export function SpaceMembersList({
  space,
  users,
}: {
  space: any;
  users: {
    guid: string;
    origin: string;
    roles: {
      guid: string;
      type: RoleType;
    }[];
    username: string;
  }[];
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
      <ul>
        {users.map(
          (user: {
            guid: string;
            origin: string;
            roles: {
              guid: string;
              type: RoleType;
            }[];
            username: string;
          }) => (
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
                <Modal close={() => setConfirmUserRemove('')} id={user.guid}>
                  {!formStateUserRemove.success &&
                    formStateUserRemove.message && <div>Error</div>}
                  {!formStateUserRemove.success &&
                    !formStateUserRemove.message && (
                      <>
                        <div>
                          are you sure you want to remove the user{' '}
                          <MemberLabel user={user} />
                          from the <strong>{space.name}</strong> space?
                        </div>
                        <form action={formActionUserRemove}>
                          <input
                            type="hidden"
                            name="spaceGuid"
                            id="spaceGuid-{space.guid}"
                            value={space.guid}
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
                        id={role.guid}
                      >
                        {!formStateRoleRemove.success &&
                          formStateRoleRemove.message && <div>Error</div>}
                        {!formStateRoleRemove.success &&
                          !formStateRoleRemove.message && (
                            <>
                              <div>
                                are you sure you want to remove the role{' '}
                                <strong>{role.type}</strong> for{' '}
                                <strong>
                                  <MemberLabel user={user} />
                                </strong>
                                ?
                              </div>
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
          )
        )}
      </ul>
    </>
  );
}
