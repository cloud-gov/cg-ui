import React from 'react';
import Image from 'next/image';
import closeIcon from '@/public/img/uswds/usa-icons/close.svg';

export function Modal({
  children,
  close,
  id,
}: {
  children: React.ReactNode;
  close: Function;
  id: string;
}) {
  return (
    <div className="usa-modal-wrapper is-visible">
      <div className="usa-modal-overlay">
        <div
          className="usa-modal"
          id={`modal-${id}`}
          aria-labelledby={`modal-${id}-heading`}
          aria-describedby={`modal-${id}-description`}
        >
          <div className="usa-modal__content">
            <div className="usa-modal__main">{children}</div>
            <button
              type="button"
              className="usa-button usa-modal__close"
              aria-label="Close this window"
              data-close-modal
              onClick={() => close('')}
            >
              <Image
                unoptimized
                src={closeIcon}
                alt="close the modal"
                width="32"
                height="32"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
