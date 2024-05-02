import makeRestRequest from 'lib/makeRestRequest'

interface SearchParams {
  query: string
  sort?: string
  order?: string
}

interface SearchResult {
  name: string
  slug: string
  type: string
}

export const fetchSearch = async ({ query, sort = 'name', order = 'asc' }: SearchParams): Promise<SearchResult[]> => {
  const url = `search?query=${query}&sort=${sort}&order=${order}`
  const results = await makeRestRequest('GET', url)
  return results?.data
}
