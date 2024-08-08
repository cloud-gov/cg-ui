import React from 'react';

export function GridListItemBottom({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grid-row padding-y-1">{children}</div>;
}
