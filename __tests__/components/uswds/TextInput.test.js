/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { TextInput } from '@/components/uswds/TextInput';

describe('<TextInput />', () => {
  it('has a name', () => {
    render(<TextInput id="foo-id" />);
    const input = screen.getByRole('textbox');
    expect(input.name).toEqual('foo-id');
  });
  it('has type="text" by default', () => {
    render(<TextInput id="foo-id" />);
    /* "textbox" is the default aria-label for input type="text" */
    const input = screen.getByRole('textbox');
    expect(input.type).toEqual('text');
  });
  it('has another type when another type is a prop', () => {
    render(<TextInput id="foo-id" type="email" />);
    const input = screen.getByRole('textbox');
    expect(input.type).toEqual('email');
  });
  it('shows a related label when label text is a prop', () => {
    render(<TextInput id="foo-id" labelText="Foo Label" />);
    const input = screen.getByLabelText('Foo Label');
    expect(input).toBeInTheDocument();
  });
  it('adds custom CSS classes to default classes when passed as a prop', () => {
    render(<TextInput id="foo-id" className="foo-class" />);
    const input = screen.getByRole('textbox');
    expect(input.classList.contains('usa-input')).toBe(true);
    expect(input.classList.contains('foo-class')).toBe(true);
  });
  it('shows an asterisk when required', () => {
    render(<TextInput id="foo-id" labelText="Foo Label" required />);
    const asterisk = screen.getByLabelText(/\*/);
    expect(asterisk).toBeInTheDocument();
  });
  it('hides the asterisk when not required', () => {
    render(<TextInput id="foo-id" labelText="Foo Label" />);
    const asterisk = screen.queryByLabelText(/\*/);
    expect(asterisk).not.toBeInTheDocument();
  });
});
