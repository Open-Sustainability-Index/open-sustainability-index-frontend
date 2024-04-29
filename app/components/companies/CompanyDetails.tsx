import React from 'react'
import { Container, Grid, Typography } from '@mui/material'

// import { Company } from 'graphql/__generated__/graphql'
import CompanyIntensityChart from '../charts/CompanyIntensityChart'
import { DataTableHorizontal } from '../common/DataTable'
import { Company } from 'types/global'
import { titleCase } from 'lib/strings'
import PageTopBanner from '../page/PageTopBanner'
import StatsGrid from './StatsGrid'

const CompanyDetails = ({ company }: { company: Company }): React.ReactElement => {
  console.log('company:', company)
  const companyName = titleCase(company.company_name)
  const lastEmission = company.emissions[company.emissions.length - 1]
  const targetNearTerm = company.targets.find(target => target.target === 'near-term')
  const targetNetZero = company.targets.find(target => target.target === 'net-zero')

  console.log({ targetNearTerm, targetNetZero, lastEmission })

  return (
    <>
      <PageTopBanner title='Company' description={companyName}>
        <StatsGrid emission={lastEmission} />
      </PageTopBanner>
      <Container>
        <Grid container spacing={4}>
          <Grid item md={6} xs={12}>
            <AmbitionAndDevelopment company={company} />
          </Grid>
          <Grid item md={6} xs={12}>
            <Targets company={company} />
          </Grid>
          <Grid item xs={12}>
            <CompanyIntensityChart company={company} />
          </Grid>
          <Grid item xs={12}>
            <RevenueTable company={company} />
          </Grid>
          <Grid item xs={12}>
            <EmissionsOverviewTable company={company} />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
export default CompanyDetails

const AmbitionAndDevelopment = ({ company }: { company: Company }): React.ReactElement => {
  const companyName = titleCase(company.company_name)
  const lastEmission = company.emissions[company.emissions.length - 1]
  const targetNearTerm = company.targets.find(target => target.target === 'near-term')
  const targetNetZero = company.targets.find(target => target.target === 'net-zero')
  const intensity = lastEmission.emission_intensity
  console.log({ targetNearTerm, targetNetZero, lastEmission })

  const ambitionAndDevelopment = [
    (targetNetZero !== undefined || targetNearTerm !== undefined)
      ? (
          [
          `${companyName} has set`,
          [
            ...(targetNetZero !== undefined ? [`a Net Zero-target for ${targetNetZero?.target_year},`] : []),
            ...(targetNearTerm !== undefined ? [`a near-term target to reduce it’s scope 1+2+3 emissions with ${targetNearTerm?.target_value} to ${targetNearTerm?.target_year}, from its base year ${targetNearTerm?.base_year}.`] : [])
          ].join(' and ')
          ].join(' '))
      : '',
    `In ${lastEmission.year as number}, ${companyName} reported a total of ${lastEmission?.total_reported_emission_scope_1_2_3 as number} ton CO₂e, and a net revenue of ${lastEmission.revenue as number} M USD, resulting in a emissions intensity of ${intensity as number} t CO₂e / M USD.`
    // `Based on currently available data, ${companyName} is trending above its near term target, reducing its emissions on average with 4% / year.`,
  ].join(' ')
  return (
    <>
      <Typography variant='h2'>Ambition & Development</Typography>
      <Typography variant='body2'>{ambitionAndDevelopment}</Typography>
    </>
  )
}

const Targets = ({ company }: { company: Company }): React.ReactElement => {
  return (
    <Typography variant='h2'>Targets</Typography>
  )
}

const RevenueTable = ({ company }: { company: Company }): React.ReactElement => {
  return (
    <DataTableHorizontal
      headers={[
        { field: 'year', label: 'Revenue' },
        { field: 'revenue', label: 'Net Revenue (M USD)' },
        { field: 'source_revenue', label: 'Revenue Source', type: 'link' }
      ]}
      data={company.emissions}
    />
  )
}

const EmissionsOverviewTable = ({ company }: { company: Company }): React.ReactElement => {
  return (
    <DataTableHorizontal
      headers={[
        { field: 'year', label: 'Emissions Overview' },
        { field: 'total_emission_market_based', label: 'Total Emissions - MB (t CO₂e)' },
        { field: 'emission_intensity', label: 'Emissions Intensity (t CO₂e / M USD)' },
        { field: 'cradle_to_gate:', label: 'Cradle-to-gate Intensity (t CO₂e / M USD)' }
      ]}
      data={company.emissions}
    />
  )
}

/*
const TemplateComponent = ({ company }: { company: Company }): React.ReactElement => {
  return (

  )
}
*/
