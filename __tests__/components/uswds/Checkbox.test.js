/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Checkbox } from '@/components/uswds/Checkbox';

describe('<Checkbox />', () => {
  it('renders a default checkbox', () => {
    render(<Checkbox name="checkbox" label="Simple checkbox" />);
    const cbox = screen.getByTestId('checkbox');

    expect(cbox).toHaveClass('usa-checkbox');
    expect(cbox.querySelector('input')).toHaveClass('usa-checkbox__input');
    expect(cbox.querySelector('label')).toHaveClass('usa-checkbox__label');

    const content = screen.queryByText('Simple checkbox');
    expect(content).toBeInTheDocument();
  });

  it('renders a tiled checkbox with a label description', () => {
    render(
      <Checkbox
        name="checkbox"
        label="Simple checkbox"
        labelDescription="Extra description"
        tile
      />
    );
    const cbox = screen.getByTestId('checkbox');

    expect(cbox.querySelector('input')).toHaveClass(
      'usa-checkbox__input--tile'
    );
    expect(cbox.querySelector('label>span')).toHaveClass(
      'usa-checkbox__label-description'
    );

    const content = screen.queryByText('Extra description');
    expect(content).toBeInTheDocument();
  });

  it('renders a checkbox which is already checked', () => {
    render(<Checkbox name="checkbox" label="Checked" defaultChecked={true} />);
    const cbox = screen.getByTestId('checkbox');

    expect(cbox.querySelector('input')).toBeChecked();
  });
});
