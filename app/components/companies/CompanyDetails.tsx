import React from 'react'
import { Container, Grid, Typography } from '@mui/material'

// import { Company } from 'graphql/__generated__/graphql'
import CompanyIntensityChart from '../charts/CompanyIntensityChart'
import CompanyTargetChart from '../charts/CompanyTargetChart'
import { DataTableHorizontal } from '../common/DataTable'
import { Company } from 'types/global'
import { titleCase, formatAmount } from 'lib/strings'
import PageTopBanner from '../page/PageTopBanner'
import StatsGrid from './StatsGrid'
import { Targets } from './Targets'

const DEFAULT_COMPANY: Partial<Company> = {
  company_name: '(company not found)',
  emissions: [],
  targets: []
}

const CompanyDetails = ({ company = DEFAULT_COMPANY as Company, loading = false }: { company?: Company, loading: boolean }): React.ReactElement => {
  const companyName = loading ? '(loading...)' : company.company_name
  const lastEmission = company.emissions[company.emissions.length - 1]

  return (
    <>
      <PageTopBanner subtitle='Company' title={companyName}>
        <StatsGrid emission={lastEmission} />
      </PageTopBanner>
      <Container>
        <Grid container spacing={4} sx={{ padding: { xs: '0 30px', lg: 0 } }} mb={5}>
          <Grid item md={6} xs={12} mt={5}>
            <AmbitionAndDevelopment company={company} />
          </Grid>
          <Grid item md={6} xs={12} mt={5}>
            <Targets company={company} />
          </Grid>

          <Grid item md={6} xs={12}>
            <CompanyIntensityChart company={company} />
          </Grid>
          <Grid item md={6} xs={12}>
            <CompanyTargetChart company={company} />
          </Grid>

          <Grid item xs={12}>
            <RevenueTable company={company} />
          </Grid>
          <Grid item xs={12}>
            <EmissionsOverviewTable company={company} />
          </Grid>
          <Grid item xs={12}>
            <EmissionsDetailsTable company={company} />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
export default CompanyDetails

const AmbitionAndDevelopment = ({ company }: { company: Company }): React.ReactElement => {
  const companyName = titleCase(company?.company_name)
  const lastEmission = company.emissions[company.emissions.length - 1]
  const targetNearTerm = company.targets.find(target => target.target === 'near-term')
  const targetNetZero = company.targets.find(target => target.target === 'net-zero')
  const intensity = lastEmission?.emission_intensity
  // console.log({ targetNearTerm, targetNetZero, lastEmission })

  const ambitionAndDevelopment = lastEmission !== undefined
    ? [
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
    `In ${lastEmission?.year as number}, ${companyName} reported a total of ${formatAmount(lastEmission?.total_reported_emission_scope_1_2_3)} ton CO₂e, and a net revenue of ${formatAmount(lastEmission?.revenue)} M USD, resulting in a emissions intensity of ${formatAmount(intensity)} t CO₂e / M USD.`
    // `Based on currently available data, ${companyName} is trending above its near term target, reducing its emissions on average with 4% / year.`,
      ].join(' ')
    : '(No emission data available)'

  return (
    <>
      <Typography variant='h2'>Ambition & Development</Typography>
      <Typography variant='body2'>{ambitionAndDevelopment}</Typography>
    </>
  )
}

const RevenueTable = ({ company }: { company: Company }): React.ReactElement => {
  return (
    <DataTableHorizontal
      title='Revenue'
      headers={[
        { field: 'year', label: 'Year', align: 'right' },
        { field: 'revenue', label: 'Net Revenue (M USD)', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'source_revenue', label: 'Revenue Source', type: 'link', align: 'right' }
      ]}
      data={company.emissions}
    />
  )
}

const EmissionsOverviewTable = ({ company }: { company: Company }): React.ReactElement => {
  return (
    <DataTableHorizontal
      title='Emissions Overview'
      headers={[
        { field: 'year', label: 'Year', align: 'right' },
        { field: 'total_emission_market_based', label: 'Total Emissions - Market Based (t CO₂e)', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'emission_intensity', label: 'Emissions Intensity (t CO₂e / M USD)', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cradle_to_gate', label: 'Cradle-to-gate Intensity (t CO₂e / M USD)', align: 'right', format: (value: number): string => formatAmount(value) }
      ]}
      data={company.emissions}
    />
  )
}

const EmissionsDetailsTable = ({ company }: { company: Company }): React.ReactElement => {
  return (
    <DataTableHorizontal
      title='Emissions Details'
      headers={[
        { field: 'year', label: 'Year', align: 'right' },
        { field: 'scope_1', label: 'Scope 1', align: 'right', format: (value: number): string => formatAmount(value) },

        { field: 'just_header', label: 'Scope 2', isHorizontalHeader: true, align: 'right' },
        { field: 'scope_2_location_based', label: 'Scope 2 - Location Based', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'scope_2_market_based', label: 'Scope 2 - Market Based', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'scope_2_unknown', label: 'Scope 2 - Not specified', align: 'right', format: (value: number): string => formatAmount(value) },

        { field: 'total_scope_3', label: 'Scope 3', isHorizontalHeader: true, align: 'right', format: (value: number): string => formatAmount(value) },

        { field: 'just_header', label: 'Upstream Emissions', isHorizontalHeader: true, align: 'right' },
        { field: 'cat_1', label: '1. Purchased goods and services', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cat_2', label: '2. Capital goods', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cat_3', label: '3. Fuel- and energy-related activities', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cat_4', label: '4. Upstream transportation and distribution', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cat_5', label: '5. Waste generated in operations', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cat_6', label: '6. Business travel', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cat_7', label: '7. Employee commuting', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cat_8', label: '8. Upstream leased assets', align: 'right', format: (value: number): string => formatAmount(value) },

        { field: 'just_header', label: 'Downstream Emissions', isHorizontalHeader: true, align: 'right' },
        { field: 'cat_9', label: '9. Downstream transportation and distribution', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cat_10', label: '10. Processing of sold products', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cat_11', label: '11. Use of sold products', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cat_12', label: '12. End-of-life treatment of sold products', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cat_13', label: '13. Downstream leased assets', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cat_14', label: '14. Franchises', align: 'right', format: (value: number): string => formatAmount(value) },
        { field: 'cat_15', label: '15. Investments', align: 'right', format: (value: number): string => formatAmount(value) },

        { field: 'total_reported_emission_scope_1_2_3', label: 'Total Emissions', isHorizontalHeader: true, align: 'right', format: (value: number): string => formatAmount(value) },

        { field: 'source_emission_link', label: 'Emission Source', type: 'link', align: 'right' }
      ]}
      data={company.emissions}
    />
  )
}
