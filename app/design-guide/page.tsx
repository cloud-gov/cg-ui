'use client';

import { USABanner } from '@/components/USABanner';
import { Button } from '@/components/Button';

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
      </div>
    </>
  );
}
