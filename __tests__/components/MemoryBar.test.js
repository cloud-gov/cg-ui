/**
 * @jest-environment jsdom
 */
import { describe, expect, it, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { MemoryBar } from '@/components/MemoryBar';

describe('<MemoryBar />', () => {
  describe('when no allocated memory', () => {
    it('returns nothing', () => {
      render(<MemoryBar memoryUsed={50} memoryAllocated={null} />);
      const component = screen.queryByTestId('memory-bar');
      expect(component).not.toBeInTheDocument();
    });
  });

  describe('when allocated memory', () => {
    beforeEach(() => {
      render(<MemoryBar memoryUsed={40} memoryAllocated={100} />);
    });

    it('returns content', () => {
      const component = screen.queryByTestId('memory-bar');
      expect(component).toBeInTheDocument();
    });

    it('shows correct amount remaining', () => {
      const remainingText = screen.queryByText(/60MB remaining/);
      expect(remainingText).toBeInTheDocument();
    });
  });
});
