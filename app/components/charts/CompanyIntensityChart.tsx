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

const CompanyIntensityChart = ({ company }: { company: Company }): React.ReactElement | null => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (company === undefined || company.emissions.length === 0) {
    return null;
  }

  const dataLabels = company.emissions.map((company) => company.year);
  const emissions = company.emissions.map((company) => company.total_reported_emission_scope_1_2_3);
  const revenue = company.emissions.map((company) => company.revenue);
  const intensity = company.emissions.map((emission) => emission?.emission_intensity);

  // console.log('CompanyIntensityChart:', { dataLabels, emissions, revenue, intensity })

  // Gather data values and labels
  const dataSeries: AllSeriesType[] = [
    {
      label: 'Emissions',
      type: 'bar',
      color: COLORS.PINK_LIGHT,
      data: emissions,
      valueFormatter: (v: any) => formatAmount(v),
    },
    {
      label: 'Revenue',
      type: 'bar',
      color: COLORS.PURPLE_LIGHT,
      data: revenue,
      yAxisKey: 'revenueAxis',
      valueFormatter: (v: any) => formatAmount(v),
    },
    {
      label: 'Intensity',
      type: 'line',
      color: COLORS.PURPLE_DARK,
      data: intensity,
      yAxisKey: 'intensityAxis',
      connectNulls: true,
      valueFormatter: (v: any) => formatAmount(v),
    },
  ];

  // const Container = isSmallScreen ? ResponsiveChartContainer : ChartContainer
  const sizingProps = isSmallScreen
    ? { width: 380, height: 300, margin: { left: 70, right: 70 } }
    : { width: 500, height: 500, margin: { left: 80, right: 100 } };

  return (
    <PaperCard>
      <Typography variant='body2'>Emissions, Revenue & Intensity</Typography>
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
        yAxis={[
          {
            id: 'emissionsAxis',
            scaleType: 'linear',
          },
          {
            id: 'revenueAxis',
            scaleType: 'linear',
          },
          {
            id: 'intensityAxis',
            scaleType: 'linear',
            min: 0,
          },
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
        <ChartsYAxis
          axisId='revenueAxis'
          label='M USD'
          position='right'
          labelStyle={{
            fontSize: '12px',
            transform: 'rotate(0deg) translate(0px, -215px)',
            textAlign: 'left',
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

export default CompanyIntensityChart;
