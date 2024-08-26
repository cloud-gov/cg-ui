import classNames from 'classnames';
import { Tag } from '@/components/uswds/Tag';

export function ServiceTag({
  className,
  label = 'service',
}: {
  className?: string;
  label?: string;
}) {
  const classes = classNames('bg-base-lighter', 'text-base-darker', className);
  return <Tag className={classes} label={label} />;
}
