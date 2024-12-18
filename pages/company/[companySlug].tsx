import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsContext, GetStaticPathsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'

import { fetchCompanyHistory, companyPageProps } from 'app/services/companies'
import CompanyDetails from '../../app/components/companies/CompanyDetails'
import { Company, PageProps } from 'types/global'

interface CompanyPageParams extends ParsedUrlQuery {
  companySlug: string
}

interface CompanyPageProps extends PageProps {
  company: Company | undefined
  companySlug?: string | null
}

const CompanyPage = ({ title, company, companySlug }: CompanyPageProps): React.ReactElement => {
  return (
    <CompanyDetails
      company={company ?? undefined}
      loading={company === undefined}
    />
  )
}

export default CompanyPage

export async function getStaticProps (context: GetStaticPropsContext<CompanyPageParams>): Promise<GetStaticPropsResult<CompanyPageProps>> {
  const companySlug = context.params?.companySlug
  const company = await fetchCompanyHistory(companySlug as string)
  return {
    props: {
      ...companyPageProps(company),
      companySlug,
      company,
      canonicalPath: `/company/${company?.slug}`,
      ...(company?.slug_new !== undefined ? { redirectTo: `/company/${company?.slug_new}` } : {})
    },
    revalidate: 30 * 60 // 30 min refresh
  }
}

export async function getStaticPaths (context: GetStaticPathsContext): Promise<GetStaticPathsResult<CompanyPageParams>> {
  // const locales = context.locales ?? ['en']
  return {
    paths: [],
    fallback: true // false → 404, true: Next.js tries to generate page
  }
}
