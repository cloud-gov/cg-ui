/**
 * @jest-environment jsdom
 */
import { jest, describe, expect, it } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '@/components/uswds/Checkbox';

describe('<Checkbox />', () => {
  it('renders a default unselected checkbox', () => {
    render(
      <Checkbox name="checkbox" label="Simple checkbox" onChange={jest.fn()} />
    );
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
        onChange={jest.fn()}
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
    render(
      <Checkbox
        name="checkbox"
        label="Checked"
        checked={true}
        onChange={jest.fn()}
      />
    );
    const cboxdiv = screen.getByTestId('checkbox');
    expect(cboxdiv.querySelector('input')).toBeChecked();
  });

  it('when the checkbox is clicked, the onChange event is fired', () => {
    const mockFn = jest.fn();
    render(
      <Checkbox
        name="checkbox"
        label="test"
        checked={false}
        onChange={mockFn}
      />
    );
    const cbox = screen.getByTestId('checkbox').querySelector('input');
    fireEvent.click(cbox);
    expect(mockFn).toHaveBeenCalled();
  });

  it('when the label is clicked, the onChange event is fired', () => {
    const mockFn = jest.fn();
    render(
      <Checkbox id="testId" label="test" checked={false} onChange={mockFn} />
    );
    const cboxdiv = screen.getByTestId('checkbox');
    const label = cboxdiv.querySelector('label');

    fireEvent.click(label);
    expect(mockFn).toHaveBeenCalled();
  });
});
