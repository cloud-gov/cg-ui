/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Alert } from '@/components/uswds/Alert';

function selectAlert(rendered) {
  return rendered.container.querySelector('#test');
}

describe('<Alert />', () => {
  it('renders a default USWDS styled alert', () => {
    const res = render(<Alert id="test"></Alert>);

    const alert = selectAlert(res);
    expect(alert).toBeInTheDocument();
  });

  const types = ['emergency', 'error', 'info', 'success', 'warning'];

  for (const type of types) {
    it(`renders an alert of type ${type}`, () => {
      const res = render(<Alert id="test" type={type}></Alert>);

      const alert = selectAlert(res);
      expect(alert).toHaveClass(`usa-alert--${type}`);
    });
  }

  it('renders an h4 heading by default', () => {
    render(<Alert id="test" heading="Testing"></Alert>);

    const heading = screen.getByRole('heading', { level: 4 });
    expect(heading).toBeInTheDocument();
  });

  it('renders an h3 if specified', () => {
    render(<Alert id="test" heading="Testing" headingLevel="h3"></Alert>);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
  });

  describe('with children', () => {
    it('renders normally within a p tag', () => {
      const res = render(<Alert id="test">Test contents</Alert>);

      const alert = selectAlert(res);
      expect(alert).toHaveTextContent('Test contents');
      expect(alert).toContainHTML('p');
    });

    it('renders validation without a p tag', () => {
      const res = render(
        <Alert id="test" validation>
          Test contents
        </Alert>
      );

      const alert = selectAlert(res);
      expect(alert).toHaveTextContent('Test contents');
      expect(alert).not.toContainHTML('p');
    });
  });

  it('can render a slim alert without an icon', () => {
    const res = render(<Alert id="test" slim noIcon></Alert>);

    const alert = selectAlert(res);
    expect(alert).toHaveClass('usa-alert--slim');
    expect(alert).toHaveClass('usa-alert--no-icon');
  });
});
