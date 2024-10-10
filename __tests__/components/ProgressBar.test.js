/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { ProgressBar } from '@/components/ProgressBar';

describe('<ProgressBar />', () => {
  describe('when changeColors is false', () => {
    it('keeps progress bar green', () => {
      // act
      const { container } = render(
        <ProgressBar total={100} fill={99} changeColors={false} />
      );
      // assert
      const progressDiv = container.querySelector('.bg-mint');
      expect(progressDiv).toBeInTheDocument();
    });
  });

  describe('when percentage is less than threshold1', () => {
    it('shows a green bar', () => {
      // act
      const { container } = render(<ProgressBar total={100} fill={25} />);
      // assert
      const progressDiv = container.querySelector('.bg-mint');
      expect(progressDiv).toBeInTheDocument();
    });
  });

  describe('when percentage is above threshold1 but below threshold2', () => {
    it('shows an light red bar', () => {
      // act
      const { container } = render(<ProgressBar total={100} fill={76} />);
      // assert
      const progressDiv = container.querySelector('.bg-red-30v');
      expect(progressDiv).toBeInTheDocument();
    });
  });

  describe('when percentage is above threshold2', () => {
    it('shows a deep red bar', () => {
      // act
      const { container } = render(<ProgressBar total={100} fill={95} />);
      // assert
      const progressDiv = container.querySelector('.bg-red-40v');
      expect(progressDiv).toBeInTheDocument();
    });
  });
});
