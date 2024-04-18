import React from 'react'

// import { Company } from 'graphql/__generated__/graphql'
import CompanyChart from '../charts/CompanyChart'

const CompanyDetails = ({ company, title }: { company: Company, title: string }): React.ReactElement => {
  return (
    <>
      <h1>{title ?? company?.Name}</h1>
      <p>{company?.Industry}</p>
      <p>{company?.['Scope 1\n(CO₂e)']}</p>
      <p>
        <CompanyChart company={company} />
      </p>
    </>
  )
}
export default CompanyDetails
