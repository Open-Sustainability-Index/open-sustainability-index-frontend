import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  Stack,
  Pagination,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { useRouter } from 'next/router'

import { COLORS } from 'app/theme/theme'
import { changeQuery, changeQueryString } from 'lib/strings'

export interface DataTableHeader {
  field: string
  label?: string
  type?: 'string' /* default, leave blank */ | 'number' | 'date' | 'status' | 'image' | 'link'
  align?: 'left' /* default, leave blank */ | 'right' | 'center'
  width?: string
  sortable?: boolean
  statusField?: string // Value in row.statusField can be: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  displayOnMobile?: boolean
  defaultSortOrder?: 'asc' | 'desc'
  isHorizontalHeader?: boolean
}

type DataTableRow = Record<string, any>

interface DataTableProps {
  headers: readonly DataTableHeader[]
  data: readonly DataTableRow[]
  rowKeyField?: string
  detailPageLink?: string
  page?: number
  title?: string // Optional title for the table
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
  const { sort, order } = router.query

  const handleRowClick = (row: DataTableRow): void => {
    if (row[rowKeyField as keyof typeof row] !== undefined && detailPageLink !== undefined) {
      const newPath = (detailPageLink + '/' + (row[rowKeyField as keyof typeof row] as string))
        .replace('=/', '=') // for e.g. /companies?industry=Media
      void router.push(newPath)
    }
  }

  const handleChangePage = (event: any, value: number): void => {
    if (detailPageLink !== undefined) {
      const newPath = detailPageLink + '?' + changeQueryString(router.query, 'page', value)
      void router.push(newPath)
    }
  }

  const handleSortColumn = (event: any, sort: string, order: 'asc' | 'desc'): void => {
    if (detailPageLink !== undefined) {
      const newPath = detailPageLink + '?' + changeQueryString(changeQuery(router.query, 'sort', sort), 'order', order)
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
                  sort={sort as string}
                  order={order as string}
                  onSort={handleSortColumn}
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
            onChange={handleChangePage}
          />
        </Stack>
      )}
    </>
  )
}

export default DataTable

interface DataTableHeaderCellProps {
  header: DataTableHeader
  title?: string
  align?: 'left' | 'right' | 'center'
  sort?: string
  order?: string
  onSort?: (event: any, sort: string, order: 'asc' | 'desc') => void
}

const DataTableHeaderCell = ({
  header,
  title,
  align,
  sort,
  order,
  onSort
}: DataTableHeaderCellProps): React.ReactElement => {
  const headerTitle = title ?? header.label ?? header.field
  return (
    <TableCell
      align={align ?? header.align ?? 'left'}
      sx={{ fontSize: '16px', fontWeight: 500, color: COLORS.GRAY_MEDIUM }}
    >
      {header.defaultSortOrder !== undefined
        ? (
          <TableSortLabel
            active={sort === header.field}
            direction={order === undefined ? undefined : (order === 'asc' ? 'asc' : 'desc')}
            onClick={(event) => onSort?.(event, header.field, sort === header.field ? (order === 'asc' ? 'desc' : 'asc') : (header.defaultSortOrder ?? 'asc'))}
          >
            {headerTitle}
          </TableSortLabel>
          )
        : (
            headerTitle
          )}
    </TableCell>
  )
}

interface DataTableCellProps {
  index: number
  row: DataTableRow
  header: DataTableHeader
  align?: 'left' | 'right' | 'center'
}

const DataTableCell = ({ index, row, header, align }: DataTableCellProps): React.ReactElement => (
  <TableCell
    component={index === 0 ? 'th' : undefined}
    scope={index === 0 ? 'row' : undefined}
    align={align ?? header.align ?? 'left'}
    sx={{ fontSize: '16px' }}
  >
    {(
      header.type === 'status'
        ? ((row[header.field] !== null && row[header.field] !== undefined) && (
          <Chip
            label={row[header.field]}
            color={row[header.statusField as keyof typeof row]}
          />
          )
          )
        : header.type === 'link'
          ? (
            <a href={row[header.field]} target='_blank' rel='noreferrer noopener'>
              (link)
            </a>
            )
          : row[header.field]
      )}
  </TableCell>
)

/* ----- Horizontal ----- */

export const DataTableHorizontal = ({
  headers,
  data,
  title
}: DataTableProps): React.ReactElement => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label='horizontal table'>
        <TableBody>
          {/* A special first row for headers */}
          <TableRow sx={{ backgroundColor: COLORS.BLUE_LIGHT }}>
            <DataTableHeaderCell title={title} header={headers[0]} align='left' />
            {data.map((row, rowIndex) => (
              <DataTableHeaderCell
                key={`header-${rowIndex}`}
                header={{ field: String(rowIndex), label: `Header ${rowIndex + 1}` }}
                title={row[headers[0]?.field]}
                align={headers[rowIndex]?.align}
              />
            ))}
          </TableRow>
          {/* Rest of rows */}
          {headers.slice(1).map((header, index) => (
            <TableRow key={index} sx={header.isHorizontalHeader === true ? { backgroundColor: COLORS.GRAY_LIGHT } : null}>
              <DataTableHeaderCell header={header} align='left' />
              {data.map((row, rowIndex) => (
                <DataTableCell
                  index={rowIndex}
                  key={`${index}-${rowIndex}`}
                  row={row}
                  header={header}
                />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
