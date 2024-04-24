import React from 'react'

// import { Company } from 'graphql/__generated__/graphql'
import CompanyChart from '../charts/CompanyChart'
import { Company } from 'types/global'

const CompanyDetails = ({ company, title }: { company: Company, title: string }): React.ReactElement => {
  return (
    <>
      <h1>{title || company.company_name}</h1>
      <p>{company?.industry}</p>
      <p>{company?.emissions[0]?.scope_1}</p>
      <CompanyChart company={company} />
    </>
  )
}
export default CompanyDetails
