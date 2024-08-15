import React from 'react';

export function LayoutHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="desktop:display-flex flex-align-center flex-justify border-bottom border-accent-warm-light">
      <div className="padding-x-4 font-ui-lg padding-y-2 text-semibold">
        {children}
      </div>
    </div>
  );
}
