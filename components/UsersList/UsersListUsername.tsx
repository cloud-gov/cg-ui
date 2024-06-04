'use client';

import { Button } from '@/components/uswds/Button';

export function UsersListUsername({ username }: { username: string }) {
  return (
    <div className="margin-bottom-2 tablet:margin-bottom-0">
      <h3 className="margin-bottom-0 text-break-all">{username}</h3>
      <Button
        unstyled
        className="usa-button usa-button--unstyled font-body-2xs"
      >
        Remove from org
      </Button>
    </div>
  );
}
