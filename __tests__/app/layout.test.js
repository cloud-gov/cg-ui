/**
 * @jest-environment jsdom
 */
import RootLayout from '@/app/layout';
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('<RootLayout />', () => {
  it('focuses on skip to main content button first', async () => {
    // setup
    const user = userEvent.setup();
    // render
    /*
      This shows a warning about how <html> can't be a child of <div>
      because the layout has the <html> element and
      React Testing Library renders into a div by default.
      And passing a container option to render doesn't work
      because <html> can't really be a child of any element.
      But this doesn't affect functionality.
    */
    render(
      <RootLayout>
        <div>foo children</div>
      </RootLayout>
    );
    // act
    await user.tab();
    // expect
    const skipBtn = screen.getByText('Skip to main content');
    expect(skipBtn).toHaveFocus();
  });
});
