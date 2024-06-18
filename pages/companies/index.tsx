import React from 'react'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'

import { fetchCompanies, companiesPageProps } from 'app/services/companies'

import { ListEndpointParams, CompaniesCompany, PageProps } from 'types/global'

import toSlug from 'lib/toSlug'
import CompanyList from 'app/components/companies/CompanyList'
import PageTopBanner from 'app/components/page/PageTopBanner'

export interface CompanyListPageParams extends ParsedUrlQuery {
  page: string
}

export interface CompanyListPageProps extends PageProps {
  companies?: CompaniesCompany[]
  page: number
  detailPageLink?: string
  filters: ListEndpointParams['filters']
}

function CompanyListPage ({ companies, page, detailPageLink, titleH1 }: CompanyListPageProps): React.ReactElement {
  return (
    <>
      <PageTopBanner subtitle='Companies' title={titleH1} />
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
      ...company,
      ...getNearTerm(company),
      ...getNetZero(company)
    })
  }
}

function getNearTerm (company: CompaniesCompany): Record<string, string> | null {
  if (company.targets.find(target => target.target === 'Near-term') != null) {
    return {
      nearTerm: 'Target set',
      nearTermStatus: 'success'
    }
  }
  if (company.status === 'Target set') {
    return {
      nearTerm: 'Target set',
      nearTermStatus: 'success'
    }
  }
  if (company.status === 'Removed') {
    return {
      nearTerm: 'Removed',
      nearTermStatus: 'error'
    }
  }
  if (company.status === 'Active') {
    return {
      nearTerm: 'Committed',
      nearTermStatus: 'warning'
    }
  }
  if (company.status === 'Extended') {
    return {
      nearTerm: 'Committed',
      nearTermStatus: 'warning'
    }
  }
  return null
}

function getNetZero (company: CompaniesCompany): Record<string, string> | null {
  if (company.targets.find(target => target.target === 'Net-zero') != null) {
    return {
      netZero: 'Target set',
      netZeroStatus: 'success'
    }
  }
  if (company.status === 'Target set') {
    return {
      netZero: 'Target set',
      netZeroStatus: 'success'
    }
  }
  if (company.status === 'Removed' && company.commitment_type === 'Net-zero') {
    return {
      netZero: 'Removed',
      netZeroStatus: 'error'
    }
  }
  if (company.status === 'Active' && company.commitment_type === 'Net-zero') {
    return {
      netZero: 'Committed',
      netZeroStatus: 'warning'
    }
  }
  if (company.status === 'Extended' && company.commitment_type === 'Net-zero') {
    return {
      netZero: 'Committed',
      netZeroStatus: 'warning'
    }
  }
  return null
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
  return {
    props: {
      filters: params.filters,
      ...companiesPageProps(cleanedCompanies, params),
      page: params.page ?? 1,
      companies: cleanedCompanies,
      detailPageLink: '/companies' // Can't be '/company' because it messes up sorting
    }
  }
}

export const getServerSideProps = async (context: GetServerSidePropsContext<CompanyListPageParams>): Promise<GetServerSidePropsResult<CompanyListPageProps>> => {
  const { sort, order, page, ...filters } = context.query
  return await getCompaniesListProps({
    sort: sort as string,
    order: order as string,
    page: parseInt(page as string ?? '1'),
    filters: filters as Record<string, string | undefined>,
    pageSize: filters.tags ? 200 : 20,
  }, context)
}
