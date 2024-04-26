// SQL: SELECT REGEXP_REPLACE(REGEXP_REPLACE(LOWER(TRIM(company_name)),' |_|-','-','g'),'[^a-zA-Z0-9-]','','g') AS slug
const toSlug = (str: string): string => str?.trim().toLowerCase().replace(/ |_/g, '-').replace(/[^\w-]+/g, '')
export default toSlug
