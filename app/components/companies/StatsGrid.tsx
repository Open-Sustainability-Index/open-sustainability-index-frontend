import { Grid, Typography, Box } from '@mui/material'

import { Emission } from 'types/global'

export default function StatsGrid ({ emission }: { emission: Emission }): React.ReactElement {
  return (
    <Box sx={{ flexGrow: 1 }} pb={3}>
      <Grid container spacing={4}>
        {/* Each pair of number and label is a Grid item */}
        <StatsBlock value={emission?.year} description='Quick facts' />
        <StatsBlock value={emission?.total_reported_emission_scope_1_2_3?.toLocaleString('en')} description='Emissions (ton CO₂e)' />
        <StatsBlock value={emission?.revenue?.toLocaleString('en')} description='Revenue (M USD)' />
        <StatsBlock value={emission?.emission_intensity?.toLocaleString('en')} description='Intensity (t CO₂e / M USD)' />
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
