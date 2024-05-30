import React from 'react';

export function GridList({ children }: { children: React.ReactNode }) {
  return (
    <div role="list" className="grid-container padding-x-0">
      {children}
    </div>
  );
}
