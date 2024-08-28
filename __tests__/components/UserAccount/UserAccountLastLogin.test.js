/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { UserAccountLastLogin } from '@/components/UserAccount/UserAccountLastLogin';

describe('<UserAccountLastLogin />', () => {
  describe('when no account info', () => {
    it('shows n/a text', () => {
      // render
      render(
        <UserAccountLastLogin lastLogonTime={undefined} hrefInvite="foo" />
      );
      // query
      const text = screen.queryByText(/Not available/);
      // assert
      expect(text).toBeInTheDocument();
    });
  });

  describe('when never logged in', () => {
    it('shows never logged in text', () => {
      // render
      render(<UserAccountLastLogin lastLogonTime={null} hrefInvite="foo" />);
      // query
      const text = screen.queryByText(/None/);
      // assert
      expect(text).toBeInTheDocument();
    });
  });

  describe('when user has logged in', () => {
    it('shows a timestamp', () => {
      // render
      render(
        <UserAccountLastLogin lastLogonTime={1706652770377} hrefInvite="foo" />
      ); // Tues, Jan 30 2024
      // query
      const text = screen.getByText(/Jan 30, 2024/);
      // assert
      expect(text).toBeInTheDocument();
    });
  });
});
