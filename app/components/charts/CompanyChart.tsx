import React from 'react'
import { useTheme, useMediaQuery } from '@mui/material'
import { ChartsLegend, AllSeriesType } from '@mui/x-charts'
// import { ChartContainer } from '@mui/x-charts/ChartContainer'
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer'
import { BarPlot } from '@mui/x-charts/BarChart'
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart'
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis'

import { COLORS } from 'app/theme/theme'

const CompanyChart = ({ companyHistory }: { companyHistory: Company[] }): React.ReactElement | null => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  if (companyHistory === undefined || companyHistory.length === 0) {
    return null
  }

  const cleanValue = (value: string): number => {
    console.log('cleanValue:', value, value?.replace(/\s/g, ''), parseInt(value?.replace(/\s/g, '')))
    return parseInt(value?.replace(/\s/g, ''))
  }

  const dataLabels = companyHistory.reverse().map((company) => company.Year)
  const emissions = companyHistory.reverse().map((company) => cleanValue(company['Scope 1\n(t CO₂e)']) / 100)
  const revenue = companyHistory.reverse().map((company) => cleanValue(company['Revenue (million)']))
  const intensity = emissions.map((emission, index) => emission / revenue[index] * 50000)
  console.log('companyHistory:', { emissions, revenue, intensity }, companyHistory)

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
