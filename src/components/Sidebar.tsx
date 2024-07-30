import Image from 'next/image';

import cloudGovIcon from '@/public/img/cloud-gov-logo.svg';

export function Sidebar() {
  return (
    <div className="margin-y-4 text-center">
      <Image priority src={cloudGovIcon} alt="cloud.gov" width="160" />
    </div>
  );
}
