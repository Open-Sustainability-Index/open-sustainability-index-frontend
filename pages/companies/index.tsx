import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'

import { fetchCompanies, companiesPageProps } from 'app/services/companies'

import { CompaniesCompany } from 'types/global'
import toSlug from 'lib/toSlug'
import CompanyList from 'app/components/companies/CompanyList'
import PageTopBanner from 'app/components/page/PageTopBanner'

export interface CompanyListPageParams extends ParsedUrlQuery {
  pageNr: string
}

interface CompanyListPageProps {
  title: string
  description: string
  pageNr: number
  companies?: CompaniesCompany[]
}

function CompanyListPage ({ companies, pageNr }: CompanyListPageProps): React.ReactElement {
  return (
    <>
      <PageTopBanner title='Companies' description='Find any company' />
      <CompanyList companies={companies} pageNr={pageNr} />
    </>
  )
}

export default CompanyListPage

const formatCompanyData = (company: CompaniesCompany): any => {
  // Find company.emissions with highest year
  const hasEmissions = !!company.total_reported_emission_scope_1_2_3

  return {
    company_name: company.company_name,
    slug: toSlug(company.company_name),
    // Only include emissions data if company has emissions data:
    ...(hasEmissions && {
      industry: company.industry,
      nearTerm: company.target?.toLowerCase() === 'near-term' ? 'Target set' : null,
      nearTermStatus: 'success',
      netZero: company.target?.toLowerCase() === 'net-zero' ? 'Target set' : null,
      netZeroStatus: 'success',
      emissions: company.total_reported_emission_scope_1_2_3,
      revenue: company.revenue,
      intensity: company.emission_intensity,
      year: company.year,
    })
  }
}

export const getStaticProps = async (context: GetStaticPropsContext<CompanyListPageParams>): Promise<GetStaticPropsResult<{}>> => {
  const pageNr = parseInt(context.params?.pageNr ?? '1')
  const pageCompanies = (await fetchCompanies(pageNr)) ?? []
  const companiesWithData = pageCompanies.filter(company => !!company.total_reported_emission_scope_1_2_3)
  const companiesWithoutData = pageCompanies.filter(company => !company.total_reported_emission_scope_1_2_3)
  const cleanedCompanies = [...companiesWithData, ...companiesWithoutData].map(formatCompanyData)
  // console.log('companiesWithData:', companiesWithData.length, companiesWithoutData.length)
  // console.log('companies:', JSON.stringify(companies.filter(company => company.emissions.length > 0), null, 2))
  // console.log('cleanedCompanies:', JSON.stringify(cleanedCompanies, null, 2))
  return {
    props: {
      ...companiesPageProps(pageCompanies),
      pageNr,
      companies: cleanedCompanies
    }
  }
}
