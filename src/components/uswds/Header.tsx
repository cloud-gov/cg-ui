'use client';

import Image from 'next/image';
import { useState } from 'react';

export function Header() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleMenu = () => setIsVisible(!isVisible);

  return (
    <>
      <div className={`usa-overlay ${isVisible ? 'is-visible' : ''}`}></div>
      <header className="usa-header usa-header--basic">
        <div className="usa-nav-container">
          <div className="usa-navbar border-0 flex-justify-end">
            <button type="button" className="usa-menu-btn" onClick={toggleMenu}>
              Menu
            </button>
          </div>
          <nav
            aria-label="Primary navigation"
            className={`usa-nav border-bottom border-base-light ${isVisible ? 'is-visible' : ''}`}
          >
            <button
              type="button"
              className="usa-nav__close"
              onClick={toggleMenu}
            >
              <Image
                src="/img/uswds/usa-icons/close.svg"
                role="img"
                alt="Close"
                height={24}
                width={24}
              />
            </button>
            <ul className="usa-nav__primary usa-accordion">
              <li className="usa-nav__primary-item">
                <a
                  href="javascript:void(0);"
                  className="usa-nav-link usa-current"
                >
                  <span>Product Section</span>
                </a>
              </li>
              <li className="usa-nav__primary-item">
                <a href="javascript:void(0);" className="usa-nav-link">
                  <span>Product Section</span>
                </a>
              </li>
              <li className="usa-nav__primary-item">
                <a href="javascript:void(0);" className="usa-nav-link">
                  <span>Product Section</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
