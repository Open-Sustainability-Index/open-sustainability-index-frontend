import React from 'react'

// import { Company } from 'graphql/__generated__/graphql'

const CompanyDetails = ({ company }: { company?: Company }): React.ReactElement => {
  return (
    <>
      <h1>{company?.Name}</h1>
      <p>{company?.Industry}</p>
      <p>{company?.['Scope 1\n(CO₂e)']}</p>
    </>
  )
}
export default CompanyDetails
