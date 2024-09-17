'use client';

import React from 'react';
import { Button } from '@/components/uswds/Button';
import { pluralize } from '@/helpers/text';

export function UsersListOrgRoles({
  orgRolesCount,
  onClick,
}: {
  orgRolesCount: number;
  onClick: Function;
}) {
  if (orgRolesCount <= 0) {
    return (
      <>
        None yet —{' '}
        <Button
          className="usa-button--unstyled font-ui-2xs text-bold"
          onClick={() => onClick()}
        >
          edit roles
        </Button>
      </>
    );
  }
  return (
    <Button
      className="usa-button--unstyled font-ui-2xs"
      onClick={() => onClick()}
    >
      {`${orgRolesCount} ${pluralize('role', orgRolesCount)}`}
    </Button>
  );
}
