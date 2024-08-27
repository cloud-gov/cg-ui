/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { UserAccountExpires } from '@/components/UserAccount/UserAccountExpires';

describe('<UserAccountExpires />', () => {
  describe('when no account info', () => {
    it('shows n/a text', () => {
      // render
      render(<UserAccountExpires userLogonInfo={undefined} />);
      // query
      const text = screen.queryByText(/Not available/);
      // assert
      expect(text).toBeInTheDocument();
    });
  });

  describe('when account is active', () => {
    it('shows number of days to expiration', () => {
      // setup
      var now = new Date();
      var ts = new Date(now.setDate(now.getDate() - 2)); // 2 days ago
      const info = {
        userName: 'foo',
        active: true,
        lastLogonTime: ts,
        lastLogonTimePretty: 'todo if we start using this field',
      };
      // render
      render(<UserAccountExpires userLogonInfo={info} />);
      // query
      const text = screen.queryByText('88 days');
      // assert
      expect(text).toBeInTheDocument();
    });
  });

  describe('when account is expired', () => {
    it('shows expired text', () => {
      // setup
      const info = {
        userName: 'foo',
        active: false,
        lastLogonTime: 1706652770377,
        lastLogonTimePretty: 'Tues, Jan 30 2024 22:12 GMT',
      };
      // render
      render(<UserAccountExpires userLogonInfo={info} />);
      // query
      const text = screen.queryByText(/Expired/);
      // assert
      expect(text).toBeInTheDocument();
    });
  });
});
