// Copied largely from
// https://github.com/trussworks/react-uswds/ Alert component

import React from 'react';
import classnames from 'classnames';

type AlertProps = {
  type: 'emergency' | 'error' | 'info' | 'success' | 'warning';
  heading?: React.ReactNode;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children?: React.ReactNode;
  slim?: boolean;
  noIcon?: boolean;
  validation?: boolean;
};

export function Alert({
  children,
  className,
  heading,
  headingLevel = 'h4',
  noIcon,
  slim,
  type,
  validation,
  ...defaultProps
}: AlertProps & React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  const classes = classnames(
    'usa-alert',
    {
      'usa-alert--emergency': type === 'emergency',
      'usa-alert--error': type === 'error',
      'usa-alert--info': type === 'info',
      'usa-alert--success': type === 'success',
      'usa-alert--warning': type === 'warning',
      'usa-alert--slim': slim,
      'usa-alert--no-icon': noIcon,
      'usa-alert--validation': validation,
    },
    className
  );

  const Heading = headingLevel;

  return (
    <div className={classes} {...defaultProps}>
      <div className="usa-alert__body">
        {heading && <Heading className="usa-alert__heading">{heading}</Heading>}
        {children &&
          (validation ? (
            children
          ) : (
            <p className="usa-alert__text">{children}</p>
          ))}
      </div>
    </div>
  );
}
