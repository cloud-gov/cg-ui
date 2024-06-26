/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { UsersActionsOrgRoles } from '@/components/UsersActions/UsersActionsOrgRoles';

describe('UsersActionsOrgRoles', () => {
  // render
  render(<UsersActionsOrgRoles />);
  // query
  const checkBox = screen.getByRole('checkbox', { name: /Billing manager/ });
  const label = screen.getByTestId('label_billing_manager');

  it('checks a checkbox on click', () => {
    // expect
    expect(checkBox.checked).toEqual(false);
    // act
    fireEvent.click(checkBox);
    // expect
    expect(checkBox.checked).toEqual(true);
  });

  it('unchecks a checkbox on subsequent click', () => {
    // act
    fireEvent.click(checkBox);
    // expect
    expect(checkBox.checked).toEqual(false);
  });

  it('handles check events when a label is clicked', () => {
    // act
    fireEvent.click(label);
    // expect
    expect(checkBox.checked).toEqual(true);
  });
});
