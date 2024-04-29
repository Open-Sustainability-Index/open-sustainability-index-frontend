import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'

import { CompanyListPageParams, CompanyListPageProps, getCompaniesListProps } from '../'
export { default } from '../'

export const getStaticProps = async (context: GetStaticPropsContext<CompanyListPageParams>): Promise<GetStaticPropsResult<CompanyListPageProps>> => {
  return await getCompaniesListProps(context, { sortBy: 'total_reported_emission_scope_1_2_3', sortDirection: 'desc', sortSeoDescription: 'sorted by emissions' })
}
