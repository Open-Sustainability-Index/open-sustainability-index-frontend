export const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)
export const titleCase = (str: string): string => str.replace(/(?:^|\s|[-"'([{])+\S/g, (c) => c.toUpperCase())

export const parseFloatSpaces = (str: string): number => parseFloat(str?.replace(/[^0-9.]/g, ''))

export const changeQueryString = (query: Record<string, any>, key: string, newValue: any): string => {
  const { [key]: oldValue, ...restOfQuery } = query
  const newQuery = { ...restOfQuery, ...(newValue !== '' ? { [key]: newValue } : {}) }
  return (new URLSearchParams(newQuery)).toString()
}
