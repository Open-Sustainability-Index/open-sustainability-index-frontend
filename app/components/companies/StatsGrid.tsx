import { Grid, Typography, Box } from '@mui/material'
import { Emission } from 'types/global'

export default function StatsGrid ({ emission }: { emission: Emission }) {
  return (
    <Box sx={{ flexGrow: 1 }} pb={3}>
      <Grid container spacing={4}>
        {/* Each pair of number and label is a Grid item */}
        <StatsBlock value={emission.year} description='Quick facts' />
        <StatsBlock value={emission.scope_1} description='ton CO₂e' />
        <StatsBlock value={emission.revenue} description='Revenue MUSD' />
        <StatsBlock value={(emission.year / parseInt(emission.revenue)).toFixed(2)} description='t CO₂e / MUSD' />
      </Grid>
    </Box>
  )
};

function StatsBlock ({ value, description }: { value: string | number, description: string }) {
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
