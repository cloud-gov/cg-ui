// sort an array of objects by a given object parameter
export function sortObjectsByParam(
  ary: Array<any>,
  param: string | number,
  order: 'asc' | 'desc' = 'asc'
): Array<any> {
  return ary.sort((a, b) => {
    if (a[param] === b[param]) return 0;

    // emptys sort after anything else
    // (but still treat the number 0 as sortable)
    if (!a[param] && a[param] != 0) return 1;
    if (!b[param] && b[param] != 0) return -1;

    if (order === 'desc') {
      return a[param] < b[param] ? 1 : -1;
    }
    // asc
    return a[param] < b[param] ? -1 : 1;
  });
}

export function filterObjectsByParams(
  ary: Array<any>,
  params: { [key: string]: string }
): Array<any> {
  return ary.filter(function (obj: any) {
    // find any params that match the search terms
    return (
      Object.keys(params).filter((key) =>
        new RegExp(params[key], 'i').test(obj[key])
      ).length > 0
    );
  });
}
