'use client';

import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { USABanner } from '@/components/USABanner';

export default function DesignGuidePage() {
  return (
    <>
      <USABanner />
      <h1>Design components</h1>

      <div className="grid-container">
        <div className="grid-row">hello world</div>

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
      </div>
    </>
  );
}
