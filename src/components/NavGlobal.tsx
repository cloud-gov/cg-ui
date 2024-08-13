import Image from 'next/image';
import Link from 'next/link';

import cloudGovText from '@/../public/img/logos/cloud-gov-logo-text.svg';
import cloudGovIcon from '@/../public/img/logos/cloud-gov-icon.svg';
import dashboardIcon from '@/../public/img/logos/dashboard-icon.svg';
import cloudPagesIcon from '@/../public/img/logos/cloud-pages-icon.svg';

import { Auth } from '@/components/auth/Auth';

export function NavGlobal() {
  return (
    <div id="nav-global">
      <div>
        <div className="nav-global-inner">
          <Link href="/" className="cloud-logo">
            <Image
              id="cloud-gov-icon"
              unoptimized
              src={cloudGovIcon}
              alt="cloud.gov"
            />
            <Image
              id="cloud-gov-logo-text"
              unoptimized
              src={cloudGovText}
              alt="cloud.gov"
            />
          </Link>
          <Link href="/" className="nav-product active">
            <Image unoptimized src={dashboardIcon} alt="dashboard" />
            <span>Dashboard</span>
          </Link>
          <Link href="/" className="nav-product">
            <Image unoptimized src={cloudPagesIcon} alt="Cloud Pages icon" />
            <span>Pages</span>
          </Link>
          <span className="margin-left-auto margin-bottom-05 border-bottom-05 border-transparent">
            <Auth />
          </span>
        </div>
      </div>
    </div>
  );
}
