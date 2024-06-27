// Copied largely from
// https://github.com/trussworks/react-uswds/ Checkbox component

import React from 'react';
import { useState } from 'react';
import classnames from 'classnames';

type CheckboxProps = {
  id: string;
  name: string;
  checked?: boolean;
  className?: string;
  label: React.ReactNode;
  labelDescription?: React.ReactNode;
  tile?: boolean;
};

export const Checkbox = ({
  id,
  name,
  checked,
  className,
  label,
  labelDescription,
  tile,
  ...inputProps
  // eslint-disable-next-line no-undef
}: CheckboxProps & JSX.IntrinsicElements['input']): React.ReactElement => {
  // if checked attribute was passed in, the checkbox should start checked
  const [isChecked, setIsChecked] = useState(!!checked);

  const checkHandler = () => {
    return setIsChecked(!isChecked);
  };

  const classes = classnames('usa-checkbox', className);
  const checkboxClasses = classnames('usa-checkbox__input', {
    'usa-checkbox__input--tile': tile,
  });

  return (
    <div data-testid="checkbox" className={classes}>
      <input
        id={id}
        checked={isChecked}
        className={checkboxClasses}
        name={name}
        onChange={checkHandler}
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
