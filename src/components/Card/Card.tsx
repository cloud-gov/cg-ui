import React from 'react';
import classNames from 'classnames';

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardClasses = classNames(
    'bg-white border border-gray-cool-20 radius-md padding-2 tablet-lg:padding-3 minh-card-lg',
    className
  );
  return (
    <li className="tablet:grid-col-6 tablet-lg:grid-col-4 margin-bottom-3">
      <div className={cardClasses}>{children}</div>
    </li>
  );
}
