import React from 'react'

// import { useListCompanies } from '../../graphql/collections/company/hooks'
import CompanyListItem from './CompanyListItem'

const CompanyList = ({ companies }: { companies?: Company[] }): React.ReactElement | string => {
  return (
    <>
      {companies?.map((company) => (
        <CompanyListItem
          key={company.Name}
          company={company}
        />
      ))}
    </>
  )
}
export default CompanyList
