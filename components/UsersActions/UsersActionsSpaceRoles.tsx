'use client';

import React, { useState } from 'react';
import { RoleObj, SpaceObj } from '@/api/cf/cloudfoundry-types';
import { GridListItem } from '@/components/GridList/GridListItem';
import { Checkbox } from '@/components/uswds/Checkbox';

// TODO this is a temporary interface to make typescript happy, but the main problem is that
// the API RoleObj has RoleType which includes organization roles, and TS is smart enough to be
// angry that the initialRoles has no org role keys on it
interface RoleMap {
  [roleType: string]: {
    name: string;
    guid?: string;
    type: string;
    description: string;
    selected: boolean;
  };
}

const initialRoles = {
  space_supporter: {
    name: 'Supporter',
    type: 'space_supporter',
    description: 'TODO',
    selected: false,
  },
  space_auditor: {
    name: 'Auditor',
    type: 'space_auditor',
    description:
      'Space auditors can view logs, reports, and settings for a space',
    selected: false,
  },
  space_developer: {
    name: 'Developer',
    type: 'space_developer',
    description:
      'Space developers can do everything space auditors can do, and can create and manage apps and services',
    selected: false,
  },
  space_manager: {
    name: 'Manager',
    type: 'space_manager',
    description:
      'Space managers can manage users and enable features but do not create and manage apps and services',
    selected: false,
  },
} as RoleMap;

function handleChange() {
  console.log('clicked');
}

export function UsersActionsSpaceRoles({
  space,
  currentRoles,
  /* eslint-disable no-unused-vars */
  onCancelPath,
  /* eslint-enable no-unused-vars */
}: {
  space: SpaceObj;
  currentRoles: Array<RoleObj>;
  onCancelPath: string;
}) {
  // TODO implement initialRoles as starting state
  /* eslint-disable no-unused-vars */
  const [roles, setRoles] = useState(startingRoles());
  /* eslint-enable no-unused-vars */

  // TODO set this up so that it will reload the roles when the parent
  // form is saved / refreshed
  function startingRoles() {
    const newRoles = { ...initialRoles };
    if (currentRoles) {
      currentRoles.map((role: RoleObj) => {
        newRoles[role.type] = {
          ...newRoles[role.type],
          guid: role.guid,
          selected: true,
        };
      });
    }
    return newRoles;
  }

  return (
    <GridListItem>
      <div className="grid-row">
        <div className="grid-col-4">
          <strong>{space.name}</strong>
        </div>
        {Object.values(roles).map((role: any) => (
          <div
            className="grid-col-2"
            key={`space-${space.guid}-role-${role.type}`}
          >
            <Checkbox
              id={`${space.guid}-${role.type}`}
              name={space.guid}
              checked={role.selected}
              label={role.name}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>
    </GridListItem>
  );
}
