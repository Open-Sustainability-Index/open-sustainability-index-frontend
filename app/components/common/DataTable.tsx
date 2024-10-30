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
  useMediaQuery,
  TextField
} from '@mui/material'
import { useRouter } from 'next/router'
import Link from 'next/link'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import { COLORS } from 'app/theme/theme'
import { NameAndId } from 'types/global'
import { changeQuery, changeQueryString } from 'lib/strings'

export interface DataTableHeader {
  field: string
  label?: string
  type?: 'string' /* default, leave blank */ | 'number' | 'date' | 'status' | 'image' | 'link' | 'none'
  align?: 'left' /* default, leave blank */ | 'right' | 'center'
  width?: string
  sortable?: boolean
  statusField?: string // Value in row.statusField can be: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  displayOnMobile?: boolean
  defaultSortOrder?: 'asc' | 'desc'
  isHorizontalHeader?: boolean
  isEditable?: boolean
  format?: (value: any) => string
}

type DataTableRow = Record<string, any>

export type DataTableOnChangeFunction = (id: number, fieldName: string, value: NameAndId | null) => void

interface DataTableProps {
  headers: readonly DataTableHeader[]
  data: readonly DataTableRow[]
  rowKeyField?: string
  detailPageLink?: string
  page?: number
  title?: string // Optional title for the table
  onChange?: DataTableOnChangeFunction
  onDelete?: (id: number) => void
}

const getDetailPageLink = (detailPageLink: string, rowKeyField: string, row: DataTableRow): string => (detailPageLink + '/' + (row[rowKeyField] as string))
  .replace('=/', '=') // for e.g. /companies?industry=Media

const DataTable = ({
  headers,
  data,
  rowKeyField,
  detailPageLink,
  page,
  onChange
}: DataTableProps): React.ReactElement => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()
  const headersToDisplay = headers.filter((header) => header.displayOnMobile === true || (!isMobile))
  const { sort, order } = router.query

  const handleRowClick = (row: DataTableRow): void => {
    if (row[rowKeyField as keyof typeof row] !== undefined && detailPageLink !== undefined) {
      void router.push(getDetailPageLink(detailPageLink, rowKeyField as string, row))
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
                  index={index}
                  header={header}
                  sort={sort as string}
                  order={order as string}
                  onSort={handleSortColumn}
                  onChange={onChange}
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
                    detailPageLink={detailPageLink}
                    rowKeyField={rowKeyField}
                    onChange={onChange}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {page !== undefined && (
        <Stack spacing={2} mt={1} mb={5}>
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
  index: number
  header: DataTableHeader
  title?: string
  align?: 'left' | 'right' | 'center'
  sort?: string
  order?: string
  onSort?: (event: any, sort: string, order: 'asc' | 'desc') => void
  onChange?: DataTableOnChangeFunction
}

const TEXTFIELD_STYLE: React.CSSProperties = {
  textAlign: 'right',
  fontSize: '14px',
  padding: '0.5em 0.3em',
  minWidth: '5em'
}

const DataTableHeaderCell = ({
  index,
  header,
  title,
  align,
  sort,
  order,
  onSort,
  onChange
}: DataTableHeaderCellProps): React.ReactElement => {
  const headerTitle = title ?? header.label ?? header.field
  // If cell is editable
  const innerValueEditableOrNot = (onChange !== undefined && header.isEditable !== false)
    ? (
      <TextField
        value={headerTitle}
        placeholder={header.field.replace(/_/g, ' ')}
        onChange={(event) => onChange(index, header.field, { id: index, name: event.target.value })}
        type='text'
        InputProps={{
          inputProps: {
            step: 1,
            style: TEXTFIELD_STYLE
          }
        }}
      />
      )
    : headerTitle
  const innerValueSortable = onChange === undefined && header.defaultSortOrder !== undefined
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
        innerValueEditableOrNot
      )
  return (
    <TableCell
      align={align ?? header.align ?? 'left'}
      sx={{ fontSize: '16px', fontWeight: 500, color: COLORS.GRAY_MEDIUM, '&:not(:first-child)': { width: 150, textAlign: 'right' }, '&:first-child': { width: '50%' } }}
    >
      {innerValueSortable}
    </TableCell>
  )
}

interface DataTableCellProps {
  index: number
  row: DataTableRow
  header: DataTableHeader
  align?: 'left' | 'right' | 'center'
  detailPageLink?: string
  rowKeyField?: string
  onChange?: DataTableOnChangeFunction
}

const DataTableCell = ({ index, row, header, align, detailPageLink, rowKeyField, onChange }: DataTableCellProps): React.ReactElement => {
  const innerValue = (
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
            <OpenInNewIcon fontSize='small' />
          </a>
          )
        : header.format !== undefined
          ? header.format(row[header.field])
          : row[header.field]
  )
  // If link in cell
  const innerValueLinked = (index === 0 && detailPageLink !== undefined)
    ? (
      <Link
        href={getDetailPageLink(detailPageLink, rowKeyField ?? 'slug', row)}
      >
        {innerValue}
      </Link>
      )
    : innerValue
  // If cell is editable
  const innerValueEditableOrNot = (onChange !== undefined && header.isEditable !== false)
    ? (
      <TextField
        value={row[header.field] ?? ''}
        placeholder={header.field.replace(/_/g, ' ')}
        onChange={(event) => onChange(index, header.field, { id: index, name: event.target.value })}
        type='text'
        InputProps={{
          inputProps: {
            step: 0.01,
            style: TEXTFIELD_STYLE
          }
        }}
      />
      )
    : innerValueLinked
  return (
    <TableCell
      component={(index === 0) ? 'th' : undefined}
      scope={(index === 0) ? 'row' : undefined}
      align={align ?? header.align ?? 'left'}
      sx={{ fontSize: '16px' }}
    >
      {innerValueEditableOrNot}
    </TableCell>
  )
}

/* ----- Horizontal ----- */

export const DataTableHorizontal = ({
  headers,
  data,
  title,
  detailPageLink,
  rowKeyField,
  onChange
}: DataTableProps): React.ReactElement => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label='horizontal table'>
        <TableBody>
          {/* A special first row for headers */}
          <TableRow sx={{ backgroundColor: COLORS.BLUE_LIGHT }}>
            <DataTableHeaderCell index={-1} title={title} header={headers[0]} align='left' />
            {data.map((row, rowIndex) => (
              <DataTableHeaderCell
                key={`header-${rowIndex}`}
                index={rowIndex}
                header={headers[0]}
                title={row[headers[0]?.field]}
                align={headers[rowIndex]?.align}
                onChange={onChange}
              />
            ))}
          </TableRow>
          {/* Rest of rows */}
          {headers.slice(1)
            .filter((header) => !(onChange !== undefined && header.isEditable === false))
            .map((header, index) => (
              <TableRow key={index} sx={header.isHorizontalHeader === true ? { backgroundColor: COLORS.GRAY_LIGHT } : null}>
                <DataTableHeaderCell index={index} header={header} align='left' />
                {data.map((row, rowIndex) => (
                  <DataTableCell
                    index={rowIndex}
                    key={`${index}-${rowIndex}`}
                    row={row}
                    header={header}
                    detailPageLink={detailPageLink}
                    rowKeyField={rowKeyField}
                    onChange={onChange}
                  />
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
