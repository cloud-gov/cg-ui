/**
 * @jest-environment jsdom
 */
import { jest, describe, expect, it, beforeAll } from '@jest/globals';
import { OverlayDrawer } from '@/components/OverlayDrawer';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

describe('<OverlayDrawer />', () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.show = jest.fn(function () {
      this.open = true;
    });

    HTMLDialogElement.prototype.showModal = jest.fn(function () {
      this.open = true;
    });

    HTMLDialogElement.prototype.close = jest.fn(function () {
      this.open = false;
    });
  });

  it('shows dialog content when opened', async () => {
    // render
    render(
      <OverlayDrawer id="overlay-drawer-1" isOpen={true} close={() => {}}>
        This is the drawer content.
      </OverlayDrawer>
    );
    // assert
    await waitFor(() => {
      expect(screen.getByText(/This is the drawer content./i)).toBeVisible();
    });
  });

  it('hides dialog content when closed', async () => {
    // render
    render(
      <OverlayDrawer id="overlay-drawer-1" isOpen={false} close={() => {}}>
        This is the drawer content.
      </OverlayDrawer>
    );
    // assert
    await waitFor(() => {
      expect(
        screen.getByText(/This is the drawer content./i)
      ).not.toBeVisible();
    });
  });

  it('calls the close() prop when using the Escape key to close', async () => {
    // setup
    const close = jest.fn();
    // render
    render(
      <OverlayDrawer id="overlay-drawer-1" isOpen={true} close={close}>
        This is the drawer content.
      </OverlayDrawer>
    );
    // query
    const content = screen.getByText(/This is the drawer content./);
    expect(content).toBeInTheDocument();
    // act = press escape key
    await waitFor(() => {
      fireEvent.keyDown(content, {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        charCode: 27,
      });
    });
    // assert
    expect(close).toHaveBeenCalledTimes(1);
  });
});
