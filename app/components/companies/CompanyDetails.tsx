import React from 'react'

// import { Company } from 'graphql/__generated__/graphql'
import CompanyChart from '../charts/CompanyChart'
import { Company } from 'types/global'
import { Box, Typography } from '@mui/material'
import PageTopBanner from '../page/PageTopBanner'
import StatsGrid from './StatsGrid'

const CompanyDetails = ({ company, title }: { company: Company, title: string }): React.ReactElement => {
  return (
    <>
      <PageTopBanner title='Company' description={company.company_name}>
        <StatsGrid emission={company.emissions[company.emissions.length - 1]} />
      </PageTopBanner>
      <CompanyChart company={company} />
    </>
  )
}
export default CompanyDetails
