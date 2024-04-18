import React from 'react'

// import { Company } from 'graphql/__generated__/graphql'

const CompanyDetails = ({ company }: { company?: Company }): React.ReactElement => {
  return (
    <>
      <h1>{company?.name}</h1>
      <p>{company?.symbol}</p>
    </>
  )
}
export default CompanyDetails
