const toSlug = (str: string): string => str?.replace(/ /g, '-')?.toLowerCase()
export default toSlug
