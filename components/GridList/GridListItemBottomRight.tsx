import React from 'react';

export function GridListItemBottomRight({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="tablet:grid-col-2">{children}</div>;
}
