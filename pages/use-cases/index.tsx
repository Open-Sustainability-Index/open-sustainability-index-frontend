import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { WordpressListPageProps } from 'app/services/wordpress'

import { generatePageProps } from '../news/index'
export { default } from '../news/index'

export async function getStaticProps (context: GetStaticPropsContext): Promise<GetStaticPropsResult<WordpressListPageProps>> {
  return await generatePageProps('use-cases')
}
