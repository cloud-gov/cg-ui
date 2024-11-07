import React from 'react';
import classNames from 'classnames';

export function Card({
  children,
  containerClassname,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassname?: string;
}) {
  const containerClasses = classNames(
    'tablet:grid-col-6 tablet-lg:grid-col-4 margin-bottom-3',
    containerClassname
  );
  const cardClasses = classNames(
    'bg-white border border-gray-cool-20 radius-md padding-2 tablet-lg:padding-3 minh-card-lg',
    className
  );
  return (
    <li className={containerClasses}>
      <div className={cardClasses}>{children}</div>
    </li>
  );
}
