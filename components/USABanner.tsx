'use client';

import Image from 'next/image';
import { useState } from 'react';

function BannerContent() {
  return (
    <div
      className="usa-banner__content usa-accordion__content"
      id="gov-banner-default"
    >
      <div className="grid-row grid-gap-lg">
        <div className="usa-banner__guidance tablet:grid-col-6">
          <Image
            className="usa-banner__icon usa-media-block__img"
            src="/img/uswds/icon-dot-gov.svg"
            role="img"
            alt=""
            aria-hidden="true"
            width={40}
            height={40}
          />
          <div className="usa-media-block__body">
            <p>
              <strong>Official websites use .gov</strong>
              <br />A <strong>.gov</strong> website belongs to an official
              government organization in the United States.
            </p>
          </div>
        </div>
        <div className="usa-banner__guidance tablet:grid-col-6">
          <Image
            className="usa-banner__icon usa-media-block__img"
            src="/img/uswds/icon-https.svg"
            role="img"
            alt=""
            aria-hidden="true"
            width={40}
            height={40}
          />
          <div className="usa-media-block__body">
            <p>
              <strong>Secure .gov websites use HTTPS</strong>
              <br />A <strong>lock</strong> (&nbsp;
              <span className="icon-lock">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="52"
                  height="64"
                  viewBox="0 0 52 64"
                  className="usa-banner__lock-image"
                  role="img"
                  aria-labelledby="banner-lock-description-default"
                  focusable="false"
                >
                  <title id="banner-lock-title-default">Lock</title>
                  <desc id="banner-lock-description-default">
                    Locked padlock icon
                  </desc>
                  <path
                    fill="#000000"
                    fillRule="evenodd"
                    d="M26 0c10.493 0 19 8.507 19 19v9h3a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V32a4 4 0 0 1 4-4h3v-9C7 8.507 15.507 0 26 0zm0 8c-5.979 0-10.843 4.77-10.996 10.712L15 19v9h22v-9c0-6.075-4.925-11-11-11z"
                  />
                </svg>{' '}
              </span>
              ) or <strong>https://</strong> means you’ve safely connected to
              the .gov website. Share sensitive information only on official,
              secure websites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function USABanner() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleBanner = () => setIsOpen(!isOpen);

  return (
    <>
      <section
        className="usa-banner"
        aria-label="Official website of the United States government"
      >
        <div className="usa-accordion">
          <header className="usa-banner__header">
            <div className="usa-banner__inner">
              <div className="grid-col-auto">
                <Image
                  aria-hidden="true"
                  className="usa-banner__header-flag"
                  src="/img/uswds/us_flag_small.png"
                  alt=""
                  width={16}
                  height={11}
                />
              </div>
              <div
                className="grid-col-fill tablet:grid-col-auto"
                aria-hidden="true"
              >
                <p className="usa-banner__header-text">
                  An official website of the United States government
                </p>
                <p className="usa-banner__header-action">Here’s how you know</p>
              </div>
              <button
                type="button"
                className="usa-accordion__button usa-banner__button"
                aria-expanded={isOpen}
                aria-controls="gov-banner-default"
                onClick={toggleBanner}
              >
                <span className="usa-banner__button-text">
                  Here’s how you know
                </span>
              </button>
            </div>
          </header>
          {isOpen && <BannerContent />}
        </div>
      </section>
    </>
  );
}
