import React from 'react'
import { useTheme, useMediaQuery, Theme, Typography } from '@mui/material'
import {
  // ChartContainer
  ResponsiveChartContainer,
  ChartsLegend,
  AllSeriesType,
  ChartsXAxis,
  ChartsYAxis,
  ChartsGrid,
  ChartsTooltip,
  BarPlot,
  LinePlot,
  MarkPlot
  // legendClasses
  // barElementClasses,
  // lineElementClasses
} from '@mui/x-charts'

import { COLORS } from 'app/theme/theme'
import { Company } from 'types/global'
// import { parseFloatSpaces } from 'lib/strings'
import PaperCard from '../common/PaperCard'

const fillArray = (length: number, expression: (index: number) => any): any[] => [...Array(length)].map(
  (empty, index) => expression(index)
)

const parseTargetValue = (targetValue: string | undefined, lastEmission: number): number => {
  const rawValue = parseFloat((targetValue ?? '0').replace(/[^0-9.]/g, ''))
  const value = targetValue?.includes('%') === true
    ? rawValue * 0.01 * lastEmission
    : rawValue * lastEmission
  return Math.round(value)
}

const CompanyTargetChart = ({ company }: { company: Company }): React.ReactElement | null | string => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // Find largest target year
  // const targetYear = company.targets.reduce((results: number, target): number => ((target?.target_year ?? 0) > results ? (target?.target_year ?? 0) : results), 0)
  const target = company.targets.find((target) => target.target === 'Near-term')
  const targetYear = target?.target_year ?? 0
  const emFirstYear = company.emissions[0]?.year ?? 0
  const emLastYear = company.emissions[company.emissions.length - 1]?.year ?? 0
  console.log('CompanyTargetChart:', { emFirstYear, targetYear, target })

  if (company === undefined) {
    return null
  }
  if (company.emissions.length === 0 || emFirstYear === 0 || targetYear === 0) {
    return <Typography variant='body2'>(No emissions data available)</Typography>
  }

  const dataLabels = fillArray(targetYear - emFirstYear + 1, (index) => emFirstYear + index)
  const emissions = company.emissions.map((company) => company.total_reported_emission_scope_1_2_3)
  const lastEmission = emissions[emissions.length - 1] ?? 0
  const targetEmission = parseTargetValue(target?.target_value, lastEmission ?? 0)
  const emissionReductionPerYear = Math.round((lastEmission - targetEmission) / (targetYear - emLastYear + 1))
  const emissionsProjected = fillArray(targetYear - emFirstYear + 1, (index) => {
    if (index <= emLastYear - emFirstYear) {
      return null
    }
    return lastEmission - ((index - 1) * emissionReductionPerYear)
  })
  const targetLine = fillArray(targetYear - emFirstYear + 1, (index) => {
    if (index === emLastYear - emFirstYear) {
      return lastEmission
    }
    if (index === targetYear - emFirstYear) {
      return targetEmission
    }
    return null
  })

  console.log('CompanyTargetChart:', { emLastYear, lastEmission, targetYear, targetEmission, emissionReductionPerYear })

  // Gather data values and labels
  const dataSeries: AllSeriesType[] = [
    {
      label: 'Emissions',
      type: 'bar',
      color: COLORS.TURQUOISE_MEDIUM,
      data: emissions
    },
    {
      label: 'Projected',
      type: 'bar',
      color: COLORS.TURQUOISE_LIGHT,
      data: emissionsProjected
    },
    {
      label: 'Tracking near-term target',
      type: 'line',
      color: COLORS.PURPLE_DARK,
      data: targetLine,
      connectNulls: true
    }
  ]

  // const Container = isSmallScreen ? ResponsiveChartContainer : ChartContainer
  const sizingProps = isSmallScreen
    ? { width: 380, height: 300, margin: { left: 70, right: 70 } }
    : { width: 500, height: 500, margin: { left: 80, right: 100 } }

  return (
    <PaperCard>
      <Typography variant='body2'>Emissions, Target & Trend</Typography>
      <ResponsiveChartContainer
        series={dataSeries}
        xAxis={[
          {
            data: dataLabels,
            scaleType: 'band',
            id: 'x-axis-id'
          }
        ]}
        yAxis={[
          { id: 'emissionsAxis', scaleType: 'linear' }
        ]}
        {...sizingProps}
      >
        <BarPlot
          sx={(theme: Theme) => ({
            // [`.${barElementClasses.root}`]: {
            //   fill: 'red',
            //   strokeWidth: 2
            // },
            rx: 6,
            ry: 6,
            width: 6
          })}
        />
        <LinePlot />
        <MarkPlot />
        <ChartsGrid horizontal />
        <ChartsXAxis position='bottom' />
        <ChartsYAxis
          axisId='emissionsAxis'
          label='t CO₂'
          position='left'
          labelStyle={{
            fontSize: '12px',
            transform: 'rotate(0deg) translate(10px, -215px)',
            textAlign: 'right',
            fill: COLORS.GRAY_LIGHTER
          }}
        />
        <ChartsLegend
          direction='row'
          itemMarkWidth={10}
          itemMarkHeight={10}
          slotProps={{
            legend: {
              labelStyle: {
                fontSize: '12px',
                fontWeight: 'normal',
                fill: COLORS.GRAY_LIGHTER
              },
              markGap: 6,
              itemGap: 20
            }
          }}
          sx={(theme: Theme) => ({
            // [`.${legendClasses.root}`]: {
            //   rx: 20,
            //   ry: 20
            // },
            // [`.${legendClasses.root} text`]: {
            //   fontSize: '10px'
            // },
            // rx: 20,
            // ry: 20
          })}
        />
        <ChartsTooltip />
      </ResponsiveChartContainer>
    </PaperCard>
  )
}

export default CompanyTargetChart
