import React from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

interface DateIntervalInputProps {
  dateInterval: string
  setDateInterval: (dateInterval: string) => void
}

const DateIntervalInput = ({ dateInterval, setDateInterval }: DateIntervalInputProps): React.ReactElement => {
  const handlePeriod = (event: React.MouseEvent<HTMLElement>, newPeriod: string): void => {
    if (newPeriod !== null) {
      setDateInterval?.(newPeriod)
    }
  }

  return (
    <ToggleButtonGroup
      value={dateInterval}
      exclusive
      onChange={handlePeriod}
      aria-label='period'
    >
      <ToggleButton value='year' aria-label='year'>Year</ToggleButton>
      <ToggleButton value='month' aria-label='month'>Month</ToggleButton>
      <ToggleButton value='week' aria-label='week'>Week</ToggleButton>
      <ToggleButton value='day' aria-label='day'>Day</ToggleButton>
    </ToggleButtonGroup>
  )
}

export default DateIntervalInput
