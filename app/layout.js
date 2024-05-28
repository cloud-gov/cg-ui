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
    <html lang="en" className="height-full">
      <body className="bg-accent-warm-light height-full">
        <div className="border-bottom border-white">
          <Banner />
        </div>
        <div className="grid-container desktop:height-full desktop:display-flex desktop:overflow-hidden">
          <div className="desktop:grid-col-2">
            <div className="margin-y-4 text-center">
              <Image priority src={cloudGovIcon} alt="cloud.gov" width="160" />
            </div>
          </div>
          <div className="desktop:grid-col-10 bg-white height-full flex-column display-flex">
            <div className="padding-x-4 desktop:display-flex border-bottom border-accent-warm-light shrink">
              <div className="font-ui-xl padding-y-2 text-semibold">
                Org : 18F Stratos rebuild
              </div>
            </div>
            <main className="padding-4 overflow-y-auto grow">{children}</main>
          </div>
        </div>
        <Footer />
        <Identifier />
      </body>
    </html>
  );
}
