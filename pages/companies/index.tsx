import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'

import { fetchCompanies, companiesSeoProps } from 'app/services/companies'

import { Company } from 'types/global'
import { titleCase, parseFloatSpaces } from 'lib/strings'
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
  companies?: Company[]
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

const formatCompanyData = (company: Company): any => {
  // Find company.emissions with highest year
  const hasEmissions = company.emissions.length > 0
  if (!hasEmissions) {
    return {
      company_name: titleCase(company.company_name)
    }
  }
  const emissionLastYear = company.emissions.sort((a, b) => b.year - a.year)[0]
  return {
    company_name: titleCase(company.company_name),
    slug: toSlug(company.company_name),
    industry: titleCase(emissionLastYear?.industry),
    nearTerm: company.targets.filter(target => target.target === 'near-term').length > 0 ? 'Target set' : null,
    nearTermStatus: 'success',
    netZero: company.targets.filter(target => target.target === 'net-zero').length > 0 ? 'Target set' : null,
    netZeroStatus: 'success',
    emissions: emissionLastYear?.['total_reported_emission_scope_1+2+3'],
    revenue: emissionLastYear?.revenue,
    intensity: emissionLastYear?.['total_reported_emission_scope_1+2+3'] !== '' && emissionLastYear?.revenue !== ''
      ? (parseFloatSpaces(emissionLastYear?.['total_reported_emission_scope_1+2+3']) / parseFloatSpaces(emissionLastYear?.revenue)).toFixed(1)
      : null,
    year: emissionLastYear?.year
  }
}

export const getStaticProps = async (context: GetStaticPropsContext<CompanyListPageParams>): Promise<GetStaticPropsResult<{}>> => {
  const pageNr = parseInt(context.params?.pageNr ?? '1')
  const pageCompanies = await fetchCompanies(pageNr)
  const companiesWithData = pageCompanies.filter(company => company.emissions.length > 0)
  const companiesWithoutData = pageCompanies.filter(company => company.emissions.length === 0)
  const cleanedCompanies = [...companiesWithData, ...companiesWithoutData].map(formatCompanyData)
  // console.log('companiesWithData:', companiesWithData.length, companiesWithoutData.length)
  // console.log('companies:', JSON.stringify(companies.filter(company => company.emissions.length > 0), null, 2))
  // console.log('cleanedCompanies:', JSON.stringify(cleanedCompanies, null, 2))
  return {
    props: {
      ...companiesSeoProps(pageCompanies),
      pageNr,
      companies: cleanedCompanies
    }
  }
}
