import React from 'react'

import { Company } from 'types/global'
import DataTable, { DataTableHeader } from '../common/DataTable'
import SearchBlock from '../navigation/SearchBlock'

const headers: readonly DataTableHeader[] = [
  {
    field: 'company_name',
    label: 'Company'
  },
  {
    field: 'jurisdiction',
    label: 'Jurisdiction'
  },
  {
    field: 'industry',
    label: 'Industry'
  },
  {
    field: 'nearTerm',
    label: 'Near-term',
    type: 'status',
    statusField: 'nearTermStatus'
  },
  {
    field: 'netZero',
    label: 'Net Zero',
    type: 'status',
    statusField: 'netZeroStatus'
  },
  {
    field: 'emissions',
    label: 'Emissions (t CO2e)',
    type: 'number',
    align: 'right'
  },
  {
    field: 'revenue',
    label: 'Revenue (MUSD)',
    type: 'number',
    align: 'right'
  },
  {
    field: 'intensity',
    label: 'Intensity',
    type: 'number',
    align: 'right'
  },
  {
    field: 'year',
    label: 'Year',
    type: 'number',
    align: 'center'
  }
]

const CompanyList = ({ companies, pageNr }: { companies?: Company[], pageNr: number }): React.ReactElement | string => {
  return (
    <>
      <SearchBlock />
      <DataTable
        data={companies ?? []}
        headers={headers}
        rowKeyField='slug'
        detailPageLink='/companies/:key'
        pageNr={pageNr}
      />
    </>
  )
}
export default CompanyList
