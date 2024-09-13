import classNames from 'classnames';

export function Tag({
  className,
  label,
}: {
  className?: string;
  label: string;
}) {
  const classes = classNames('usa-tag radius-pill', className);
  return <span className={classes}>{label}</span>;
}
