import classnames from 'classnames';
import Link from 'next/link';
import React from 'react';

export function NavGlobalLinkLogo({
  children,
  href,
  sharedClasses,
}: {
  children: React.ReactNode;
  href: string;
  sharedClasses: Array<string>;
}) {
  const classes = classnames(
    'cloud-logo',
    // USWDS classes
    'display-block',
    'mobile-lg:margin-right-7',
    'mobile-lg:overflow-visible',
    'overflow-hidden',
    ...sharedClasses
  );
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
