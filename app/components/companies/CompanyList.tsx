import React from 'react'

import { CompaniesCompany } from 'types/global'
import DataTable, { DataTableHeader } from '../common/DataTable'
import SearchBlock from '../navigation/SearchBlock'

const headers: readonly DataTableHeader[] = [
  {
    field: 'company_name',
    label: 'Company',
    displayOnMobile: true
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
    statusField: 'netZeroStatus',
    displayOnMobile: true
  },
  {
    field: 'emissions',
    label: 'Emissions (t CO2e)',
    type: 'number',
    align: 'right'
  },
  {
    field: 'revenue',
    label: 'Revenue (M USD)',
    type: 'number',
    align: 'right'
  },
  {
    field: 'intensity',
    label: 'Intensity (t CO₂e / M USD)',
    type: 'number',
    align: 'right',
    displayOnMobile: true
  },
  {
    field: 'year',
    label: 'Year',
    type: 'number',
    align: 'center'
  }
]

interface CompanyListProps {
  companies?: CompaniesCompany[]
  page?: number
  detailPageLink?: string
}

const CompanyList = ({ companies, page, detailPageLink = '/companies/:key' }: CompanyListProps): React.ReactElement | string => {
  return (
    <>
      <SearchBlock />
      <DataTable
        data={companies ?? []}
        headers={headers}
        rowKeyField='slug'
        detailPageLink={detailPageLink}
        page={page}
      />
    </>
  )
}
export default CompanyList
