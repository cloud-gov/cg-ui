import React from 'react';

export function Table({
  caption = 'data table',
  children,
  sortText,
}: {
  caption?: string;
  children: React.ReactNode;
  sortText: string;
}) {
  return (
    <div className="usa-table-container--scrollable" tabIndex={0}>
      <table className="usa-table usa-table--stacked width-full">
        <caption className="usa-sr-only">{caption}</caption>
        {children}
      </table>
      <div
        className="usa-sr-only usa-table__announcement-region"
        aria-live="polite"
      >
        {sortText}
      </div>
    </div>
  );
}
