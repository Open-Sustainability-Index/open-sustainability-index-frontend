import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'

import { CompanyListPageParams, CompanyListPageProps, getCompaniesListProps } from '../'
export { default } from '../'

export const getStaticProps = async (context: GetStaticPropsContext<CompanyListPageParams>): Promise<GetStaticPropsResult<CompanyListPageProps>> => {
  return await getCompaniesListProps(context, { sortBy: 'emission_intensity', sortDirection: 'desc', sortSeoDescription: 'sorted by intensity' })
}
