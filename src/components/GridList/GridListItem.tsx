import React from 'react';

export function GridListItem({ children }: { children: React.ReactNode }) {
  return (
    <div role="listitem" className="padding-y-3">
      {children}
    </div>
  );
}
