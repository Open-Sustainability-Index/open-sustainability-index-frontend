import React from 'react'
import { Container, Grid, Typography } from '@mui/material'

// import { Company } from 'graphql/__generated__/graphql'
import CompanyChart from '../charts/CompanyChart'
import { Company } from 'types/global'
import PageTopBanner from '../page/PageTopBanner'
import StatsGrid from './StatsGrid'

const CompanyDetails = ({ company, title }: { company: Company, title: string }): React.ReactElement => {
  return (
    <>
      <PageTopBanner title='Company' description={company.company_name}>
        <StatsGrid emission={company.emissions[company.emissions.length - 1]} />
      </PageTopBanner>
      <Container>
        <Grid container spacing={4}>
          <Grid item md={6} xs={12}>
            <Typography variant='h2'>Ambition  & Development</Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant='h2'>Targets</Typography>
          </Grid>
          <Grid item xs={12}>
            <CompanyChart company={company} />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
export default CompanyDetails
