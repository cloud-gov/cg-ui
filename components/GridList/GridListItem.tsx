import React from 'react';

export function GridListItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="listitem"
      className="border padding-x-5 padding-y-3 radius-md border-base-lighter"
    >
      {children}
    </div>
  );
}
