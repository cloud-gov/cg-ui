'use client';

import { Button } from '@/components/uswds/Button';
import { useRouter } from 'next/navigation';

export function AddUserButton({ orgId }: { orgId: string }) {
  const router = useRouter();
  return (
    <Button
      className="margin-right-0"
      onClick={() => {
        router.push(`/orgs/${orgId}/users/add`);
      }}
    >
      Add new user
    </Button>
  );
}
