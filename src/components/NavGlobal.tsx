import classnames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import CloudGovLogo from '@/components/svgs/CloudGovLogo';
import dashboardIcon from '@/../public/img/logos/dashboard-icon.svg';
import cloudPagesIcon from '@/../public/img/logos/cloud-pages-icon.svg';

import { Auth } from '@/components/auth/Auth';

const sharedLinkClasses = [
  'border-bottom-05',
  'border-top-0',
  'border-transparent',
  'border-x-0',
  'flex-align-center',
  'margin-right-205',
  'padding-bottom-1',
  'padding-top-105',
  'desktop:padding-bottom-2',
  'desktop:padding-top-205',
  'text-no-underline',
];

function LinkProduct({
  active = false,
  children,
  className,
  href,
}: {
  active?: boolean;
  children: React.ReactNode;
  className: string;
  href: string;
}) {
  const classes = classnames(
    'display-flex',
    'margin-bottom-2px',
    'text-no-underline',
    'text-white',
    {
      'border-white': active,
      'text-bold': active,
    },
    ...sharedLinkClasses,
    className
  );
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

function LinkLogo({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className: string;
  href: string;
}) {
  const classes = classnames(
    'display-block',
    'mobile-lg:margin-right-7',
    'mobile-lg:overflow-visible',
    'overflow-hidden',
    ...sharedLinkClasses,
    className
  );
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function NavGlobal() {
  return (
    <div id="nav-global" className="font-body-xs">
      <div className="display-flex flex-align-center margin-x-auto maxw-desktop-lg padding-x-2 desktop:padding-x-4">
        <LinkLogo href="/" className="cloud-logo">
          <CloudGovLogo />
        </LinkLogo>
        <LinkProduct href="/" className="nav-product" active>
          <Image unoptimized src={dashboardIcon} alt="" />
          <span>Dashboard</span>
        </LinkProduct>
        <LinkProduct href="/" className="nav-product">
          <Image unoptimized src={cloudPagesIcon} alt="" />
          <span>Pages</span>
        </LinkProduct>
        <span className="border-bottom-05 border-transparent margin-left-auto text-white">
          <Auth />
        </span>
      </div>
    </div>
  );
}
