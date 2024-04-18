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

interface CompaniesInputProps {
  children: React.ReactNode
}

interface CompaniesReturnProps {
  companies?: Company[]
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

export const fetchCompany = async (companySlug: string): Promise<Company> => {
  const results = await makeRestRequest('GET', `companies/${companySlug}/`)
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
