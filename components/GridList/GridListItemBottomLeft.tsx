import React from 'react';

export function GridListItemBottomLeft({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="tablet:grid-col-3">{children}</div>;
}
