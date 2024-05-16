/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import { Button } from '../../components/Button';

function selectButton(rendered) {
  return rendered.container.querySelector('#test');
}

describe('<Button />', () => {
  it('renders a default USWDS styled button', () => {
    const res = render(<Button id="test">Button</Button>);

    const button = selectButton(res);
    expect(button).toHaveClass('usa-button');
  });

  it('fires events correctly', () => {
    /* global jest */
    /* eslint no-undef: "off" */
    const doSomething = jest.fn();
    /* eslint no-undef: "error" */
    const res = render(<Button id="test" onClick={doSomething}></Button>);

    const button = selectButton(res);
    fireEvent.click(button);
    expect(doSomething).toHaveBeenCalledTimes(1);
  });

  it('adds custom classes and attributes', () => {
    const res = render(
      <Button
        id="test"
        data-something="hello"
        className="coolClass1 coolClass2"
      ></Button>
    );

    const button = selectButton(res);
    expect(button).toHaveClass('usa-button');
    expect(button).toHaveClass('coolClass1');
    expect(button).toHaveClass('coolClass2');
    expect(button.getAttribute('data-something')).toEqual('hello');
  });

  describe('with USWDS options', () => {
    it('displays as secondary button', () => {
      const res = render(<Button id="test" secondary></Button>);

      const button = selectButton(res);
      expect(button).toHaveClass('usa-button--secondary');
    });
    it('displays as accent cool button', () => {
      const res = render(<Button id="test" accentStyle="cool"></Button>);

      const button = selectButton(res);
      expect(button).toHaveClass('usa-button--accent-cool');
    });
    it('displays as accent warm button', () => {
      const res = render(<Button id="test" accentStyle="warm"></Button>);

      const button = selectButton(res);
      expect(button).toHaveClass('usa-button--accent-warm');
    });
    it('displays as base button', () => {
      const res = render(<Button id="test" base></Button>);

      const button = selectButton(res);
      expect(button).toHaveClass('usa-button--base');
    });
    it('displays as outlined button', () => {
      const res = render(<Button id="test" outline></Button>);

      const button = selectButton(res);
      expect(button).toHaveClass('usa-button--outline');
    });
    it('displays as inverse button', () => {
      const res = render(<Button id="test" inverse></Button>);

      const button = selectButton(res);
      expect(button).toHaveClass('usa-button--inverse');
    });
    it('displays as big button', () => {
      const res = render(<Button id="test" size="big"></Button>);

      const button = selectButton(res);
      expect(button).toHaveClass('usa-button--big');
    });
  });
});
