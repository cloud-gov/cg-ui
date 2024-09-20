import Image from 'next/image';

import CloudGovLogo from '@/components/svgs/CloudGovLogo';
import cloudPagesIcon from '@/../public/img/logos/cloud-pages-icon.svg';
import dashboardIcon from '@/../public/img/logos/dashboard-icon.svg';
import { NavGlobalLinkProduct } from '@/components/NavGlobal/NavGlobalLinkProduct';
import { NavGlobalLinkLogo } from '@/components/NavGlobal/NavGlobalLinkLogo';

import { Auth } from '@/components/auth/Auth';

const sharedLinkClasses = [
  'border-bottom-05',
  'border-top-0',
  'border-transparent',
  'border-x-0',
  'flex-align-center',
  'margin-right-205',
  'text-no-underline',
];

export function NavGlobal() {
  return (
    <div id="nav-global" className="font-body-xs">
      <div className="display-flex flex-align-center margin-x-auto maxw-desktop-lg padding-x-2 desktop:padding-x-2 padding-y-2px">
        <NavGlobalLinkLogo href="/" sharedClasses={sharedLinkClasses}>
          <CloudGovLogo />
        </NavGlobalLinkLogo>
        <NavGlobalLinkProduct href="/" sharedClasses={sharedLinkClasses} active>
          <Image unoptimized src={dashboardIcon} alt="" />
          <span>Dashboard</span>
        </NavGlobalLinkProduct>
        <NavGlobalLinkProduct href="/" sharedClasses={sharedLinkClasses}>
          <Image unoptimized src={cloudPagesIcon} alt="" />
          <span>Pages</span>
        </NavGlobalLinkProduct>
        <span className="border-bottom-05 border-transparent margin-left-auto">
          <Auth />
        </span>
      </div>
    </div>
  );
}
