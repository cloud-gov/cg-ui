import React from 'react';

export function OrgPickerList({ children }: { children: React.ReactNode }) {
  return (
    <ul
      className="orgs-selector__list usa-list usa-list--unstyled maxh-card overflow-x-hidden overflow-y-scroll border-bottom border-top border-base-light"
      tabIndex={0}
      aria-label="Organizations list"
      role="menu"
    >
      {children}
    </ul>
  );
}
