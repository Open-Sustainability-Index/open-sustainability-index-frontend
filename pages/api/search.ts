import { SearchResult, fetchSearch } from 'app/services/search'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<SearchResult[]>
): Promise<void> {
  const result = await fetchSearch({ query: req.query.query as string })
  return res.status(200).json(result)
}
