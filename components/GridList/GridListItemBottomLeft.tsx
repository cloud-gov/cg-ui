import React from 'react';

export function GridListItemBottomLeft({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="tablet:grid-col-2 tablet:margin-right-2 tablet:border-right tablet:border-base-lighter">
      {children}
    </div>
  );
}
