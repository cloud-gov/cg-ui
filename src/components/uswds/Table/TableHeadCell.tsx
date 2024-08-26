import classnames from 'classnames';
import { SortButton } from '@/components/SortButton';

type sortOption = 'unsorted' | 'asc' | 'desc';

export function TableHeadCell({
  className = '',
  data,
  sortDir = 'unsorted' as sortOption,
}: {
  className?: string;
  data?: string;
  sortDir?: sortOption;
}) {
  const classes = classnames(
    {
      active: sortDir !== 'unsorted',
    },
    className
  );
  const ariaLabel = `${data}, sortable column, currently ${(sortDir === 'asc' && 'sorted ascending') || (sortDir === 'desc' && 'sorted descending') || 'unsorted'}`;

  return (
    <th className={classes} scope="col" aria-label={ariaLabel}>
      {data && (
        <div className="display-flex flex-align-center font-sans-3xs text-normal text-uppercase">
          {data} <SortButton colName={data} direction={sortDir} />
        </div>
      )}
    </th>
  );
}
