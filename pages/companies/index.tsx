import React from 'react'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'

import { fetchCompanies, companiesPageProps } from 'app/services/companies'
import { changeQueryString } from 'lib/strings'

import { ListEndpointParams, CompaniesCompany } from 'types/global'
import toSlug from 'lib/toSlug'
import CompanyList from 'app/components/companies/CompanyList'
import PageTopBanner from 'app/components/page/PageTopBanner'

export interface CompanyListPageParams extends ParsedUrlQuery {
  page: string
}

export interface CompanyListPageProps {
  title: string
  description: string
  companies?: CompaniesCompany[]
  page: number
  detailPageLink?: string
}

function CompanyListPage ({ companies, page, detailPageLink }: CompanyListPageProps): React.ReactElement {
  return (
    <>
      <PageTopBanner title='Companies' description='Find any company' />
      <CompanyList
        companies={companies}
        page={page}
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

export const getCompaniesListProps = async (params: ListEndpointParams, context: GetServerSidePropsContext<CompanyListPageParams>): Promise<GetServerSidePropsResult<CompanyListPageProps>> => {
  const pageCompanies = (await fetchCompanies(params)) ?? []
  // const companiesWithData = pageCompanies.filter(company => !!company.total_reported_emission_scope_1_2_3)
  // const companiesWithoutData = pageCompanies.filter(company => !company.total_reported_emission_scope_1_2_3)
  // const cleanedCompanies = [...companiesWithData, ...companiesWithoutData].map(formatCompanyData)
  const cleanedCompanies = pageCompanies.map(formatCompanyData)
  // console.log('companiesWithData:', companiesWithData.length, companiesWithoutData.length)
  // console.log('companies:', JSON.stringify(companies.filter(company => company.emissions.length > 0), null, 2))
  // console.log('cleanedCompanies:', JSON.stringify(cleanedCompanies, null, 2))
  const detailPageLink = '/companies?' + changeQueryString(context.query, 'page', ':key')
  return {
    props: {
      ...companiesPageProps(cleanedCompanies, params),
      page: params.page ?? 1,
      companies: cleanedCompanies,
      detailPageLink
    }
  }
}

export const getServerSideProps = async (context: GetServerSidePropsContext<CompanyListPageParams>): Promise<GetServerSidePropsResult<CompanyListPageProps>> => {
  const { sort, order, page, ...filters } = context.query
  return await getCompaniesListProps({ sort: sort as string, order: order as string, page: parseInt(page as string ?? '1'), ...filters }, context)
}
