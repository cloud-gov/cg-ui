import React from 'react';

export function CardRow({ children }: { children: React.ReactNode }) {
  return <ul className="grid-row grid-gap-3 usa-card-group">{children}</ul>;
}
