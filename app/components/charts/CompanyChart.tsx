import React from 'react'
import { useTheme, useMediaQuery } from '@mui/material'
import { ChartsLegend } from '@mui/x-charts'
import { ChartContainer } from '@mui/x-charts/ChartContainer'
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer'
import { BarPlot } from '@mui/x-charts/BarChart'
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart'
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis'

import { COLORS } from 'app/theme/theme'

const CompanyChart = ({ company }: { company: Company }): React.ReactElement | null => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // Gather data values and labels
  const dataValues = [
    {
      label: 'Emissions',
      type: 'bar',
      color: COLORS.PINK_LIGHT,
      data: [30, 25, 20]
    },
    {
      label: 'Revenue',
      type: 'bar',
      color: COLORS.PURPLE_LIGHT,
      data: [10, 20, 30]
    },
    {
      label: 'Intensity',
      type: 'line',
      color: COLORS.PURPLE_DARK,
      data: [10, 20, 30]
    }
  ]
  const dataLabels = ['2020', '2021', '2022']

  const Container = isSmallScreen ? ResponsiveChartContainer : ChartContainer
  const sizingProps = isSmallScreen ? {} : { width: 500, height: 300 }

  return (
    <>
      <Container
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
      </Container>
    </>
  )
}

export default CompanyChart
