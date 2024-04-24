import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsContext, GetStaticPathsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'

import { fetchCompany, fetchCompanyHistory, companySeoProps } from 'app/services/companies'
import CompanyDetails from '../../app/components/companies/CompanyDetails'

interface CompanyPageParams extends ParsedUrlQuery {
  companySlug: string
}

interface CompanyPageProps {
  company: Company | undefined
  companySlug?: string | null
  title: string
}

const CompanyPage = ({ title, company, companySlug }: CompanyPageProps): React.ReactElement => {
  console.log('{ title, company, companySlug }:', { title, company, companySlug })
  if (
    (company === null) ||
    (company === undefined)
  ) {
    return <div>Company not found</div>
  } else {
    return (
      <CompanyDetails
        company={company}
        title={title}
      />
    )
  }
}

export default CompanyPage

export async function getStaticProps (context: GetStaticPropsContext<CompanyPageParams>): Promise<GetStaticPropsResult<CompanyPageProps>> {
  const companySlug = context.params?.companySlug
  const company = await fetchCompanyHistory(companySlug as string)
  return {
    props: {
      ...companySeoProps(company),
      companySlug,
      company,
    }
  }
}

export async function getStaticPaths (context: GetStaticPathsContext): Promise<GetStaticPathsResult<CompanyPageParams>> {
  // const locales = context.locales ?? ['en']
  return {
    paths: [],
    fallback: true // false → 404, true: Next.js tries to generate page
  }
}
