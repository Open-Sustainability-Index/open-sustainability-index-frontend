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

const IndustryList = ({ industries, pageNr }: { industries?: Industry[], pageNr: number }): React.ReactElement | string => {
  return (
    <>
      <SearchBlock />
      <DataTable
        data={industries ?? []}
        headers={headers}
        rowKeyField='slug'
        detailPageLink='/companies?industry=:key'
        pageNr={pageNr}
      />
    </>
  )
}
export default IndustryList
