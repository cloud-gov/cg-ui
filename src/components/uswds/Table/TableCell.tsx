import React from 'react';
import classnames from 'classnames';

const MobileLabel = ({ label }: { label: string }) => (
  <div
    className="mobile-lg:display-none text-bold text-capitalize"
    aria-hidden={true}
  >
    {label}
  </div>
);

export function TableCell({
  children,
  className = '',
  colName,
  rowheader = false,
  sort = false,
}: {
  children: React.ReactNode;
  className?: string;
  colName?: string;
  rowheader?: boolean;
  sort?: boolean;
}) {
  const classes = classnames(
    {
      active: sort,
    },
    className
  );
  const content = (
    <>
      {colName && <MobileLabel label={colName} />}
      {children}
    </>
  );
  if (rowheader) {
    return (
      <th className={classes} scope="row">
        {content}
      </th>
    );
  }
  return <td className={classes}>{content}</td>;
}
