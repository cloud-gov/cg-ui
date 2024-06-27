/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '@/components/uswds/Checkbox';

describe('<Checkbox />', () => {
  it('renders a default unselected checkbox', () => {
    render(<Checkbox name="checkbox" label="Simple checkbox" />);
    const cboxdiv = screen.getByTestId('checkbox');
    const cbox = cboxdiv.querySelector('input');

    expect(cboxdiv).toHaveClass('usa-checkbox');
    expect(cboxdiv.querySelector('label')).toHaveClass('usa-checkbox__label');
    expect(cbox).toHaveClass('usa-checkbox__input');
    expect(cbox).not.toBeChecked();
    const content = screen.queryByText('Simple checkbox');
    expect(content).toBeInTheDocument();
  });

  it('renders a tiled checkbox with a label description', () => {
    render(
      <Checkbox
        name="checkbox"
        label="test"
        labelDescription="Extra description"
        tile
      />
    );
    const cboxdiv = screen.getByTestId('checkbox');

    expect(cboxdiv.querySelector('input')).toHaveClass(
      'usa-checkbox__input--tile'
    );
    expect(cboxdiv.querySelector('label>span')).toHaveClass(
      'usa-checkbox__label-description'
    );
    const content = screen.queryByText('Extra description');
    expect(content).toBeInTheDocument();
  });

  it('renders a checkbox which is already checked', () => {
    render(<Checkbox name="checkbox" label="Checked" checked />);
    const cboxdiv = screen.getByTestId('checkbox');
    expect(cboxdiv.querySelector('input')).toBeChecked();
  });

  it('when the checkbox is clicked, it becomes checked', () => {
    render(<Checkbox name="checkbox" label="test" />);
    const cbox = screen.getByTestId('checkbox').querySelector('input');
    expect(cbox).not.toBeChecked();
    fireEvent.click(cbox);
    expect(cbox).toBeChecked();
  });

  it('when the label is clicked, the checkbox with matching id becomes checked', () => {
    render(<Checkbox id="testId" label="test" />);
    const cboxdiv = screen.getByTestId('checkbox');
    const cbox = cboxdiv.querySelector('input');
    const label = cboxdiv.querySelector('label');

    expect(cbox).not.toBeChecked();
    fireEvent.click(label);
    expect(cbox).toBeChecked();
  });
});
