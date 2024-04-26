import { Grid, Typography, Box } from '@mui/material'

import { Emission } from 'types/global'
import { parseFloatSpaces } from 'lib/strings'

export default function StatsGrid ({ emission }: { emission: Emission }): React.ReactElement {
  const intensity = (parseFloatSpaces(emission?.['total_reported_emission_scope_1+2+3']) / parseFloatSpaces(emission?.revenue)).toFixed(1)
  return (
    <Box sx={{ flexGrow: 1 }} pb={3}>
      <Grid container spacing={4}>
        {/* Each pair of number and label is a Grid item */}
        <StatsBlock value={emission?.year} description='Quick facts' />
        <StatsBlock value={emission?.['total_reported_emission_scope_1+2+3']} description='Emissions (ton CO₂e)' />
        <StatsBlock value={emission?.revenue} description='Revenue (M USD)' />
        <StatsBlock value={isNaN(intensity as any) ? undefined : intensity} description='Intensity (t CO₂e / M USD)' />
      </Grid>
    </Box>
  )
};

function StatsBlock ({ value, description }: { value?: string | number, description: string }): React.ReactElement {
  return (
    <Grid item xs={6} sm={3} mt={6}>
      <Typography variant='h6' fontWeight='bold' color='primary'>
        {value}
      </Typography>
      <Typography variant='caption' gutterBottom>
        {description}
      </Typography>
    </Grid>
  )
}
