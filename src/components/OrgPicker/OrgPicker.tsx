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
  const [toggle, setToggle] = useState(true);

  return !single ? (
    <div className="display-block desktop:display-flex">
      <span className="usa-label font-body-2xs padding-right-105">
        Current organization:
      </span>
      <nav className="orgs-selector width-mobile bg-white border border-base-light font-body-2xs padding-x-105 margin-y-105">
        <header className="display-flex padding-bottom-105 padding-top-2">
          <strong className="orgs-selector__current text-bold text-base-darker text-ellipsis margin-right-1 padding-right-1 border-right border-base-light">
            sandbox-gsa-much-longer-name-goes-here-and-is-very-very-long
          </strong>
          <Button
            unstyled
            className="width-6"
            onClick={() => setToggle(!toggle)}
          >
            <Image
              unoptimized
              src={toggle ? expandIcon : collapseIcon}
              alt="collapse"
              width={24}
              height={24}
            />
          </Button>
        </header>
        {toggle && (
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
