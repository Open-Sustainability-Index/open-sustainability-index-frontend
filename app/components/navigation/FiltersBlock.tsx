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
import industries from 'app/services/industries.json'

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
      { label: '(all)', value: '' },
      ...industries.map((industry) => ({ value: industry.name }))
    ]
  },
  {
    label: 'Jurisdiction',
    value: 'jurisdiction',
    options: [
      { label: '(all)', value: '' },
      { value: 'World-wide' }
    ]
  },
  {
    label: 'Org. type',
    value: 'organization_type',
    options: [
      { label: '(all)', value: '' },
      { value: 'SME' },
      { value: 'Company' },
      { value: 'Financial Institution' }
    ]
  },
  {
    label: 'Near-term',
    value: 'near-term',
    options: [
      { label: '(all)', value: '' },
      { value: 'Active', label: 'Committed' },
      { value: 'Target set', label: 'Target Set' },
      { value: 'Removed' }
    ]
  },
  {
    label: 'Net zero',
    value: 'net-zero',
    options: [
      { label: '(all)', value: '' },
      { value: 'Active', label: 'Committed' },
      { value: 'Target set', label: 'Target Set' },
      { value: 'Removed' }
    ]
  },
  {
    label: 'Year',
    value: 'year',
    options: [
      { label: '(all)', value: '' },
      { value: '2023' },
      { value: '2022' }
    ]
  },
  {
    label: 'Currency',
    value: 'currency',
    options: [
      { label: '(all)', value: '' },
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
