import { Banner } from '@/components/uswds/Banner';
import { Identifier } from '@/components/uswds/Identifier';
import { Footer } from '@/components/uswds/Footer';

import '@/assets/stylesheets/styles.scss';

export const metadata = {
  title: 'cloud.gov Dashboard',
  description: 'Manage cloud.gov organizations, spaces, services, and apps.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-accent-warm-light">
        <a className="usa-skipnav" href="#main-content">
          Skip to main content
        </a>
        <Banner />
        <div className="minh-viewport tablet:margin-x-4 margin-x-1">
          <main id="main-content">{children}</main>
        </div>
        <Footer />
        <Identifier />
      </body>
    </html>
  );
}
