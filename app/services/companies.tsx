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

import makeRestRequest from 'lib/makeRestRequest'
import toSlug from 'lib/toSlug'
import { Company, SeoProps } from 'types/global'

interface CompaniesInputProps {
  children: React.ReactNode
}

interface CompaniesReturnProps {
  companies?: Company[]
}

export const companiesSeoProps = (companies: Company[]): SeoProps => {
  const first3CompanyNames = companies.slice(0, 3).map((company) => company.company_name).join(', ')
  return {
    title: 'Global company GHG emission data per industry and year',
    description: `Get open-source global GHG emission data (scope 1/2/3) for companies such as ${first3CompanyNames}. Includes emissions per year, industry, country, and company intensity factors.`
  }
}

export const fetchCompanies = async (pageNr = 1, pageSize = 20): Promise<Company[]> => {
  const url = `companies?limit=${pageSize}&offset=${pageNr - 1}`
  console.log('url:', url)
  const results = await makeRestRequest('GET', url)
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

export const companyPath = (company: Company): string => `/companies/${toSlug(company.company_name)}`

export const companySeoProps = (company: Company): SeoProps => ({
  title: `${company.company_name} - Company emissions and industry benchmarking`,
  description: `See GHG emission data for ${company.company_name} (scope 1/2/3) per year, and company emission intensity based on t CO₂e per M USD revenue.`
})

export const fetchCompany = async (companySlug: string): Promise<Company> => {
  const results = await makeRestRequest('GET', `companies/${companySlug}/`)
  return results?.data
}

export const fetchCompanyHistory = async (companySlug: string): Promise<Company> => {
  const results = await makeRestRequest('GET', `companies/${companySlug}/all-years`)
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
