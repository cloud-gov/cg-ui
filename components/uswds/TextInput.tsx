import classnames from 'classnames';

export function TextInput({
  className,
  id,
  labelText,
  required = false,
  type = 'text',
  ...inputProps
}: {
  id: string;
  className?: string;
  labelText?: string;
  required?: boolean;
  type?: string;
}) {
  const classes = classnames('usa-input', className);
  return (
    <>
      {labelText && (
        <label className="usa-label" htmlFor={id}>
          {labelText}
          {required && (
            <abbr
              title="required"
              className="usa-hint usa-hint--required margin-left-2px"
            >
              *
            </abbr>
          )}
        </label>
      )}
      <input
        type={type}
        className={classes}
        id={id}
        name={id}
        required={required}
        {...inputProps}
      />
    </>
  );
}
