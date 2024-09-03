'use client';

import { Alert } from '@/components/uswds/Alert';
import { Button } from '@/components/uswds/Button';
import { Banner } from '@/components/uswds/Banner';
import Checkbox from '@/components/uswds/Checkbox';
import { useState } from 'react';

export default function DesignGuidePage() {
  const initialCheckboxes = {
    'checkbox-1': false,
    'checkbox-2': true,
    'checkbox-3': true,
    'checkbox-4': false,
  };
  const [checkboxValues, setCheckboxValues] = useState(
    initialCheckboxes as { [id: string]: boolean }
  );

  function setCheckboxState(value: string) {
    var newValues = { ...checkboxValues };
    var newValue = !newValues[value];
    newValues[value] = newValue;
    setCheckboxValues(newValues);
  }

  function handleChange(event: any) {
    const value = event.target.id;
    setCheckboxState(value);
  }

  return (
    <div className="overflow-y-scroll">
      <h1>Design components</h1>

      <h2>USA banner</h2>
      <Banner />

      <h2>Org selector</h2>
      <div className="display-block desktop:display-flex flex-justify-end width-full">
        <label className="usa-label" htmlFor="orgs">
          Current organization:
        </label>
        <nav className="orgs-selector width-mobile usa-list usa-list--unstyled border border-base-light shadow-2 font-sans-sm margin-2 padding-x-105">
          <header className="display-flex padding-y-105 border-bottom border-base-light">
            <strong className="orgs-selector__current text-bold text-gray-cool-80 text-ellipsis">
              sandbox-gsa-much-longer-name-goes-here-and-is-very-very-long
            </strong>
            <button>toggle</button>
          </header>
          <ul
            className="orgs-selector__list usa-list usa-list--unstyled maxh-card maxw-mobile overflow-x-hidden overflow-y-scroll"
            tabIndex={0}
          >
            <li className="padding-y-05">
              <a href="/" className="text-primary-dark text-ellipsis">
                another-organization-name-goes-here
              </a>
            </li>
            <li className="padding-y-05">
              <a href="/" className="text-primary-dark text-ellipsis">
                significantly-shorter-name
              </a>
            </li>
            <li className="padding-y-05">
              <a href="/" className="text-primary-dark text-ellipsis">
                another-organization-name-goes-here
              </a>
            </li>
            <li className="padding-y-05">
              <a href="/" className="text-primary-dark text-ellipsis">
                what-happens-when-an-organization-name-is-really-long
              </a>
            </li>
            <li className="padding-y-05">
              <a href="/" className="text-primary-dark text-ellipsis">
                significantly-shorter-name
              </a>
            </li>
            <li className="padding-y-05">
              <a href="/" className="text-primary-dark text-ellipsis">
                another-shorter-name
              </a>
            </li>
            <li className="padding-y-05">
              <a href="/" className="text-primary-dark text-ellipsis">
                hey-that-is-a-really-long-name-for-an-organization
              </a>
            </li>
          </ul>
          <footer className="text-right text-bold font-sans-2xs text-primary-dark padding-y-105 border-top border-base-light">
            <a href="/" className='text-primary-dark sr-ignore'>View all organizations</a>
            <span className='padding-left-05' aria-hidden="true">&raquo;</span>
          </footer>
        </nav>
      </div>

      <h2>Headers in prose:</h2>

      <div className="usa-prose">
        <h1>This is a header 1</h1>
        <h2>This is a header 2</h2>
        <h3>This is a header 3</h3>
        <h4>This is a header 3</h4>
      </div>

      <div className="grid-container">
        <h2>Button time</h2>
        <div className="grid-row">
          <Button>Generic button</Button>
          <Button id="btn-identified">Button with id</Button>
          <Button onClick={() => alert('You clicked me!')}>
            Button with onClick
          </Button>
          <Button unstyled>Unstyled</Button>
        </div>
        <h3>Default</h3>
        <div className="grid-row">
          <Button>Default</Button>
          <Button className="usa-button--hover">Force hover</Button>
          <Button className="usa-button--active">Force active</Button>
          <Button className="usa-focus">Force focus</Button>
          <Button disabled>Disabled</Button>
          <Button aria-disabled>Aria disabled</Button>
        </div>
        <h3>So colorful</h3>
        <div className="grid-row">
          <Button secondary>Secondary</Button>
          <Button accentStyle="cool">Accent cool</Button>
          <Button accentStyle="warm">Accent warm</Button>
          <Button base>Base</Button>
          <Button outline>Outline</Button>
          <Button secondary outline inverse>
            Inverted outline
          </Button>
        </div>
        <h3>Big button</h3>
        <div className="grid-row">
          <Button size="big">Big</Button>
        </div>

        <h2>Alerts!</h2>
        <div className="grid-row grid-gap">
          <div className="grid-col-6">
            <h3>Full sized with icons and default h4 heading size</h3>
            <Alert type="success" heading="Success" className="display-block">
              Good job
            </Alert>
            <Alert type="info" heading="Info" className="display-block">
              So you know
            </Alert>
            <Alert type="warning" heading="Warning" className="display-block">
              Watch out
            </Alert>
            <Alert type="error" heading="Error" className="display-block">
              Something is wrong
            </Alert>
            <Alert
              type="emergency"
              heading="Emergency"
              className="display-block"
            >
              Fear! Fire! Foes!
            </Alert>

            <h3>Example with validation</h3>
            <Alert
              type="warning"
              heading="Validation"
              validation
              className="display-block"
            >
              Validations do not use usa-alert__text p tag
            </Alert>
          </div>
          <div className="grid-col-6">
            <h3>Slim with icons and no headings</h3>
            <Alert type="success" slim className="display-block">
              Success
            </Alert>
            <Alert type="info" slim className="display-block">
              Info
            </Alert>
            <Alert type="warning" slim className="display-block">
              Warning
            </Alert>
            <Alert type="error" slim className="display-block">
              Error
            </Alert>
            <Alert type="emergency" slim className="display-block">
              Emergency
            </Alert>

            <h3>Slim with no icons and no headings</h3>
            <Alert type="success" slim noIcon className="display-block">
              Success
            </Alert>
            <Alert type="info" slim noIcon className="display-block">
              Info
            </Alert>
            <Alert type="warning" slim noIcon className="display-block">
              Warning
            </Alert>
            <Alert type="error" slim noIcon className="display-block">
              Error
            </Alert>
            <Alert type="emergency" slim noIcon className="display-block">
              Emergency
            </Alert>
          </div>
        </div>

        <h2>Checkboxes</h2>
        <div className="grid-row grid-gap">
          <div className="grid-col-6">
            <Checkbox
              id="checkbox-1"
              name="checkboxes"
              label="Simple checkbox"
              checked={checkboxValues['checkbox-1']}
              onChange={handleChange}
            />
            <Checkbox
              id="checkbox-2"
              name="checkboxes"
              label="With label description"
              labelDescription="Optional description"
              checked={checkboxValues['checkbox-2']}
              onChange={handleChange}
            />
            <Checkbox
              id="checkbox-3"
              name="checkboxes"
              label="Checked and with value"
              value="value-sent-by-form"
              checked={checkboxValues['checkbox-3']}
              onChange={handleChange}
            />
          </div>
          <div className="grid-col-6">
            <Checkbox
              id="checkbox-4"
              name="checkboxes"
              label="Tiled"
              tile
              labelDescription="You can separate checkboxes out and even pass in other React nodes"
              checked={checkboxValues['checkbox-4']}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="margin-bottom-5">
          {/* placeholder to help with the page scroll */}
        </div>
      </div>
    </div>
  );
}
