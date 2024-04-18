import React from 'react'
import {
  Box,
  TextField,
  Stack
} from '@mui/material'
import dayjs from 'dayjs'

const DATE_UNKNOWN = 'unknown'
export const userDate = (date: Date | null | undefined, defaultToUnknown = true): string | undefined => (date !== null && date !== undefined) ? dayjs(date).format('YYYY-MM-DD') : (defaultToUnknown ? DATE_UNKNOWN : undefined)

interface DatePeriodInputProps {
  dateFrom: Date
  setDateFrom: (date: Date) => void
  dateTo: Date
  setDateTo: (date: Date) => void
}

function DatePeriodInput ({
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo
}: DatePeriodInputProps): React.ReactElement {
  const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    const inputDate = new Date(target.value)
    const dateToOrNow = dateTo ?? new Date()
    switch (target.name) {
      case 'dateFrom':
        setDateFrom?.(inputDate < dateToOrNow ? inputDate : dateToOrNow)
        break
      case 'dateTo':
        setDateTo?.(inputDate)
        break
    }
  }

  return (
    <Stack spacing={2} direction='row' justifyContent='start' alignItems='center' sx={{ py: 1 }}>
      <TextField
        name='dateFrom'
        type='date'
        value={userDate(dateFrom)}
        onChange={handleInputChange}
      />
      <Box>-</Box>
      <TextField
        name='dateTo'
        type='date'
        value={userDate(dateTo)}
        onChange={handleInputChange}
      />
    </Stack>
  )
}
export default DatePeriodInput
