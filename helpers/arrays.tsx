// sort an array of objects by a given object parameter
export function sortObjectsByParam(
  ary: Array<any>,
  param: string | number,
  order: 'asc' | 'desc' = 'asc'
): Array<any> {
  return ary.sort((a, b) => {
    if (a[param] === b[param]) return 0;

    // emptys sort after anything else
    if (!a[param]) return 1;
    if (!b[param]) return -1;

    if (order === 'desc') {
      return a[param] < b[param] ? 1 : -1;
    }
    // asc
    return a[param] < b[param] ? -1 : 1;
  });
}
