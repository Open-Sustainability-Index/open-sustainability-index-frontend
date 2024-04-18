import React from 'react'

// import { useListCompanies } from '../../graphql/collections/company/hooks'
import CompanyListItem from './CompanyListItem'

const CompanyList = (): React.ReactElement | string => {
  // const { data, loading, error } = useListCompanies()
  // if (loading) return 'Loading...'
  // if (error != null) return `Error! ${error.message}`
  const data = { allCompaniesList: [] as Company[] }

  return (
    <>
      {data?.allCompaniesList?.map((company) => (
        <CompanyListItem
          key={company.Name}
          company={company}
        />
      ))}
    </>
  )
}
export default CompanyList
