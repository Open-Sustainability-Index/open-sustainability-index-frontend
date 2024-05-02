import React, { useState } from 'react'
import { Typography, Box } from '@mui/material'
import { Company } from 'types/global'
import { COLORS } from 'app/theme/theme'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

export function Targets ({ company: { targets, commitment } }: { company: Company }): React.ReactElement {
  const [visibleTarget, setVisibleTarget] = useState(0)

  const handleChange = (event: SelectChangeEvent): void => {
    setVisibleTarget(event.target.value as unknown as number)
  }

  return (
    <>
      <Typography variant='h2' mb={2}>Targets</Typography>
      <Box sx={{ backgroundColor: COLORS.PURPLE_DARKER, color: COLORS.WHITE, borderRadius: '.5em', fontSize: '16px' }} p={4}>

        <FormControl fullWidth>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={visibleTarget as unknown as string}
            onChange={handleChange}
            sx={{ color: COLORS.WHITE }}
          >
            {targets.map((target, index) =>
              <MenuItem value={index} key={index}>{target.target}</MenuItem>
            )}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex' }} p={2}>
          {targets[visibleTarget] &&
            <Box mr={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px !important' }}>
                <Typography>Base year: </Typography>
                <Typography>{targets[visibleTarget].base_year}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Target year: </Typography>
                <Typography>{targets[visibleTarget].target_year}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Reduction: </Typography>
                <Typography>{targets[visibleTarget].target_value}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Classification: </Typography>
                <Typography>{targets[visibleTarget].target_classification}</Typography>
              </Box>
            </Box>}
          <Box sx={{ flex: 1 }}>
            {targets[visibleTarget] &&
              <Typography>{targets[visibleTarget].target_wording}</Typography>}
          </Box>
        </Box>
      </Box>
    </>
  )
}
