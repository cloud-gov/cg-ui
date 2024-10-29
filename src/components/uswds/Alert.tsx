/***
 * Because Alert components are aria-live regions,
 * Alerts should always be present on page load
 * and show/hide themselves using the isVisible prop:
 * Examples:
 * Good: <Alert isVisible={status === 'success'}>...
 * Bad: { status === 'success' && <Alert> ... }
 ***/

import React from 'react';
import classnames from 'classnames';

type AlertProps = {
  isVisible: boolean;
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
  isVisible = false,
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

  let role = 'region';
  if (type === 'success') {
    role = 'status';
  }
  if (type === 'error' || type === 'emergency') {
    role = 'alert';
  }

  return (
    <div role={role} aria-label={role === 'region' ? `${type} alert` : ''}>
      {isVisible && (
        <div className={classes} {...defaultProps}>
          <div className="usa-alert__body">
            {heading && (
              <Heading className="usa-alert__heading font-sans-md">
                {heading}
              </Heading>
            )}
            {children &&
              (validation ? (
                children
              ) : (
                // extra padding-left is needed here due to a bug with the $theme-site-margins-width setting
                <p className="usa-alert__text">{children}</p>
              ))}
          </div>
        </div>
      )}
      {!isVisible && ''}
    </div>
  );
}
