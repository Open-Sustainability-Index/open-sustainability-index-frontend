import { fetchSearch } from 'app/services/search'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const result = await fetchSearch({ query: req.query.query })
  console.log('res', result, req.query)
  return res.status(200).json(result)
}
