import Image from 'next/image';

import { Banner } from '@/components/uswds/Banner';
import { Identifier } from '@/components/Identifier';
import { Footer } from '@/components/Footer';

import cloudGovIcon from '@/public/img/cloud-gov-logo.svg';

import '@/assets/stylesheets/styles.scss';

export const metadata = {
  title: 'cloud.gov Dashboard',
  description: 'Manage cloud.gov organizations, spaces, services, and apps.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-accent-warm-light">
        <Banner />
        <div className="grid-container">
          <div className="grid-row">
            <div className="tablet:grid-col-2">
              <div className="margin-y-4 tablet:margin-y-6 text-center">
                <Image priority src={cloudGovIcon} alt="cloud.gov" />
              </div>
            </div>
            <div className="tablet:grid-col-10 bg-white">
              <div className="grid-container">
                <main className="padding-y-4">{children}</main>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Identifier />
      </body>
    </html>
  );
}
