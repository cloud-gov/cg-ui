import { Header } from '@/components/Header';
import { Identifier } from '@/components/Identifier';
import { USABanner } from '@/components/USABanner';

import '../assets/stylesheets/styles.scss';

export const metadata = {
  title: 'cloud.gov Dashboard',
  description: 'Manage cloud.gov organizations, spaces, services, and apps.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <USABanner />
        <Header />
        <main className="padding-y-4">
          <div className="grid-container">{children}</div>
        </main>
        <Identifier />
      </body>
    </html>
  );
}
