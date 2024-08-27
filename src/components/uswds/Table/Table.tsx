import React from 'react';

export function Table({
  caption = 'data table',
  children,
  sortable = true,
  sortText,
}: {
  caption?: string;
  children: React.ReactNode;
  sortable?: boolean;
  sortText?: string;
}) {
  return (
    <div className="usa-table-container--scrollable" tabIndex={0}>
      <table className="usa-table usa-table--stacked width-full">
        <caption className="usa-sr-only">{caption}</caption>
        {children}
      </table>
      {sortable && (
        <div
          className="usa-sr-only usa-table__announcement-region"
          aria-live="polite"
        >
          {sortText}
        </div>
      )}
    </div>
  );
}
