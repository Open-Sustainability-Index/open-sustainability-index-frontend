import React from 'react'

import { Industry } from 'types/global'
import DataTable, { DataTableHeader } from '../common/DataTable'
import SearchBlock from '../navigation/SearchBlock'

const headers: readonly DataTableHeader[] = [
  {
    field: 'name',
    label: 'Industry',
    displayOnMobile: true
  }
]

const IndustryList = ({ industries, page }: { industries?: Industry[], page: number }): React.ReactElement | string => {
  return (
    <>
      <SearchBlock />
      <DataTable
        data={industries ?? []}
        headers={headers}
        rowKeyField='name'
        detailPageLink='/companies?industry=:key'
      />
    </>
  )
}
export default IndustryList
