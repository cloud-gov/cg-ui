// Copied largely from
// https://github.com/trussworks/react-uswds/ Button component

import React from 'react';
import classnames from 'classnames';

export type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  secondary?: boolean;
  base?: boolean;
  accentStyle?: 'cool' | 'warm';
  outline?: boolean;
  inverse?: boolean;
  size?: 'big';
  unstyled?: boolean;
};

export function Button({
  accentStyle,
  base,
  className,
  children,
  inverse,
  onClick,
  outline,
  secondary,
  size,
  type,
  unstyled,
  ...defaultProps
  // eslint-disable-next-line no-undef
}: ButtonProps & JSX.IntrinsicElements['button']): React.ReactElement {
  const classes = classnames(
    'usa-button',
    {
      'usa-button--secondary': secondary,
      'usa-button--base': base,
      'usa-button--accent-cool': accentStyle === 'cool',
      'usa-button--accent-warm': accentStyle === 'warm',
      'usa-button--outline': outline,
      'usa-button--inverse': inverse,
      'usa-button--big': size === 'big',
      'usa-button--unstyled': unstyled,
    },
    className
  );

  return (
    <button type={type} className={classes} onClick={onClick} {...defaultProps}>
      {children}
    </button>
  );
}
