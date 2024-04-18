import React from 'react'
import type { GetStaticPropsResult } from 'next'

import { fetchCompanies, companiesSeoProps } from 'app/services/companies'

import CompanyList from 'app/components/companies/CompanyList'

interface CompanyListPageProps {
  title: string
  companies?: Company[]
}

function CompanyListPage ({ companies }: CompanyListPageProps): React.ReactElement {
  // Note: 'query' contains both /:params and ?query=value from url
  console.log('companies:', companies)
  return (
    <CompanyList companies={companies} />
  )
}

export default CompanyListPage

export const getStaticProps = async (): Promise<GetStaticPropsResult<{}>> => {
  const companies = await fetchCompanies()
  const first100Companies = companies.slice(0, 100)
  return {
    props: {
      ...companiesSeoProps(),
      companies: first100Companies
    }
  }
}
