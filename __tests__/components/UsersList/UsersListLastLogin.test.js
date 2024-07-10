/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { UsersListLastLogin } from '@/components/UsersList/UsersListLastLogin';

describe('UsersListLastLogin', () => {
  describe('when timestamp is null', () => {
    it('shows never logged in text', () => {
      const info = {
        userName: null,
        active: false,
        lastLogonTime: null,
        lastLogonTimePretty: null,
      };
      render(<UsersListLastLogin userLogonInfo={info} />);

      const content = screen.queryByText('Never logged in');
      expect(content).toBeInTheDocument();
    });
  });

  describe('when timestamp is expired', () => {
    it('shows expired text', () => {
      const info = {
        userName: 'foo',
        active: false,
        lastLogonTime: 1706652770377,
        lastLogonTimePretty: 'Tues, Jan 30 2024 22:12 GMT',
      };
      render(<UsersListLastLogin userLogonInfo={info} />);

      const content = screen.queryByText('Login expired');
      expect(content).toBeInTheDocument();
    });
  });

  describe('when timestamp is not expired', () => {
    it('shows formatted date and time with login expiration text', () => {
      // setup
      var now = new Date();
      var ts = new Date(now.setDate(now.getDate() - 2)); // 2 days ago
      const info = {
        userName: 'foo',
        active: true,
        lastLogonTime: ts,
        lastLogonTimePretty: 'todo if we start using this field',
      };
      //act
      render(<UsersListLastLogin userLogonInfo={info} />);
      // query
      const time = screen.queryByText(/\d{2}:\d{2} [A|P]M/);
      const date = screen.queryByText(/[a-zA-Z] \d+, \d{4}/);
      const expiryText = screen.queryByText('Login expires in 88 days');
      // assert
      expect(time).toBeInTheDocument();
      expect(date).toBeInTheDocument();
      expect(expiryText).toBeInTheDocument();
    });
  });
});
