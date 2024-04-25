import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Pagination
} from '@mui/material'
import { useRouter } from 'next/router'

import { COLORS } from 'app/theme/theme'

export interface DataTableHeader {
  field: string
  label?: string
  type?: 'string' /* default, leave blank */ | 'number' | 'date' | 'status' | 'image'
  align?: 'left' /* default, leave blank */ | 'right' | 'center'
  width?: string
  sortable?: boolean
  statusField?: string // Value in row.statusField can be: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

type DataTableRow = Record<string, any>

interface DataTableProps {
  headers: readonly DataTableHeader[]
  data: readonly DataTableRow[]
  rowKeyField?: string
  detailPageLink?: string
  pageNr?: number
}

const DataTable = ({
  headers,
  data,
  rowKeyField,
  detailPageLink,
  pageNr = 1
}: DataTableProps): React.ReactElement => {
  const router = useRouter()

  const handleRowClick = (row: DataTableRow): void => {
    if (row[rowKeyField as keyof typeof row] !== undefined && detailPageLink !== undefined) {
      void router.push(detailPageLink.replace(':key', row[rowKeyField as keyof typeof row] as string))
    }
  }

  const handlePageClick = (event: any, value: number): void => {
    if (detailPageLink !== undefined) {
      void router.push((detailPageLink.replace(':key', `p/${value}`)).replace(/\/p\/1$/, ''))
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead sx={{ backgroundColor: COLORS.BLUE_LIGHT }}>
            <TableRow>
              {headers.map((header, index) => (
                <DataTableHeaderCell
                  key={index}
                  header={header}
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={index}
                hover
                onClick={() => handleRowClick(row)}
                style={{ cursor: 'pointer' }}
              >
                {headers.map((header, index) => (
                  <DataTableCell
                    key={index}
                    index={index}
                    row={row}
                    header={header}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2}>
        <Pagination
          sx={{ display: 'flex', justifyContent: 'center' }}
          count={Math.max(pageNr + 1, 10)}
          page={pageNr}
          onChange={handlePageClick}
        />
      </Stack>
    </>
  )
}

export default DataTable

const DataTableHeaderCell = ({ header }: { header: DataTableHeader }): React.ReactElement => (
  <TableCell
    align={header.align ?? 'left'}
    sx={{ fontSize: '16px' }}
  >
    {header.label ?? header.field}
  </TableCell>
)

const DataTableCell = ({ index, row, header }: { index: number, row: DataTableRow, header: DataTableHeader }): React.ReactElement => (
  <TableCell
    component={index === 0 ? 'th' : undefined}
    scope={index === 0 ? 'row' : undefined}
    align={header.align ?? 'left'}
    sx={{ fontSize: '16px' }}
  >
    {header.type === 'status'
      ? ((row[header.field] !== null && row[header.field] !== undefined) && (
        <Chip
          label={row[header.field]}
          color={row[header.statusField as keyof typeof row]}
        />
        )
        )
      : row[header.field]}
  </TableCell>
)
