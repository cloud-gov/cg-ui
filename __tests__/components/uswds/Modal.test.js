/**
 * @jest-environment jsdom
 */
import { jest, describe, expect, it } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '@/components/uswds/Modal';

describe('Modal', () => {
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
});
