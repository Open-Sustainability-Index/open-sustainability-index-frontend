import React from 'react';
import { useTheme, useMediaQuery, Theme, Typography } from '@mui/material';
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
  MarkPlot,
  // legendClasses
  // barElementClasses,
  // lineElementClasses
} from '@mui/x-charts';

import { COLORS } from 'app/theme/theme';
import { Company } from 'types/global';
import { formatAmount } from 'lib/strings';
import PaperCard from '../common/PaperCard';

const fillArray = (length: number, expression: (index: number) => any): any[] =>
  [...Array(length)].map((empty, index) => expression(index));

// const parseTargetValue = (targetValue: string | undefined, lastEmission: number): number => {
//   const rawValue = parseFloat((targetValue ?? '0').replace(/[^0-9.]/g, ''))
//   const value = targetValue ?.includes('%') === true
//     ? rawValue * 0.01 * lastEmission
//     : rawValue * lastEmission
//   return Math.round(value)
// }

const CompanyTargetChart = ({
  company,
}: {
  company: Company;
}): React.ReactElement | null | string => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Find largest target year
  // const targetYear = company.targets.reduce((results: number, target): number => ((target?.target_year ?? 0) > results ? (target?.target_year ?? 0) : results), 0)
  const target = company.targets.find((target) => target.target === 'Near-term');
  const targetYear = target?.target_year ?? 0;
  const firstYear = company.emissions[0]?.year ?? 0;
  // const lastYear = company.emissions[company.emissions.length - 1] ?.year ?? 0
  console.log('CompanyTargetChart (1):', { firstYear, targetYear, targets: company.targets });

  if (company === undefined) {
    return null;
  }
  if (company.emissions.length === 0 || firstYear === 0) {
    return <Typography variant='body2'>(No emissions data available to show graph)</Typography>;
  }
  if (targetYear === 0) {
    return <Typography variant='body2'>(No target data available to show graph)</Typography>;
  }

  // const lastEmission = company.emissions[company.emissions.length - 1] ?.total_reported_emission_scope_1_2_3 ?? 0
  // const targetEmission = parseTargetValue(target ?.target_value, lastEmission ?? 0)
  // const emissionReductionPerYear = Math.round((lastEmission - targetEmission) / (targetYear - lastYear + 1))

  // Construct data series
  const dataLabels = fillArray(targetYear - firstYear + 1, (index) => firstYear + index);
  const emissionsHistory = dataLabels.map((year) => {
    const emission = company.emissions.find(
      (emission) => emission.year === year,
    )?.total_reported_emission_scope_1_2_3;
    return emission ?? null;
  });

  // const emissionsProjected = fillArray(targetYear - firstYear + 1, (index) => {
  //   if (index <= lastYear - firstYear) {
  //     return null
  //   }
  //   return lastEmission - ((index - 1) * emissionReductionPerYear)
  // })

  // const targetLine = fillArray(targetYear - firstYear + 1, (index) => {
  //   if (index === lastYear - firstYear) {
  //     return lastEmission
  //   }
  //   if (index === targetYear - firstYear) {
  //     return targetEmission
  //   }
  //   return null
  // })

  // Gather data values and labels
  const dataSeries: AllSeriesType[] = [
    {
      label: 'Emissions',
      type: 'bar',
      color: COLORS.TURQUOISE_MEDIUM,
      data: emissionsHistory,
      valueFormatter: (v: any) => formatAmount(v),
    },
    // {
    //   label: 'Projected',
    //   type: 'bar',
    //   color: COLORS.TURQUOISE_LIGHT,
    //   data: emissionsProjected,
    //   valueFormatter: (v: any) => formatAmount(v)
    // },
    // {
    //   label: 'Near-term target',
    //   type: 'line',
    //   color: COLORS.PURPLE_DARK,
    //   data: targetLine,
    //   connectNulls: true,
    //   valueFormatter: (v: any) => formatAmount(v)
    // }
  ];

  // const Container = isSmallScreen ? ResponsiveChartContainer : ChartContainer
  const sizingProps = isSmallScreen
    ? { width: 380, height: 300, margin: { left: 70, right: 70 } }
    : { width: 500, height: 500, margin: { left: 80, right: 100 } };

  return (
    <PaperCard>
      <Typography variant='body2'>Emissions, Target & Trend</Typography>
      <ResponsiveChartContainer
        series={dataSeries}
        xAxis={[
          {
            data: dataLabels,
            scaleType: 'band',
            id: 'x-axis-id',
            valueFormatter: (v: any) => v.toString(),
          },
        ]}
        yAxis={[{ id: 'emissionsAxis', scaleType: 'linear' }]}
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
            width: 6,
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
            fill: COLORS.GRAY_LIGHTER,
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
                fill: COLORS.GRAY_LIGHTER,
              },
              markGap: 6,
              itemGap: 20,
            },
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
  );
};

export default CompanyTargetChart;
