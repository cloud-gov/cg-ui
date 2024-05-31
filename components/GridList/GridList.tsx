import React from 'react';

export function GridList({ children }: { children: React.ReactNode }) {
  return <div role="list">{children}</div>;
}
