'use client';

import React, { useRef, useEffect } from 'react';
import Image from '@/components/Image';
import closeIcon from '@/../public/img/uswds/usa-icons/close.svg';

export function OverlayDrawer({
  ariaLabel = 'dialog', // should announce the purpose of the dialog when opening
  children,
  close, // function for dialog close button that should change the isOpen prop from the parent
  id = 'overlay-drawer', // helps distinguish which overlay drawer in case there are multiple on the page
  isOpen = false,
}: {
  ariaLabel?: string;
  children: React.ReactNode;
  close: Function;
  id?: string;
  isOpen: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (isOpen) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }

    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      // when escape key is used to close dialog, we need to update parent component state
      if (e.key === 'Escape') {
        close();
      }
    };
    // close when clicking outside dialog
    const clicked = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Clicking #dialog-body will not trigger this, only the id of the dialog itself.
      // #dialog-body must cover the full open dialog area for this to work.
      if (isOpen && target?.id?.match(id)) {
        close();
      }
    };
    const addListeners = () => {
      window.addEventListener('keydown', handleEscapeKeyPress);
      window.addEventListener('click', clicked);
    };
    const removeListeners = () => {
      window.removeEventListener('keydown', handleEscapeKeyPress);
      window.removeEventListener('click', clicked);
    };
    if (isOpen) {
      addListeners();
    }

    return () => {
      removeListeners();
    };
  }, [close, id, isOpen]);

  return (
    <dialog
      id={id}
      className="overlayDrawer height-full maxh-none tablet-lg:width-tablet-lg maxw-none border-0 padding-0"
      ref={dialogRef}
      aria-label={ariaLabel}
    >
      <div
        id="dialog-body"
        className="minh-full padding-y-10 tablet-lg:padding-y-15 padding-right-1 tablet-lg:padding-right-4 padding-left-3 tablet-lg:padding-left-10 bg-accent-warm-light border-accent-cool tablet-lg:border-accent-cool border-left-1 tablet-lg:border-left-105 border-right-0 border-top-0 border-bottom-0"
      >
        <button
          type="button"
          className="usa-button usa-modal__close position-fixed top-7 right-4"
          aria-label="Close this dialog"
          onClick={() => close()}
        >
          <Image
            unoptimized
            src={closeIcon}
            alt="Close this dialog"
            width="32"
            height="32"
          />
        </button>
        <div>{children}</div>
      </div>
    </dialog>
  );
}
