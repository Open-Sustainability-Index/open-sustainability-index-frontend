import React from 'react'
import type { GetStaticPropsResult } from 'next'

import { config } from 'config/config'

import CompanyList from 'components/companies/CompanyList'
import CreateCompanyForm from 'components/companies/CreateCompanyForm'

interface CompanyListPageProps {
  title: string
}

function CompanyListPage ({ title }: CompanyListPageProps): React.ReactElement {
  // Note: 'query' contains both /:params and ?query=value from url
  return (
    <>
      <h1>{config.appName}: {title}</h1>
      <p><em>{config.appTagline}</em></p>

      <CompanyList />
      <CreateCompanyForm />

      <h2>GraphQL</h2>
      <p>Try the <a target='_blank' rel='noopener noreferrer' href='/api/graphiql'>GraphQL Explorer</a></p>
    </>
  )
}

export default CompanyListPage

export const getStaticProps = async (): Promise<GetStaticPropsResult<{}>> => ({
  props: {
    title: 'Companies List'
  }
})
