import React, { useState } from 'react'
import type { GetStaticPropsResult } from 'next'
import { useTheme, useMediaQuery, Typography, Stack, CircularProgress, Grid } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import dayjs from 'dayjs'

// import { useGetCompaniesStatistics } from 'graphql/collections/statistics/hooks'
import { COLORS } from 'theme/theme'
import DatePeriodInput from 'components/input/DatePeriodInput'
import DateIntervalInput from 'components/input/DateIntervalInput'
import CompanySelect from 'components/companies/CompanySelect'
import PaperCard from 'components/common/PaperCard'

export const DEFAULT_DATE_TO = dayjs(new Date()).add(1, 'month').toDate()
export const DEFAULT_DATE_FROM = dayjs(DEFAULT_DATE_TO).subtract(2, 'month').toDate()

function GraphsPage (): React.ReactElement {
  const [dateFrom, setDateFrom] = useState(DEFAULT_DATE_FROM)
  const [dateTo, setDateTo] = useState(DEFAULT_DATE_TO)
  const [dateInterval, setDateInterval] = useState('day')
  const [selectedCompanyId, setSelectedCompanyId] = useState(1)

  return (
    <>
      <Grid item xs={12}>
        <PaperCard>
          <GraphsSettings
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            dateInterval={dateInterval}
            setDateInterval={setDateInterval}
            selectedCompanyId={selectedCompanyId}
            setSelectedCompanyId={setSelectedCompanyId}
          />
        </PaperCard>
      </Grid>

      {/* Row 1 */}
      <Grid container columnSpacing={0}>
        <Grid item md={6} xs={12}>
          <h2>Companies</h2>
          <CompaniesOverTimeChart
            startDate={dateFrom}
            endDate={dateTo}
            dateInterval={dateInterval}
            selectedCompanyId={selectedCompanyId}
          />
        </Grid>
      </Grid>
    </>
  )
}
export default GraphsPage

interface GraphsSettingsProps {
  dateFrom: Date
  setDateFrom: (date: Date) => void
  dateTo: Date
  setDateTo: (date: Date) => void
  dateInterval: string
  setDateInterval: (dateInterval: string) => void
  selectedCompanyId: number
  setSelectedCompanyId: (companyId: number) => void
}

const GraphsSettings = ({
  dateInterval,
  setDateInterval,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  selectedCompanyId,
  setSelectedCompanyId
}: GraphsSettingsProps): React.ReactElement => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Stack component='nav' direction={isSmallScreen ? 'column' : 'row'} spacing={2}>
      <DateIntervalInput
        dateInterval={dateInterval}
        setDateInterval={setDateInterval}
      />
      <DatePeriodInput
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />
      <CompanySelect
        selectedCompanyId={selectedCompanyId}
        setSelectedCompanyId={setSelectedCompanyId}
      />
    </Stack>
  )
}

interface ChartProps {
  startDate?: Date
  endDate?: Date
  dateInterval?: string
  selectedCompanyId?: number
}

const CompaniesOverTimeChart = ({ startDate, endDate, dateInterval, selectedCompanyId }: ChartProps): React.ReactElement | null => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  // const { data, loading } = useGetCompaniesStatistics(new Date(startDate ?? DEFAULT_DATE_FROM), new Date(endDate ?? DEFAULT_DATE_TO), dateInterval, selectedCompanyId)
  const loading = false
  const data = { getCompaniesStatisticsList: [] as Company[] }

  if (loading) {
    return (
      <CircularProgress />
    )
  }
  if (data?.getCompaniesStatisticsList === undefined || data?.getCompaniesStatisticsList?.length === 0) {
    return (
      <Typography>Nothing to show for this period</Typography>
    )
  }
  // Gather data values and labels
  const dataValues = [
    {
      label: 'Actual value',
      color: COLORS.BLUE_MEDIUM,
      data: data?.getCompaniesStatisticsList?.map((datapoint: any) => datapoint?.companyValue)
    },
    {
      label: 'Predicted value',
      color: COLORS.GREEN_MEDIUM,
      data: data?.getCompaniesStatisticsList?.map((datapoint: any) => datapoint?.companyPrediction)
    }
  ]
  const dataLabels = data?.getCompaniesStatisticsList?.map((datapoint: any) => datapoint?.labelName?.split('|').pop())
  return (
    <>
      <BarChart
        xAxis={[{ scaleType: 'band', data: dataLabels }]}
        series={dataValues}
        width={isSmallScreen ? 380 : 500}
        height={300}
      />
    </>
  )
}

export const getStaticProps = async (): Promise<GetStaticPropsResult<{}>> => ({
  props: {
    title: 'Overview'
  }
})
