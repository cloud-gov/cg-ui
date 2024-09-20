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
    // Custom class for “active” product link
    {
      'nav-product-active': active
    },
    // USWDS classes
    'display-flex',
    'padding-y-105',
    'tablet:padding-y-2',
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
