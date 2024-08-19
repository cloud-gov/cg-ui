import classnames from 'classnames';
import Link from 'next/link';
import React from 'react';

export function NavGlobalLinkProduct({
  active = false,
  children,
  href,
  sharedClasses,
}: {
  active?: boolean;
  children: React.ReactNode;
  href: string;
  sharedClasses: Array<string>;
}) {
  const classes = classnames(
    'nav-product',
    // USWDS classes
    'display-flex',
    'margin-bottom-2px',
    'text-no-underline',
    'text-white',
    // USWDS applied only when active
    {
      'border-white': active,
      'text-bold': active,
    },
    ...sharedClasses
  );
  return (
    <Link href={href} className={classes} data-testid="nav-global-link-product">
      {children}
    </Link>
  );
}
