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
  return (
    <CompanyList companies={companies} />
  )
}

export default CompanyListPage

export const getStaticProps = async (): Promise<GetStaticPropsResult<{}>> => {
  const allCompanies = await fetchCompanies()
  const companies = allCompanies.slice(0, 100)
  return {
    props: {
      ...companiesSeoProps(companies),
      companies
    }
  }
}
