import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import closeIcon from '@/../public/img/uswds/usa-icons/close.svg';

export const modalHeadingId = (item: { guid: string }) =>
  `modal-heading-${item.guid}`;

export function Modal({
  children,
  close,
  modalId, // ID responsible for opening/closing the modal from its parent component
  headingId, // should match the id attribute on element that describes modal action, likely .usa-modal__heading
  descriptionId, // should match ID of a paragraph or a brief piece of content within the modal
}: {
  children: React.ReactNode;
  close: Function;
  modalId: string;
  headingId: string;
  descriptionId?: string;
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!modalRef) return;
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const focusableElements = (modalElement as HTMLElement).querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    // Trap tab focus within modal
    const handleTabKeyPress = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        (lastElement as HTMLElement).focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        (firstElement as HTMLElement).focus();
      }
    };
    // close modal when Escape key is pressed
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', handleTabKeyPress);
    window.addEventListener('keydown', handleEscapeKeyPress);

    return () => {
      // remove event listeners when component is unmounted
      window.removeEventListener('keydown', handleTabKeyPress);
      window.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, [close, modalRef]);

  return (
    <div className="usa-modal-wrapper is-visible" ref={modalRef}>
      <div className="usa-modal-overlay">
        <div
          className="usa-modal"
          id={modalId}
          aria-labelledby={headingId}
          aria-describedby={descriptionId || ''}
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
