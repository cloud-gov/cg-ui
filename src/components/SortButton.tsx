type sortOption = 'unsorted' | 'asc' | 'desc';

export function SortButton({
  colName,
  direction = 'unsorted' as sortOption,
}: {
  colName: string;
  direction?: sortOption;
}) {
  const title =
    direction === 'asc'
      ? `Click to sort by ${colName} in descending order`
      : `Click to sort by ${colName} in ascending order`;

  return (
    <button
      className="border-0 bg-transparent padding-0 cursor-pointer"
      tabIndex={0}
      title={title}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        {direction === 'desc' && (
          <path d="M17 17L15.59 15.59L12.9999 18.17V2H10.9999V18.17L8.41 15.58L7 17L11.9999 22L17 17Z"></path>
        )}
        {direction === 'asc' && (
          <path
            transform="rotate(180, 12, 12)"
            d="M17 17L15.59 15.59L12.9999 18.17V2H10.9999V18.17L8.41 15.58L7 17L11.9999 22L17 17Z"
          ></path>
        )}
        {direction === 'unsorted' && (
          <polygon points="15.17 15 13 17.17 13 6.83 15.17 9 16.58 7.59 12 3 7.41 7.59 8.83 9 11 6.83 11 17.17 8.83 15 7.42 16.41 12 21 16.59 16.41 15.17 15"></polygon>
        )}
      </svg>
    </button>
  );
}
