import React from 'react';
import Image from 'next/image';
// import cloudIcon from '@/../public/img/cloud-gov-icon.svg';
import cloudGovLogo from '@/../public/img/cloud-gov-logo-white.svg';
import dashboardIcon from '@/../public/img/dashboard-icon.svg';
import cloudPagesIcon from '@/../public/img/cloud-pages-icon.svg';
import Link from 'next/link';

export function NavGlobal() {
  return (
    // add height-8 if you want it to be up to the spec
    <div id="nav-global">
      <div>
        <div className="nav-global-inner">
          <Link href="/" className="margin-right-7">
            <Image
              id="cloud-gov-logo"
              unoptimized
              src={cloudGovLogo}
              alt="cloud.gov"
            />
          </Link>
          <span className="products"></span>
          <Link href="/">
            <span className="nav-product active">
              <Image
                unoptimized
                src={dashboardIcon}
                alt="dashboard"
                height={24}
                width={24}
              />
              <span>Dashboard</span>
            </span>
          </Link>
          <Link href="/">
            <span className="nav-product">
              <Image
                unoptimized
                src={cloudPagesIcon}
                alt="Cloud Pages icon"
                height={24}
                width={24}
              />
              <span>Pages</span>
            </span>
          </Link>
          <span className="margin-left-auto margin-bottom-05 border-bottom-05 border-transparent">
            Log out
          </span>
        </div>
      </div>
    </div>
  );
}
