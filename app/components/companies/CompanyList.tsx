import React from 'react'

// import { useListCompanies } from '../../graphql/collections/company/hooks'
import CompanyListItem from './CompanyListItem'
import { Company } from 'types/global'

const CompanyList = ({ companies }: { companies?: Company[] }): React.ReactElement | string => {
  return (
    <>
      {companies?.map((company) => (
        <CompanyListItem
          key={company.company_name}
          company={company}
        />
      ))}
    </>
  )
}
export default CompanyList
