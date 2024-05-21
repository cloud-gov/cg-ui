import { Header } from '@/components/Header';
import { Identifier } from '@/components/Identifier';
import { Banner } from '@/components/uswds/Banner';

import '../assets/stylesheets/styles.scss';

export const metadata = {
  title: 'cloud.gov Dashboard',
  description: 'Manage cloud.gov organizations, spaces, services, and apps.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Banner />
        <Header />
        <main className="padding-y-4">
          <div className="grid-container">{children}</div>
        </main>
        <Identifier />
      </body>
    </html>
  );
}
