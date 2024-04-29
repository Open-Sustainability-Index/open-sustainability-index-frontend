import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'

import { fetchCompanies, companiesPageProps } from 'app/services/companies'

import { ListPageOptions, CompaniesCompany } from 'types/global'
import toSlug from 'lib/toSlug'
import CompanyList from 'app/components/companies/CompanyList'
import PageTopBanner from 'app/components/page/PageTopBanner'

export interface CompanyListPageParams extends ParsedUrlQuery {
  pageNr: string
}

export interface CompanyListPageProps {
  title: string
  description: string
  companies?: CompaniesCompany[]
  pageNr: number
  detailPageLink?: string
}

function CompanyListPage ({ companies, pageNr, detailPageLink }: CompanyListPageProps): React.ReactElement {
  return (
    <>
      <PageTopBanner title='Companies' description='Find any company' />
      <CompanyList
        companies={companies}
        pageNr={pageNr}
        detailPageLink={detailPageLink}
      />
    </>
  )
}

export default CompanyListPage

const formatCompanyData = (company: CompaniesCompany): any => {
  // Find company.emissions with highest year
  const hasEmissions = company.total_reported_emission_scope_1_2_3 !== undefined
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
      year: company.year
    })
  }
}

export const getCompaniesListProps = async (context: GetStaticPropsContext<CompanyListPageParams>, options?: ListPageOptions): Promise<GetStaticPropsResult<CompanyListPageProps>> => {
  const pageNr = parseInt(context.params?.pageNr ?? '1')
  const pageCompanies = (await fetchCompanies(pageNr, undefined, options?.sortBy, options?.sortDirection)) ?? []
  // const companiesWithData = pageCompanies.filter(company => !!company.total_reported_emission_scope_1_2_3)
  // const companiesWithoutData = pageCompanies.filter(company => !company.total_reported_emission_scope_1_2_3)
  // const cleanedCompanies = [...companiesWithData, ...companiesWithoutData].map(formatCompanyData)
  const cleanedCompanies = pageCompanies.map(formatCompanyData)
  // console.log('companiesWithData:', companiesWithData.length, companiesWithoutData.length)
  // console.log('companies:', JSON.stringify(companies.filter(company => company.emissions.length > 0), null, 2))
  // console.log('cleanedCompanies:', JSON.stringify(cleanedCompanies, null, 2))
  const detailPage = options?.sortBy === 'emission_intensity'
    ? '/companies/by-intensity/:key'
    : '/companies/:key'
  return {
    props: {
      ...companiesPageProps(cleanedCompanies, options),
      pageNr,
      companies: cleanedCompanies,
      detailPageLink: detailPage
    }
  }
}

export const getStaticProps = async (context: GetStaticPropsContext<CompanyListPageParams>): Promise<GetStaticPropsResult<CompanyListPageProps>> => {
  return await getCompaniesListProps(context)
}
