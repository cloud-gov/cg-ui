import classnames from 'classnames';
import { SortButton } from '@/components/SortButton';

type sortOption = 'unsorted' | 'asc' | 'desc';

export function TableHeadCell({
  className = '',
  data,
  onSortClick = () => {},
  sortable = true,
  sortDir = 'unsorted' as sortOption,
}: {
  className?: string;
  data?: string;
  onSortClick?: Function;
  sortable?: boolean;
  sortDir?: sortOption;
}) {
  const classes = classnames(
    {
      active: sortDir !== 'unsorted',
    },
    className
  );
  const ariaLabelSortable = `${data}, sortable column, currently ${(sortDir === 'asc' && 'sorted ascending') || (sortDir === 'desc' && 'sorted descending') || 'unsorted'}`;

  return (
    <th
      className={classes}
      scope="col"
      aria-label={sortable ? ariaLabelSortable : ''}
    >
      {data && (
        <div className="display-flex flex-justify flex-align-center font-sans-3xs text-normal text-uppercase">
          {data}{' '}
          {sortable && (
            <SortButton
              colName={data}
              direction={sortDir}
              onSortClick={onSortClick}
            />
          )}
        </div>
      )}
    </th>
  );
}
