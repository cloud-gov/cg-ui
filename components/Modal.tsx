import React from 'react';

export function Modal({
  children,
  close,
}: {
  children: React.ReactNode;
  close: Function;
}) {
  return (
    <div className="usa-modal-wrapper is-visible">
      <div className="usa-modal-overlay">
        <div
          className="usa-modal"
          id="example-modal-1"
          aria-labelledby="modal-1-heading"
          aria-describedby="modal-1-description"
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
              close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
