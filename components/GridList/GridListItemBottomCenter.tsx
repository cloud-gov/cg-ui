import React from 'react';

export function GridListItemBottomCenter({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="tablet:grid-col-fill">{children}</div>;
}
