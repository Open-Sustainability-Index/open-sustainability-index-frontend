export const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);
export const titleCase = (str: string): string =>
  str.replace(/(?:^|\s|[-"'([{])+\S/g, (c) => c.toUpperCase());

export const parseFloatSpaces = (str: string): number => parseFloat(str?.replace(/[^0-9.]/g, ''));

export const changeQuery = (
  query: Record<string, any>,
  key: string,
  newValue: any,
): Record<string, any> => {
  const { [key]: oldValue, ...restOfQuery } = query;
  const newQuery = { ...restOfQuery, ...(newValue !== '' ? { [key]: newValue } : {}) };
  return newQuery;
};

export const changeQueryString = (
  query: Record<string, any>,
  key: string,
  newValue: any,
): string => {
  const newQuery = changeQuery(query, key, newValue);
  return new URLSearchParams(newQuery).toString();
};

export const formatAmount = (value: string | number | null): string => {
  if (value === null || value === undefined) {
    return '';
  }
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  return numberValue.toLocaleString();
};
