/**
 * @jest-environment jsdom
 */
import { jest, describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ListSearchInput } from '@/components/ListSearchInput';

describe('ListSearchInput', () => {
  describe('DOM elements', () => {
    it('has a form with a search role', () => {
      render(<ListSearchInput onSubmit={() => {}} />);
      const form = screen.queryByRole('search');
      expect(form).toBeInTheDocument();
    });
    it('has a label for the input', () => {
      render(<ListSearchInput onSubmit={() => {}} />);
      const inputByLabel = screen.queryByLabelText('Search');
      expect(inputByLabel).toBeInTheDocument();
    });
    it('has a submit button', () => {
      render(<ListSearchInput onSubmit={() => {}} />);
      const submitBtn = screen.queryByRole('button', { type: 'submit' });
      expect(submitBtn).toBeInTheDocument();
    });
  });
  describe('actions', () => {
    it('on submit, calls onSubmit prop with search term', async () => {
      // setup
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      // render
      render(<ListSearchInput onSubmit={onSubmit} />);
      // act
      const input = screen.getByLabelText('Search');
      input.focus();
      await user.keyboard('foo');
      await user.keyboard('{enter}');
      // expect
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith('foo');
    });
  });
});
