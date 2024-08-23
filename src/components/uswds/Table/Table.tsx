import React from 'react';

export function Table({
  caption = 'data table',
  children,
}: {
  caption?: String;
  children: React.ReactNode;
}) {
  return (
    <div className="usa-table-container--scrollable" tabIndex={0}>
      <table className="usa-table usa-table--stacked width-full">
        <caption className="usa-sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}
