import { postToSlack } from 'app/services/slack'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const result = await postToSlack(req.body)
  return res.status(200).json(result)
}
