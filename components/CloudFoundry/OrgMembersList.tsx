'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import {
  CfOrgUser,
  CfOrgUserRoleList,
} from '../../api/cloudfoundry/cloudfoundry';
import { Modal } from '../Modal';
import {
  removeRole,
  removeUser,
} from '../../app/cloudfoundry/orgs/[guid]/actions';

function MemberLabel({ user }: { user: CfOrgUser }) {
  return (
    <>
      {user.displayName ? user.displayName : user.username}
      {user.origin && ' [' + user.origin + ']'}
    </>
  );
}

export function OrgMembersList({
  org,
  users,
}: {
  org: any;
  users: CfOrgUserRoleList;
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
        {Object.entries(users).map(([guid, user]: [string, CfOrgUser]) => (
          <li key={guid}>
            <button
              onClick={() => setConfirmUserRemove(guid)}
              className="display-inline-block margin-right-1"
            >
              x
            </button>
            <strong>
              <MemberLabel user={user} />
            </strong>
            {confirmUserRemove === guid && (
              <Modal close={() => setConfirmUserRemove('')} id={guid}>
                {!formStateUserRemove.success &&
                  formStateUserRemove.message && <div>Error</div>}
                {!formStateUserRemove.success &&
                  !formStateUserRemove.message && (
                    <>
                      <div>
                        are you sure you want to remove the user{' '}
                        <MemberLabel user={user} />
                        from the <strong>{org.name}</strong> organization?
                      </div>
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
                          value={guid}
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
        ))}
      </ul>
    </>
  );
}
