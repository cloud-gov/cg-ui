import Link from 'next/link';
import Image from 'next/image';
import helpIcon from '@/../public/img/uswds/usa-icons/help.svg';

export function PreFooter() {
  return (
    <div className="grid-container margin-top-5">
      <div className="display-flex flex-align-center border-base-light border-top-1px padding-y-1">
        <Image unoptimized src={helpIcon} alt="" className="margin-right-1" />
        <p>
          Need help? Read{' '}
          <Link href="https://cloud.gov/docs/" className="usa-link text-bold">
            the documentation
          </Link>
          , or reach out to us at{' '}
          <Link
            href={process.env.NEXT_PUBLIC_CLOUD_SUPPORT_URL || '/'}
            className="usa-link text-bold"
          >
            support@cloud.gov
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
