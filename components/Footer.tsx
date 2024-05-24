import Image from 'next/image';

import cloudGovIcon from '@/public/img/cloud-gov-logo.svg';

export function Footer() {
  return (
    <footer className="usa-footer usa-footer--slim">
      <div className="usa-footer__primary-section bg-accent-warm padding-y-4">
        <div className="usa-footer__primary-container grid-row flex-justify">
          <Image
            className="width-card-lg"
            priority
            src={cloudGovIcon}
            alt="cloud.gov"
          />
          <div className="usa-footer__contact-info">
            <a href="mailto:support@cloud.gov">support@cloud.gov</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
