import React from 'react';

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="bg-white mobile-lg:font-ui-2xs">{children}</tbody>;
}
