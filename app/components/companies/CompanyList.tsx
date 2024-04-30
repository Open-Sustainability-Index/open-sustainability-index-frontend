import React from 'react'

import { CompaniesCompany } from 'types/global'
import DataTable, { DataTableHeader } from '../common/DataTable'
import SearchBlock from '../navigation/SearchBlock'
import FiltersBlock from '../navigation/FiltersBlock'

const headers: readonly DataTableHeader[] = [
  {
    field: 'company_name',
    label: 'Company',
    displayOnMobile: true,
    isSortable: true
  },
  {
    field: 'jurisdiction',
    label: 'Jurisdiction',
    isSortable: true
  },
  {
    field: 'industry',
    label: 'Industry',
    isSortable: true
  },
  {
    field: 'nearTerm',
    label: 'Near-term',
    type: 'status',
    statusField: 'nearTermStatus',
    isSortable: true
  },
  {
    field: 'netZero',
    label: 'Net Zero',
    type: 'status',
    statusField: 'netZeroStatus',
    displayOnMobile: true,
    isSortable: true
  },
  {
    field: 'emissions',
    label: 'Emissions (t CO2e)',
    type: 'number',
    align: 'right',
    isSortable: true
  },
  {
    field: 'revenue',
    label: 'Revenue (M USD)',
    type: 'number',
    align: 'right',
    isSortable: true
  },
  {
    field: 'intensity',
    label: 'Intensity (t CO₂e / M USD)',
    type: 'number',
    align: 'right',
    displayOnMobile: true,
    isSortable: true
  },
  {
    field: 'year',
    label: 'Year',
    type: 'number',
    align: 'center',
    isSortable: true
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
      <SearchBlock>
        <FiltersBlock />
      </SearchBlock>
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
