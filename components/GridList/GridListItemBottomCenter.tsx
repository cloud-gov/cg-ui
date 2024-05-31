import React from 'react';

export function GridListItemBottomCenter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="tablet:grid-col-fill tablet:margin-right-1 tablet:border-right tablet:border-base-lighter">
      {children}
    </div>
  );
}
