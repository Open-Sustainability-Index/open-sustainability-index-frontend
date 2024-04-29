import React from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery
} from '@mui/material'

import { changeQueryString } from 'lib/strings'

interface FilterField {
  value: string
  label: string
  options: Array<{ value: string, label?: string }>
}

const filterFields = [
  {
    label: 'Industry',
    value: 'industry',
    options: [
      { label: 'All Industries', value: '' },
      { value: 'Construction' }
    ]
  },
  {
    label: 'Jurisdiction',
    value: 'jurisdiction',
    options: [
      { label: 'All Jurisdictions', value: '' }
      // Add other options here...
    ]
  },
  {
    label: 'Org. type',
    value: 'orgType',
    options: [
      { label: 'All Org. Types', value: '' },
      { value: 'SME' },
      { value: 'Company' },
      { value: 'Financial Institution' }
    ]
  },
  {
    label: 'Net zero',
    value: 'netZero',
    options: [
      { label: 'All Targets', value: '' }
      // Add other options here...
    ]
  },
  {
    label: 'Near-term',
    value: 'nearTerm',
    options: [
      { label: 'All Targets', value: '' }
      // Add other options here...
    ]
  },
  {
    label: 'Year',
    value: 'year',
    options: [
      { value: '2023' },
      { value: '2022' }
    ]
  },
  {
    label: 'Currency',
    value: 'currency',
    options: [
      { value: 'EUR' },
      { value: 'USD' },
      { value: 'SEK' }
    ]
  }
]

const FiltersBlock = (): React.ReactElement | null => {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  if (isMobile) {
    return null
  }

  const handleChange = (field: string, value: string): void => {
    const newPath = router.pathname + '?' + changeQueryString(router.query, field, value)
    void router.push(newPath)
  }

  return (
    <Container>
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: 'center',
          marginTop: '0.5em'
        }}
      >
        {filterFields.map((field) => (
          <FilterSection
            key={field.value}
            field={field}
            value={router.query[field.value] as string}
            onChange={handleChange}
          />
        ))}
      </Grid>
    </Container>
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
          sx={{ fontSize: '14px' }}
        >
          {field.options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{ fontSize: '14px' }}
            >
              {option.label ?? option.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  )
}
