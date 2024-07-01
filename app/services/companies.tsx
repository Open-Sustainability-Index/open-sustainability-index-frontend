/*
  Usage:
    import { CompaniesContextProvider } from 'hooks/useCompanies'
    <CompaniesContextProvider
      companies={companies}
    >
      <ComponentThatUsesCompanies />
    </CompaniesContextProvider>

  and inside ComponentThatUsesCompanies:
    import { useCompanies } from 'hooks/useCompanies'
    const { companies } = useCompanies()

  Usage:
    import { CompanyContextProvider } from 'hooks/useCompany'
    <CompanyContextProvider
      company={company}
    >
      <ComponentThatUsesCompany />
    </CompanyContextProvider>

  and inside ComponentThatUsesCompany:
    import { useCompany } from 'hooks/useCompany'
    const { company } = useCompany()
*/

import React, { createContext, useContext, useState } from 'react'

import { CompaniesCompany, Company, ListEndpointParams, PageProps } from 'types/global'
import makeRestRequest from 'lib/makeRestRequest'
import { titleCase, capitalizeFirstLetter } from 'lib/strings'

interface CompaniesInputProps {
  children: React.ReactNode
}

interface CompaniesReturnProps {
  companies?: Company[]
}

export const companiesPageProps = (companies: CompaniesCompany[], options?: ListEndpointParams): PageProps => {
  const first3CompanyNames = companies.slice(0, 3).map((company) => titleCase(company.company_name)).join(', ')
  const filterTags = options?.filters?.tags !== undefined ? `${options?.filters?.tags?.toUpperCase()} ` : ''
  const whichCompanies = filterTags
    ? `${filterTags}companies`
    : options?.sort !== undefined
      ? `companies with ${options?.order === 'desc' ? 'high' : 'low'} ${options?.sort?.replace(/_/g, ' ')}`
      : undefined
  return {
    title: 'Company CO₂ emissions, targets, and revenue ' + (whichCompanies !== undefined ? `for ${whichCompanies ?? 'companies'}` : 'per industry and year'),
    titleH1: capitalizeFirstLetter(whichCompanies ?? 'All companies'),
    description: `Get CO₂ emission data (scope 1/2/3) for ${whichCompanies ?? 'companies'} such as ${first3CompanyNames}. Includes GHG emissions per year, emission intensity, sustainability commitments and targets. Data is open-source and global.`
  }
}

export const fetchCompanies = async ({ page = 1, pageSize = 20, sort = 'company_name', order = 'asc', filters }: ListEndpointParams): Promise<CompaniesCompany[]> => {
  const filtersQuery = (new URLSearchParams(filters as Record<string, string>)).toString()
  const url = `companies?sort=${sort}&order=${order}&limit=${pageSize}&offset=${(page - 1) * pageSize}&${filtersQuery}`
  const results = await makeRestRequest('GET', url, undefined, process.env.BACKEND_API_KEY)
  return results?.data
}

const CompaniesContext = createContext<Partial<CompaniesReturnProps>>({})

export const CompaniesContextProvider = (props: CompaniesInputProps): React.ReactElement => {
  // Use State to keep the values. Initial values are obtained from CompaniesContextProvider’s props.
  const [companies] = useState<Company[] | undefined>([])

  // Make the context object (i.e. the “API” for Companies)
  const companiesContext: CompaniesReturnProps = {
    companies
  }
  // Pass the value in Provider and return
  return <CompaniesContext.Provider value={companiesContext}>{props.children}</CompaniesContext.Provider>
}

export const { Consumer: CompaniesContextConsumer } = CompaniesContext

export const useCompanies = (): Partial<CompaniesReturnProps> => useContext(CompaniesContext)

/* ----- Company (singular) ----- */

interface CompanyInputProps {
  children: React.ReactNode
}

interface CompanyReturnProps {
  company?: Company
}

export const companyPath = (company: Company | CompaniesCompany): string => `/company/${company.slug}`

export const companyPageProps = (company: Company): PageProps => ({
  title: `${company?.company_name} - company GHG emissions and sustainability targets`,
  description: `See yearly GHG (CO₂) emission data for ${company?.company_name} (scope 1/2/3), and emission intensity based on t CO2 per M USD revenue.`
})

export const fetchCompany = async (companySlug: string): Promise<Company> => {
  const results = await makeRestRequest('GET', `companies/${companySlug}/`, undefined, process.env.BACKEND_API_KEY)
  return results?.data
}

export const fetchCompanyHistory = async (companySlug: string): Promise<Company> => {
  const results = await makeRestRequest('GET', `companies/${companySlug}/all-years`, undefined, process.env.BACKEND_API_KEY)
  return results?.data
}

const CompanyContext = createContext<Partial<CompanyReturnProps>>({})

export const CompanyContextProvider = (props: CompanyInputProps): React.ReactElement => {
  // Use State to keep the values. Initial values are obtained from CompanyContextProvider’s props.
  const [company] = useState<Company | undefined>()

  // Make the context object (i.e. the “API” for Company)
  const companyContext: CompanyReturnProps = {
    company
  }
  // Pass the value in Provider and return
  return <CompanyContext.Provider value={companyContext}>{props.children}</CompanyContext.Provider>
}

export const { Consumer: CompanyContextConsumer } = CompanyContext

export const useCompany = (): Partial<CompanyReturnProps> => useContext(CompanyContext)
