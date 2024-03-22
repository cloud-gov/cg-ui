import Script from 'next/script';
import '../assets/stylesheets/styles.scss';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <Script src="/js/uswds/uswds-init.min.js" />
      <body>{children}</body>
      <Script src="/js/uswds/uswds.min.js" />
    </html>
  )
}
