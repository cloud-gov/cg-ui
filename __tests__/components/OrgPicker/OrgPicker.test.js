/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrgPicker } from '@/components/OrgPicker/OrgPicker';

describe('<OrgPicker />', () => {
  describe('on initial load', () => {
    it('content is collapsed', () => {
      // act
      render(<OrgPicker />);
      // assert
      const content = screen.queryByText('View all organizations');
      expect(content).not.toBeInTheDocument();
    });
  });

  describe('when button is clicked', () => {
    it('content expands', async () => {
      // setup
      const user = userEvent.setup();
      render(<OrgPicker />);
      // act
      const button = screen.getByRole('button', { expanded: false });
      await user.click(button);
      // assert
      const content = await screen.findByText('View all organizations');
      expect(content).toBeInTheDocument();
    });
  });
});
