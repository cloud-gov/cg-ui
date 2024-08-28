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
      render(<UserAccountExpires daysToExpiration={null} />);
      // query
      const text = screen.queryByText(/Not available/);
      // assert
      expect(text).toBeInTheDocument();
    });
  });

  describe('when account is active', () => {
    it('shows number of days to expiration', () => {
      // render
      render(<UserAccountExpires daysToExpiration={88} />);
      // query
      const text = screen.queryByText('88 days');
      // assert
      expect(text).toBeInTheDocument();
    });
  });

  describe('when account is expired', () => {
    it('shows expired text', () => {
      // render
      render(<UserAccountExpires daysToExpiration={0} />);
      // query
      const text = screen.queryByText(/Expired/);
      // assert
      expect(text).toBeInTheDocument();
    });
  });
});
