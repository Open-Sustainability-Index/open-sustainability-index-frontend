import React from 'react'
import { useTheme, useMediaQuery } from '@mui/material'
import { ChartsLegend, AllSeriesType } from '@mui/x-charts'
// import { ChartContainer } from '@mui/x-charts/ChartContainer'
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer'
import { BarPlot } from '@mui/x-charts/BarChart'
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart'
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis'

import { COLORS } from 'app/theme/theme'
import { Company } from 'types/global'

const CompanyChart = ({ company }: { company: Company }): React.ReactElement | null => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  if (company === undefined || company.emissions.length === 0) {
    return null
  }

  const cleanValue = (value: string): number => {
    console.log('cleanValue:', value, value?.replace(/\s/g, ''), parseInt(value?.replace(/\s/g, '')))
    return parseInt(value?.replace(/\s/g, ''))
  }

  const dataLabels = company.emissions.map((company) => company.year)
  const emissions = company.emissions.map((company) => cleanValue(company.scope_1) / 100)
  const revenue = company.emissions.map((company) => cleanValue(company.revenue))
  const intensity = emissions.map((emission, index) => emission / revenue[index] * 50000)
  console.log('companyHistory:', { emissions, revenue, intensity }, company)

  // Gather data values and labels
  const dataValues: AllSeriesType[] = [
    {
      label: 'Emissions',
      type: 'bar',
      color: COLORS.PINK_LIGHT,
      data: emissions
    },
    {
      label: 'Revenue',
      type: 'bar',
      color: COLORS.PURPLE_LIGHT,
      data: revenue
    },
    {
      label: 'Intensity',
      type: 'line',
      color: COLORS.PURPLE_DARK,
      data: intensity
    }
  ]

  // const Container = isSmallScreen ? ResponsiveChartContainer : ChartContainer
  const sizingProps = isSmallScreen ? {} : { width: 500, height: 300 }

  return (
    <>
      <ResponsiveChartContainer
        series={dataValues}
        xAxis={[
          {
            data: dataLabels,
            scaleType: 'band',
            id: 'x-axis-id'
          }
        ]}
        {...sizingProps}
      >
        <BarPlot />
        <LinePlot />
        <MarkPlot />
        <ChartsXAxis
          label='Years'
          position='bottom'
          axisId='x-axis-id'
        />
        <ChartsLegend direction='row' />
      </ResponsiveChartContainer>
    </>
  )
}

export default CompanyChart
