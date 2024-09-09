'use client';

import { pluralize } from '@/helpers/text';
import { Button } from '../uswds/Button';

export function UsersListSpaceRoles({
  onClick,
  spacesCount,
  spaceRolesCount,
}: {
  onClick: Function;
  spacesCount: number;
  spaceRolesCount: number;
}) {
  if (spaceRolesCount <= 0) {
    return (
      <>
        None yet —{' '}
        <Button
          className="usa-button--unstyled font-ui-2xs text-bold"
          onClick={() => onClick()}
        >
          edit permissions
        </Button>
      </>
    );
  }
  return (
    <Button
      className="usa-button--unstyled font-ui-2xs"
      onClick={() => onClick()}
    >
      {`${spaceRolesCount} of ${spacesCount} ${pluralize('space', spacesCount)}`}
    </Button>
  );
}
