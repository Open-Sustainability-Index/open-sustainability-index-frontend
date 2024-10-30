import React from 'react'
import { Container } from '@mui/material'

import { CompaniesCompany } from 'types/global'
import { formatAmount } from 'lib/strings'

import DataTable, { DataTableHeader } from '../common/DataTable'
import SearchBlock from '../navigation/SearchBlock'
import FiltersBlock from '../navigation/FiltersBlock'

const headers: readonly DataTableHeader[] = [
  {
    field: 'company_name',
    label: 'Company',
    displayOnMobile: true,
    defaultSortOrder: 'asc'
  },
  {
    field: 'jurisdiction',
    label: 'Jurisdiction',
    defaultSortOrder: 'asc'
  },
  {
    field: 'industry',
    label: 'Industry',
    defaultSortOrder: 'asc'
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
    field: 'total_reported_emission_scope_1_2_3',
    label: 'Emissions (t CO2e)',
    type: 'number',
    align: 'right',
    defaultSortOrder: 'desc',
    format: (value: number): string => formatAmount(value)
  },
  {
    field: 'revenue',
    label: 'Revenue (M USD)',
    type: 'number',
    align: 'right',
    defaultSortOrder: 'desc',
    format: (value: number): string => formatAmount(value)
  },
  {
    field: 'emission_intensity',
    label: 'Intensity (t CO₂e / M USD)',
    type: 'number',
    align: 'right',
    displayOnMobile: true,
    defaultSortOrder: 'desc',
    format: (value: number): string => formatAmount(value)
  },
  {
    field: 'year',
    label: 'Year',
    type: 'number',
    align: 'center',
    defaultSortOrder: 'asc'
  }
]

interface CompanyListProps {
  companies?: CompaniesCompany[]
  page?: number
  detailPageLink?: string
}

const CompanyList = ({ companies, page, detailPageLink = '/company/:key' }: CompanyListProps): React.ReactElement | string => {
  return (
    <>
      <Container>
        <SearchBlock>
          <FiltersBlock />
        </SearchBlock>
      </Container>
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
