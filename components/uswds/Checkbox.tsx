// Copied largely from
// https://github.com/trussworks/react-uswds/ Checkbox component

import React from 'react';
import classnames from 'classnames';

type CheckboxProps = {
  id: string;
  name: string;
  checked: boolean;
  className?: string;
  label: React.ReactNode;
  labelDescription?: React.ReactNode;
  onChange: React.ReactEventHandler;
  tile?: boolean;
};

export const Checkbox = ({
  id,
  name,
  checked = false,
  className,
  label,
  labelDescription,
  onChange,
  tile,
  ...inputProps
  // eslint-disable-next-line no-undef
}: CheckboxProps & JSX.IntrinsicElements['input']): React.ReactElement => {
  const classes = classnames('usa-checkbox', className);
  const checkboxClasses = classnames('usa-checkbox__input', {
    'usa-checkbox__input--tile': tile,
  });

  return (
    <div data-testid="checkbox" className={classes}>
      <input
        id={id}
        checked={checked}
        className={checkboxClasses}
        name={name}
        onChange={onChange}
        type="checkbox"
        {...inputProps}
      />
      <label className="usa-checkbox__label" htmlFor={id}>
        {label}
        {labelDescription && (
          <span className="usa-checkbox__label-description">
            {labelDescription}
          </span>
        )}
      </label>
    </div>
  );
};

export default Checkbox;
