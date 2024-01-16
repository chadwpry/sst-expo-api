export const ASCENDING = 'ASC';
export const DESCENDING = 'DESC';

export type SortAscending = typeof ASCENDING;
export type SortDescending = typeof DESCENDING;
export type SortOrder =
  | SortAscending
  | SortDescending;

export const byField = (key: string, order: SortOrder) => (a: any, b: any) => {
  if (order === ASCENDING) {
    if (a[key] > b[key]) {
      return 1;
    } else if (a[key] < b[key]) {
      return -1;
    } else {
      return 0;
    }
  } else if (order === DESCENDING) {
  }
}

