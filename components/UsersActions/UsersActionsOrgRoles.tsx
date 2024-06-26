'use client';

import { useState } from 'react';
import { Button } from '@/components/uswds/Button';

type FormRoles = {
  [role_type: string]: {
    name: string;
    type: string;
    description: string;
    selected: boolean;
    default: boolean;
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
  billing_manager: {
    name: 'Billing manager',
    type: 'billing_manager',
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

export function UsersActionsOrgRoles() {
  const [roles, setRoles] = useState(initialRoles as FormRoles);

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

  return (
    <form>
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
          <Button unstyled>Cancel</Button>
          <Button className="margin-left-4">Save</Button>
        </div>
      </fieldset>
    </form>
  );
}
