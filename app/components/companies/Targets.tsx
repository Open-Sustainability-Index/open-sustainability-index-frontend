import React, { useState } from 'react'
import { Typography, Box, InputBase, styled } from '@mui/material'
import { Company } from 'types/global'
import { COLORS } from 'app/theme/theme'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import NextMUILink from '../navigation/NextMUILink'

export function Targets ({ company: { targets, commitment } }: { company: Company }): React.ReactElement {
  const [visibleTarget, setVisibleTarget] = useState(0)

  const handleChange = (event: SelectChangeEvent): void => {
    setVisibleTarget(event.target.value as unknown as number)
  }

  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
      border: '1px solid white',
      padding: '10px 26px 10px 12px',
      '&:hover': {
        outline: '1px solid white'
      }
    }
  }))

  return (
    <>
      <Typography variant='h2' mb={2}>Targets</Typography>
      {(targets.length > 0)
        ? (
          <Box sx={{ background: COLORS.PURPLE_GRADIENT, color: COLORS.WHITE, borderRadius: '.5em', fontSize: '16px' }} p={4}>

            <FormControl fullWidth>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={visibleTarget as unknown as string}
                onChange={handleChange}
                sx={{
                  color: COLORS.WHITE,
                  '& .MuiSelect-icon': {
                    color: COLORS.WHITE
                  }
                }}
                input={<BootstrapInput />}
              >
                {targets.map((target, index) =>
                  <MenuItem value={index} key={index}>{target.target} for {target.target_year} (scope {target.scope})</MenuItem>
                )}
              </Select>
            </FormControl>

            <Box sx={{ display: { lg: 'flex' } }} p={2}>
              {targets[visibleTarget] !== undefined &&
                <Box mr={4}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Typography fontSize='1em'>Base year: </Typography>
                    <Typography fontSize='1.1em' fontWeight={600}>{targets[visibleTarget].base_year}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Typography fontSize='1em'>Target year: </Typography>
                    <Typography fontSize='1.1em' fontWeight={600}>{targets[visibleTarget].target_year}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Typography fontSize='1em'>Reduction: </Typography>
                    <Typography fontSize='1.1em' fontWeight={600}>{targets[visibleTarget].target_value}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Typography fontSize='1em'>Classification: </Typography>
                    <Typography fontSize='1.1em' fontWeight={600}>&nbsp;{targets[visibleTarget].target_classification}</Typography>
                  </Box>
                </Box>}
              <Box sx={{ flex: 1, marginTop: { xs: '10px', lg: 0 } }}>
                {targets[visibleTarget] !== undefined &&
                  <Typography fontSize='1.1em'>{targets[visibleTarget].target_wording}</Typography>}
              </Box>
            </Box>
            <Box sx={{ flex: 1, marginTop: { xs: '10px', lg: 0 }, px: 2 }}>
              <Typography fontSize='1em'>Source: <NextMUILink sx={{ color: COLORS.WHITE }} href='https://sciencebasedtargets.org/'>Science Based Target initative</NextMUILink></Typography>
            </Box>
          </Box>
          )
        : (
          <Typography variant='body2'>(No target data available)</Typography>
          )}
    </>
  )
}
