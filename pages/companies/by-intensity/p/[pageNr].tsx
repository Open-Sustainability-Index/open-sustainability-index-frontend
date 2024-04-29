import type { GetStaticPathsContext, GetStaticPathsResult } from 'next'

import { CompanyListPageParams } from '../../'
export { default, getStaticProps } from '../'

export async function getStaticPaths (context: GetStaticPathsContext): Promise<GetStaticPathsResult<CompanyListPageParams>> {
  return {
    paths: [
      { params: { pageNr: '2' } }
    ],
    fallback: true // false → 404, true: Next.js tries to generate page
  }
}
