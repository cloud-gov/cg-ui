'use client';

export function UsersListUsername({ username }: { username: string }) {
  return (
    <h2 className="margin-bottom-0 text-break-all font-heading-md">
      {username ? username : 'Unnamed user'}
    </h2>
  );
}
