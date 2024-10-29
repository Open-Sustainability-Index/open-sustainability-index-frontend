import { Grid, Typography, Box } from '@mui/material'

import { ViewEmission } from 'types/global'
import { formatAmount } from 'lib/strings'

export default function StatsGrid ({ emission }: { emission: ViewEmission }): React.ReactElement {
  return (
    <Box sx={{ flexGrow: 1 }} pb={3}>
      <Grid container spacing={4}>
        {/* Each pair of number and label is a Grid item */}
        <StatsBlock value={emission?.year} description='Quick facts' />
        <StatsBlock value={formatAmount(emission?.total_reported_emission_scope_1_2_3)} description='Emissions (ton CO₂e)' />
        <StatsBlock value={formatAmount(emission?.revenue)} description='Revenue (M USD)' />
        <StatsBlock value={formatAmount(emission?.emission_intensity)} description='Intensity (t CO₂e / M USD)' />
      </Grid>
    </Box>
  )
};

function StatsBlock ({ value, description }: { value?: string | number | null, description: string }): React.ReactElement {
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
