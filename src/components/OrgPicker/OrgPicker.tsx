/*
 * While visually similar to the USWDS Combo box component, this expandable element presents a scrollable list of links. The link at the bottom of the menu directs the user to a page listing all the organizations they can access.
 */
import React from 'react';
// import { OrgObj } from '@/api/cf/cloudfoundry-types';
import { Button } from '@/components/uswds/Button';
import { useState } from 'react';
import Image from 'next/image';
import expandIcon from '@/../public/img/uswds/usa-icons/expand_less.svg';
import collapseIcon from '@/../public/img/uswds/usa-icons/expand_more.svg';
import { OrgPickerList } from './OrgPickerList';
import { OrgPickerFooter } from './OrgPickerFooter';

export function OrgPicker({ single }: { single: Boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const togglePicker = () => setIsOpen(!isOpen);

  return !single ? (
    <div className="display-block desktop:display-flex desktop:position-absolute">
      <span className="usa-label font-body-2xs padding-right-105">
        Current organization:
      </span>
      <nav id="orgs-selector" className="orgs-selector width-mobile bg-white border border-base-light font-body-2xs padding-x-105 margin-y-105" aria-expanded={isOpen}>
        <header className="orgs-selector__header display-flex desktop:padding-y-1 flex-align-center">
          <strong className="orgs-selector__current text-bold text-base-darker text-ellipsis margin-right-1 padding-right-1 border-right border-base-light">
            sandbox-gsa-much-longer-name-goes-here-and-is-very-very-long
          </strong>
          <Button
            unstyled
            className="width-5 flex-justify-center"
            aria-expanded={isOpen}
            aria-controls="orgs-selector"
            onClick={togglePicker}
          >
            <Image
              unoptimized
              src={collapseIcon}
              alt={isOpen ? "close list" : "open list"}
              className="usa-button-expand"
              width={24}
              height={24}
            />
          </Button>
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
