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
  Pagination,
  useTheme,
  useMediaQuery
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
  displayOnMobile?: boolean
}

type DataTableRow = Record<string, any>

interface DataTableProps {
  headers: readonly DataTableHeader[]
  data: readonly DataTableRow[]
  rowKeyField?: string
  detailPageLink?: string
  page?: number
}

const DataTable = ({
  headers,
  data,
  rowKeyField,
  detailPageLink,
  page
}: DataTableProps): React.ReactElement => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()
  const headersToDisplay = headers.filter((header) => header.displayOnMobile === true || (!isMobile))

  const handleRowClick = (row: DataTableRow): void => {
    if (row[rowKeyField as keyof typeof row] !== undefined && detailPageLink !== undefined) {
      const newPath = detailPageLink.replace(':key', row[rowKeyField as keyof typeof row] as string)
      void router.push(newPath)
    }
  }

  const handlePageClick = (event: any, value: number): void => {
    if (detailPageLink !== undefined) {
      const newPath = (detailPageLink.replace('%3Akey', value.toString())).replace('&page=1', '')
      void router.push(newPath)
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead sx={{ backgroundColor: COLORS.BLUE_LIGHT }}>
            <TableRow>
              {headersToDisplay.map((header, index) => (
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
                {headersToDisplay.map((header, index) => (
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

      {page !== undefined && (
        <Stack spacing={2} mt={1}>
          <Pagination
            sx={{ display: 'flex', justifyContent: 'center' }}
            count={Math.max(page + 1, 10)}
            page={page}
            onChange={handlePageClick}
          />
        </Stack>
      )}
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
