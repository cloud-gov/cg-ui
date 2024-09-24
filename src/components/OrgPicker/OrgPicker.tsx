/*
 * While visually similar to the USWDS Combo box component, this expandable element presents a scrollable list of links. The link at the bottom of the menu directs the user to a page listing all the organizations they can access.
 */
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import collapseIcon from '@/../public/img/uswds/usa-icons/expand_more.svg';
import { OrgPickerList } from './OrgPickerList';
import { OrgPickerFooter } from './OrgPickerFooter';

export function OrgPicker({ single }: { single: Boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const orgsSelectorRef = useRef<HTMLElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Toggle the org picker
  const togglePicker = () => setIsOpen(!isOpen);

  // Return focus to toggle button
  const returnFocus = () => toggleButtonRef.current?.focus();

  // Close the picker when clicking outside
  const handleOutsideClick = (e: MouseEvent) => {
    if (
      orgsSelectorRef.current &&
      !orgsSelectorRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // Close the picker when pressing the ESC key
  const handleEscapeKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      returnFocus();
    }
  };

  // Focus back on the toggle button after tabbing through list
  const handleTabKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Tab' && isOpen && orgsSelectorRef.current) {
      const lastElement = orgsSelectorRef.current.querySelector('footer a');

      if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        setIsOpen(false);
        returnFocus();
      }
    }
  };

  // Add event listners to the org picker
  const addListeners = () => {
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKeyPress);
    document.addEventListener('keydown', handleTabKeyPress);
  };

  // Remove event listners
  const removeListeners = () => {
    // Remove listeners if org picker is not open
    document.removeEventListener('mousedown', handleOutsideClick);
    document.removeEventListener('keydown', handleEscapeKeyPress);
    document.removeEventListener('keydown', handleTabKeyPress);
  };

  useEffect(() => {
    if (isOpen) {
      addListeners();
    } else {
      // Cleanup listeners if org picker is not open
      removeListeners();
    }

    // Cleanup listeners when the component unmounts
    return () => {
      removeListeners();
    };
  }, [isOpen]);

  return !single ? (
    <div className="display-block desktop:display-flex desktop:position-absolute">
      <span className="usa-label font-body-2xs padding-right-105">
        Current organization:
      </span>
      <nav
        id="orgs-selector"
        className="orgs-selector width-mobile bg-white border border-base-light font-body-2xs padding-x-105 margin-y-1 desktop:margin-y-105"
        aria-expanded={isOpen}
        ref={orgsSelectorRef}
      >
        <header className="orgs-selector__header display-flex desktop:padding-y-1 flex-align-center">
          <strong className="orgs-selector__current text-bold text-base-darker text-ellipsis margin-right-1 padding-right-1 border-right border-base-light">
            sandbox-gsa-much-longer-name-goes-here-and-is-very-very-long
          </strong>
          <button
            className="usa-button usa-button--unstyled width-5 flex-justify-center"
            aria-expanded={isOpen}
            aria-controls="orgs-selector"
            onClick={togglePicker}
            ref={toggleButtonRef}
          >
            <Image
              unoptimized
              src={collapseIcon}
              alt={isOpen ? 'close list' : 'open list'}
              className="usa-button-expand"
              width={24}
              height={24}
            />
          </button>
        </header>
        {isOpen && (
          <>
            <OrgPickerList />
            <OrgPickerFooter />
          </>
        )}
      </nav>
    </div>
  ) : (
    <div className="display-block width-card-lg desktop:display-flex desktop:width-mobile-lg">
      <span className="usa-label font-body-2xs padding-right-105">
        Current organization:
      </span>
      <strong className="text-bold text-base-darker margin-top-3 maxw-mobile">
        sandbox-gsa-much-longer-name-goes-here-and-is-very-very-long
      </strong>
    </div>
  );
}
