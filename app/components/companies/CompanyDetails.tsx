import React from 'react'

// import { Company } from 'graphql/__generated__/graphql'
import CompanyChart from '../charts/CompanyChart'

const CompanyDetails = ({ company, companyHistory, title }: { company: Company, companyHistory: Company[], title: string }): React.ReactElement => {
  return (
    <>
      <h1>{title ?? company?.Name}</h1>
      <p>{company?.Industry}</p>
      <p>{company?.['Scope 1\n(t CO₂e)']}</p>
      <p>
        <CompanyChart companyHistory={companyHistory} />
      </p>
    </>
  )
}
export default CompanyDetails
