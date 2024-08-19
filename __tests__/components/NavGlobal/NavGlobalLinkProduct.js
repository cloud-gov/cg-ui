/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { NavGlobalLinkProduct } from '@/components/NavGlobal/NavGlobalLinkProduct';

describe('<NavGlobalLinkProduct />', () => {
  it('renders a link', () => {
    const res = render(
      <NavGlobalLinkProduct href="/link" sharedClasses={['test-class']}>
        Test Link
      </NavGlobalLinkProduct>
    );

    const link = res.getByTestId('nav-global-link-product');
    expect(link).toHaveClass('test-class');
    expect(link.getAttribute('href')).toEqual('/link');
  });

  it('applies certain classes when active', () => {
    const res = render(
      <NavGlobalLinkProduct href="/" sharedClasses={[]} active />
    );

    const link = res.getByTestId('nav-global-link-product');
    expect(link).toHaveClass('border-white');
    expect(link).toHaveClass('text-bold');
  });
});
