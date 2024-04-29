import React from 'react'
import { useRouter } from 'next/router'
import { Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material'

import { changeQueryString } from 'lib/strings'

interface FilterField {
  label: string
  value: string
  options: Array<{ label: string, value: string }>
}

const filterFields = [
  {
    label: 'Industry',
    value: 'industry',
    options: [
      { label: 'All Industries', value: 'all' }
      // Add other options here...
    ]
  },
  {
    label: 'Jurisdiction',
    value: 'jurisdiction',
    options: [
      { label: 'All Jurisdictions', value: 'all' }
      // Add other options here...
    ]
  },
  {
    label: 'Org. type',
    value: 'orgType',
    options: [
      { label: 'All Org. Types', value: 'all' }
      // Add other options here...
    ]
  },
  {
    label: 'Net zero',
    value: 'netZero',
    options: [
      { label: 'All Targets', value: 'all' }
      // Add other options here...
    ]
  },
  {
    label: 'Near-term',
    value: 'nearTerm',
    options: [
      { label: 'All Targets', value: 'all' }
      // Add other options here...
    ]
  },
  {
    label: 'Year',
    value: 'year',
    options: [
      { label: '2023', value: '2023' },
      { label: '2022', value: '2022' }
    ]
  },
  {
    label: 'Currency',
    value: 'currency',
    options: [
      { label: 'EUR', value: 'EUR' },
      { label: 'USD', value: 'USD' },
      { label: 'SEK', value: 'SEK' }
    ]
  }
]

const FiltersBlock = (): React.ReactElement => {
  const router = useRouter()

  const handleChange = (field: string, value: string): void => {
    const newPath = router.pathname + '?' + changeQueryString(router.query, field, value)
    void router.push(newPath)
  }

  return (
    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: 'center',
        marginTop: '1em'
      }}
    >
      {filterFields.map((field) => (
        <FilterSection
          key={field.value}
          field={field}
          value='jurisdiction'
          onChange={handleChange}
        />
      ))}
    </Grid>
  )
}

export default FiltersBlock

interface FilterSectionProps {
  field: FilterField
  value: string
  onChange: (field: string, value: string) => void
}

const FilterSection = ({ field, value, onChange }: FilterSectionProps): React.ReactElement => {
  return (
    <Grid item xs={12} sm={3}>
      <FormControl fullWidth>
        <InputLabel>{field.label}</InputLabel>
        <Select
          value={value}
          onChange={(event) => onChange(field.value, event.target.value)}
          label={field.label}
          sx={{ fontSize: '18px' }}
        >
          {field.options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{ fontSize: '18px' }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  )
}
