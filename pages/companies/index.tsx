import React from 'react'
import type { GetStaticPropsResult } from 'next'

import { fetchCompanies, companiesSeoProps } from 'app/services/companies'

import { Company } from 'types/global'
import { titleCase, parseFloatSpaces } from 'lib/strings'
import toSlug from 'lib/toSlug'
import CompanyList from 'app/components/companies/CompanyList'
import PageTopBanner from 'app/components/page/PageTopBanner'

interface CompanyListPageProps {
  title: string
  description: string
  companies?: Company[]
}

function CompanyListPage ({ title, description, companies }: CompanyListPageProps): React.ReactElement {
  return (
    <>
      <PageTopBanner title='Companies' description='Find any company' />
      <CompanyList companies={companies} />
    </>
  )
}

export default CompanyListPage

export const getStaticProps = async (): Promise<GetStaticPropsResult<{}>> => {
  const allCompanies = await fetchCompanies()
  const cleanedCompanies = allCompanies
    .filter(company => company.emissions.length > 0)
    .map((company) => {
      // Find company.emissions with highest year
      const emissionLastYear = company.emissions.sort((a, b) => b.year - a.year)[0]
      return {
        company_name: titleCase(company.company_name),
        slug: toSlug(company.company_name),
        industry: titleCase(emissionLastYear?.industry),
        nearTerm: company.targets.filter(target => target.target === 'near-term').length > 0 ? 'Target set' : null,
        nearTermStatus: 'success',
        emissions: emissionLastYear?.['total_reported_emission_scope_1+2+3'],
        revenue: emissionLastYear?.revenue,
        intensity: emissionLastYear?.['total_reported_emission_scope_1+2+3'] !== '' && emissionLastYear?.revenue !== ''
          ? (parseFloatSpaces(emissionLastYear?.['total_reported_emission_scope_1+2+3']) / parseFloatSpaces(emissionLastYear?.revenue)).toFixed(1)
          : null,
        year: emissionLastYear?.year
      }
    })
  console.log('allCompanies.length:', allCompanies.length, cleanedCompanies.length)
  // console.log('companies:', JSON.stringify(companies.filter(company => company.emissions.length > 0), null, 2))
  // console.log('cleanedCompanies:', JSON.stringify(cleanedCompanies, null, 2))
  return {
    props: {
      ...companiesSeoProps(allCompanies),
      companies: cleanedCompanies
    }
  }
}
