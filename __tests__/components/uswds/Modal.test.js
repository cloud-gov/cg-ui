/**
 * @jest-environment jsdom
 */
import { jest, describe, expect, it } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/components/uswds/Modal';

describe('Modal', () => {
  it('traps focus within modal', async () => {
    // setup
    const user = userEvent.setup();
    const closeModal = jest.fn();
    // render
    render(
      <div data-testid="page">
        <button data-testid="button-outside-modal">button outside modal</button>
        <Modal modalId="modal-id" headingId="heading-id" close={closeModal}>
          <>
            <p id="heading-id">foo content</p>
            <button data-testid="button-submit">submit</button>
            <button data-testid="button-cancel">cancel</button>
          </>
        </Modal>
      </div>
    );
    const outsideModalBtn = screen.getByTestId('button-outside-modal');
    const submitBtn = screen.getByTestId('button-submit');
    const cancelBtn = screen.getByTestId('button-cancel');
    const closeBtn = screen.getByLabelText(/Close this window/);
    // act = tab
    await user.tab();
    expect(outsideModalBtn).toHaveFocus();
    // act = tab again
    await user.tab();
    expect(submitBtn).toHaveFocus();
    // act = tab again
    await user.tab();
    expect(cancelBtn).toHaveFocus();
    // act = tab again
    await user.tab();
    expect(closeBtn).toHaveFocus();
    // act = tab again - expect to go back to submit button, not outside button
    await user.tab();
    expect(submitBtn).toHaveFocus();
  });

  it('closes modal when escape key is pressed', () => {
    // setup
    const closeModal = jest.fn();
    // render
    render(
      <Modal modalId="modal-id" headingId="heading-id" close={closeModal}>
        <p id="heading-id">foo content</p>
      </Modal>
    );
    // expect
    const modalContent = screen.getByText(/foo content/);
    expect(modalContent).toBeInTheDocument();
    // act = press escape key
    fireEvent.keyDown(modalContent, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
    // expect
    expect(closeModal).toHaveBeenCalled();
  });

  it('closes modal when a click happens outside modal', () => {
    // setup
    const closeModal = jest.fn();
    // render
    render(
      <Modal modalId="modal-id" headingId="heading-id" close={closeModal}>
        <p id="heading-id">foo content</p>
      </Modal>
    );
    // expect
    const modalOverlay = screen.getByTestId(/usa-modal-overlay/);
    expect(modalOverlay).toBeInTheDocument();
    // act = press escape key
    fireEvent.click(modalOverlay);
    // expect
    expect(closeModal).toHaveBeenCalled();
  });
});
