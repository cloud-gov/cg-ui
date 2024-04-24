import React from 'react';

export function UsersTableCol({
  auto,
  children,
}: {
  auto?: Boolean;
  children: React.ReactNode;
}) {
  const classNames = [auto ? 'grid-col-auto' : 'grid-col', 'padding-1'];
  return <div className={classNames.join(' ')}>{children}</div>;
}
