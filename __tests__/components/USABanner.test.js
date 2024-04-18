/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { USABanner } from '../../components/USABanner';

describe('<USABanner />', () => {
  describe('on initial load', () => {
    it('content is collapsed', () => {
      // act
      render(<USABanner />);
      // assert
      const content = screen.queryByText('Official websites use .gov');
      expect(content).not.toBeInTheDocument();
    });
  });

  describe('when button is clicked', () => {
    it('content expands', async () => {
      // setup
      render(<USABanner />);
      // act
      // There are two elements with this text, but only one is visible (the other is for screen readers). So we get the second of the two, which is the button we want.
      const button = screen.getAllByText('Here’s how you know')[1];
      fireEvent.click(button);
      // assert
      const content = await screen.findByText('Official websites use .gov');
      expect(content).toBeInTheDocument();
    });
  });
});
