import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsContext, GetStaticPathsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'

// import { Company } from 'graphql/__generated__/graphql'
// import { useGetCompany } from '../../graphql/collections/company/hooks'
import { fetchCompany } from 'app/services/companies'
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
  return (
    <CompanyDetails company={company} />
  )
}

export default CompanyPage

export async function getStaticProps (context: GetStaticPropsContext<CompanyPageParams>): Promise<GetStaticPropsResult<CompanyPageProps>> {
  const companySlug = context.params?.companySlug
  const company = await fetchCompany(companySlug as string)
  return {
    props: {
      title: `Company ${companySlug as string}`,
      companySlug,
      company
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
