'use client';

export function UsersListUsername({ username }: { username: string }) {
  return (
    <>
      <h3 className="margin-bottom-0 text-break-all">{username}</h3>
      <button className="usa-button usa-button--unstyled font-heading-3xs">
        remove from org
      </button>
    </>
  );
}
