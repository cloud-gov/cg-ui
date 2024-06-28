'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/uswds/Button';
import { getEditOrgRoles } from '@/controllers/controllers';
import { RoleObj as ApiRoleObj } from '@/api/cf/cloudfoundry-types';
import { Alert } from '../uswds/Alert';
import Link from 'next/link';
import { updateOrgRolesForUser } from '@/app/orgs/[orgId]/users/[userId]/org-roles/actions';
import { ControllerResult } from '@/controllers/controller-types';

type ActionStatus = 'default' | 'pending' | 'success' | 'error';

type FormRoles = {
  [role_type: string]: {
    name: string;
    type: string;
    description: string;
    selected: boolean;
    default: boolean;
    guid?: string;
  };
};

const initialRoles = {
  organization_user: {
    name: 'User',
    type: 'organization_user',
    description:
      'Does not have org level access. Can be added to spaces by org managers',
    selected: false,
    default: true,
  },
  organization_billing_manager: {
    name: 'Billing manager',
    type: 'organization_billing_manager',
    description:
      'Create and manage the billing account and payment info for org',
    selected: false,
    default: false,
  },
  organization_auditor: {
    name: 'Org auditor',
    type: 'organization_auditor',
    description:
      'View logs, reports, and settings for org and ALL of the orgs spaces',
    selected: false,
    default: false,
  },
  organization_manager: {
    name: 'Org manager',
    type: 'organization_manager',
    description: 'Can also manage users and enable features',
    selected: false,
    default: false,
  },
};

export function UsersActionsOrgRoles({
  orgGuid,
  userGuid,
  onCancelPath,
}: {
  orgGuid: string;
  userGuid: string;
  onCancelPath?: string;
}) {
  const [roles, setRoles] = useState(initialRoles as FormRoles);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingErrorMessage, setloadingErrorMessage] = useState(null);
  const [actionStatus, setActionStatus] = useState('default' as ActionStatus);
  const [actionErrors, setActionErrors] = useState([] as string[]);

  useEffect(() => {
    const fetchRoles = async () => {
      if (dataLoaded) return;
      try {
        const { payload } = await getEditOrgRoles(orgGuid, userGuid);
        setDataLoaded(true);
        setFetchedRolesToState(payload.resources);
      } catch (e: any) {
        setloadingErrorMessage(e.message);
      }
    };
    fetchRoles();
  });

  function setFetchedRolesToState(apiRoles: ApiRoleObj[]) {
    // conform api roles response to state
    const newRoles = { ...roles };
    apiRoles.map((role: ApiRoleObj) => {
      newRoles[role.type] = {
        ...newRoles[role.type],
        guid: role.guid,
        selected: true,
      };
    });
    setRoles(newRoles);
  }

  function setCheckboxState(value: string) {
    var newRoles = { ...roles };
    var newValue = !newRoles[value].selected;
    newRoles[value].selected = newValue;
    setRoles(newRoles);
  }

  function handleChange(event: any) {
    const value = event.target.id;
    setCheckboxState(value);
  }
  /* Since USWDS labels are clickable (and hide the actual checkboxes),
  we need to handle click events on the label as if they were check/uncheck actions. */
  function handleLabelClick(event: any) {
    event.preventDefault();
    const value = event.target.getAttribute('for');
    setCheckboxState(value);
  }

  async function onSubmit(
    e: React.SyntheticEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    setActionStatus('pending' as ActionStatus);
    setActionErrors([]);
    try {
      await updateOrgRolesForUser(orgGuid, userGuid, roles);
      const result = (await getEditOrgRoles(
        orgGuid,
        userGuid
      )) as ControllerResult;
      if (result?.meta?.status === 'success') {
        setRoles(initialRoles); // reset data is needed to wipe the old guids from removed roles
        setFetchedRolesToState(result.payload.resources);
        setActionStatus('success' as ActionStatus);
      }
      if (result?.meta?.status === 'error') {
        result?.meta?.errors && setActionErrors(result.meta.errors);
        setActionStatus('error' as ActionStatus);
      }
    } catch (e: any) {
      setActionStatus('error' as ActionStatus);
      setActionErrors([e.message]);
    }
  }

  if (loadingErrorMessage) {
    return <Alert type="error">{loadingErrorMessage}</Alert>;
  }

  if (!dataLoaded) {
    return <p>Loading form...</p>;
  }

  return (
    <>
      {actionStatus === 'success' && (
        <Alert type="success">Org roles have been saved!</Alert>
      )}
      {actionStatus === 'error' && (
        <Alert type="error">{actionErrors.join(', ')}</Alert>
      )}
      <form onSubmit={onSubmit} name="edit-org-roles-form">
        <fieldset className="usa-fieldset">
          <legend className="usa-legend">
            <strong>Select org roles</strong>
          </legend>
          <div className="margin-3">
            {Object.values(roles).map((role, i) => (
              <div
                key={`UsersActionsOrgRoles-checkbox-${i}`}
                className={`usa-checkbox margin-bottom-3 ${role.default ? 'default' : ''}`}
              >
                <input
                  className="usa-checkbox__input"
                  id={role.type}
                  type="checkbox"
                  name={role.type}
                  checked={role.selected || role.default}
                  disabled={!!role.default}
                  onChange={handleChange}
                  data-testid={`checkbox_${role.type}`}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor={role.type}
                  onClick={handleLabelClick}
                  data-testid={`label_${role.type}`}
                >
                  <strong>{role.name}</strong>
                  <span className="usa-checkbox__label-description">
                    {role.description}
                  </span>
                </label>
              </div>
            ))}
          </div>
          <div className="padding-top-3 border-top-1px">
            {onCancelPath && (
              <Link
                href={onCancelPath}
                className="usa-button usa-button--unstyled margin-right-4"
              >
                Cancel
              </Link>
            )}
            <Button type="submit" disabled={actionStatus === 'pending'}>
              Save
            </Button>
          </div>
          {actionStatus === 'pending' && <p>submission in progress...</p>}
        </fieldset>
      </form>
    </>
  );
}
