import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';

import cloudGovText from '@/../public/img/logos/cloud-gov-logo-text.svg';
import cloudGovIcon from '@/../public/img/logos/cloud-gov-icon.svg';
import dashboardIcon from '@/../public/img/logos/dashboard-icon.svg';
import cloudPagesIcon from '@/../public/img/logos/cloud-pages-icon.svg';

import { LoginButton } from '@/components/auth/LoginButton';
import { LogoutButton } from '@/components/auth/LogoutButton';

export function NavGlobal() {
  const cookieStore = cookies();
  const authSession = cookieStore.get('authsession');

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
            {authSession ? <LogoutButton /> : <LoginButton />}
          </span>
        </div>
      </div>
    </div>
  );
}
