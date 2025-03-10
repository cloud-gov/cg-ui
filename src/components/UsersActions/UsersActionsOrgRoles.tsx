'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/uswds/Button';
import { getEditOrgRoles } from '@/controllers/controllers';
import { RoleObj as ApiRoleObj } from '@/api/cf/cloudfoundry-types';
import { Alert } from '@/components/uswds/Alert';
import Link from 'next/link';
import { updateOrgRolesForUser } from '@/app/orgs/[orgId]/users/[userId]/org-roles/actions';
import { ControllerResult } from '@/controllers/controller-types';
import { Checkbox } from '@/components/uswds/Checkbox';

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
  onCancel,
  onCancelPath,
  onSuccess,
}: {
  orgGuid: string;
  userGuid: string;
  onCancel?: Function;
  onCancelPath?: string;
  onSuccess?: Function;
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
        onSuccess && onSuccess(userGuid);
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
    return (
      <Alert type="error" isVisible={!!loadingErrorMessage}>
        {loadingErrorMessage}
      </Alert>
    );
  }

  if (!dataLoaded) {
    return <p>Loading form...</p>;
  }

  return (
    <>
      {/* aria-live region needs to show up on initial page render. */}
      <div
        role="region"
        aria-live="polite"
        aria-atomic={true}
        className="usa-sr-only"
      >
        {actionErrors.join(', ')}
      </div>

      <Alert type="success" isVisible={actionStatus === 'success'}>
        Org roles have been saved!
      </Alert>

      <Alert
        type="error"
        isVisible={actionStatus === 'error'}
        heading="An error has occured."
      >
        {actionErrors.join(', ')} If the error occurs again, please contact{' '}
        <Link
          className="text-bold text-ink"
          href={process.env.NEXT_PUBLIC_CLOUD_SUPPORT_URL || '/'}
        >
          Cloud.gov support
        </Link>
        .
      </Alert>

      <form onSubmit={onSubmit} name="edit-org-roles-form">
        <fieldset className="usa-fieldset">
          <legend className="usa-legend usa-sr-only margin-bottom-2">
            <strong>Select org roles</strong>
          </legend>
          <div className="padding-3 padding-left-0 border-top border-base-light">
            {Object.values(roles).map((role, i) => (
              <div
                key={`UsersActionsOrgRoles-checkbox-${i}`}
                className={`usa-checkbox margin-bottom-3 ${role.default ? 'default' : ''}`}
              >
                <Checkbox
                  id={role.type}
                  name={role.type}
                  data-testid={`checkbox_${role.type}`}
                  disabled={!!role.default}
                  checked={role.selected || role.default}
                  onChange={handleChange}
                  label={role.name}
                  labelDescription={role.description}
                />
              </div>
            ))}
          </div>
          <div>
            <Button
              className="margin-right-4 margin-bottom-2"
              type="submit"
              disabled={actionStatus === 'pending'}
            >
              Update roles
            </Button>
            {onCancelPath && (
              <Link
                href={onCancelPath}
                className="usa-button usa-button--unstyled margin-right-4"
              >
                Cancel
              </Link>
            )}
            {onCancel && (
              <Button
                className="usa-button--outline"
                onClick={() => onCancel()}
              >
                Cancel
              </Button>
            )}
          </div>
          {actionStatus === 'pending' && (
            <div role="alert">
              <p>submission in progress...</p>
            </div>
          )}
        </fieldset>
      </form>
    </>
  );
}
