'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import closeIcon from '@/../public/img/uswds/usa-icons/close.svg';

export function OverlayDrawer({
  children,
  close, // function for dialog close button that should change the isOpen prop from the parent
  id,
  isOpen = false,
}: {
  children: React.ReactNode;
  close: Function;
  id: string;
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
    window.addEventListener('keydown', handleEscapeKeyPress);

    return () => {
      window.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, [close, isOpen]);

  return (
    <dialog
      id={id}
      className="overlayDrawer height-full maxh-none tablet-lg:width-tablet-lg maxw-none padding-y-10 tablet-lg:padding-y-15 padding-right-1 tablet-lg:padding-right-4 padding-left-3 tablet-lg:padding-left-10 bg-accent-warm-light border-accent-cool tablet-lg:border-accent-cool border-left-1 tablet-lg:border-left-105 border-right-0 border-top-0 border-bottom-0"
      ref={dialogRef}
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
          alt="close the dialog"
          width="32"
          height="32"
        />
      </button>
      <div style={{ overscrollBehavior: 'contain' }}>{children}</div>
    </dialog>
  );
}
