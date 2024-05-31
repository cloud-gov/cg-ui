'use client';

import { Button } from '@/components/uswds/Button';

export function UsersListUsername({ username }: { username: string }) {
  return (
    <>
      <h3 className="margin-bottom-0 text-break-all">{username}</h3>
      <Button unstyled className="font-heading-3xs">
        remove from org
      </Button>
    </>
  );
}
