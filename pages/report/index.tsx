// pages/upload.js
import React, { useState, useMemo } from 'react'
import type { GetStaticPropsResult } from 'next'
import { Grid, Container, Typography, Button, Box, TextField, CircularProgress } from '@mui/material'

import { Emission } from 'types/global'
import jsonToTSV from 'app/utils/jsonToTSV'
import DataTable, { DataTableHeader, DataTableOnChangeFunction } from 'app/components/common/DataTable'
import { RevenueTable, EmissionsOverviewTable, EmissionsDetailsTable } from 'app/components/companies/CompanyDetails'

// import testImageAnalysis from 'test/imageAnalysis.json'

const headers: readonly DataTableHeader[] = [
  { field: 'source' },
  { field: 'Bonn_company' },

  { field: 'year', displayOnMobile: true },
  { field: 'fiscal_year' },
  { field: 'company_name' },
  { field: 'company_lookup' },
  { field: 'sbti_lookup' },
  { field: 'sbti_group_level' },
  { field: 'sbti_comment' },
  { field: 'csrd_comment_report' },
  { field: 'industry' },
  { field: 'isic_rev_4' },
  { field: 'hq_country_move' },

  { field: 'scope_1' },
  { field: 'scope_2_market_based' },
  { field: 'scope_2_location_based' },
  { field: 'scope_2_unknown' },
  { field: 'total_scope_3', displayOnMobile: true },
  { field: 'total_emission_market_based' },
  { field: 'total_emission_location_based' },
  { field: 'total_reported_emission_scope_1_2' },
  { field: 'total_reported_emission_scope_1_2_3' },
  { field: 'cat_1' },
  { field: 'cat_2' },
  { field: 'cat_3' },
  { field: 'cat_4' },
  { field: 'cat_5' },
  { field: 'cat_6' },
  { field: 'cat_7' },
  { field: 'cat_8' },
  { field: 'cat_9' },
  { field: 'cat_10' },
  { field: 'cat_11' },
  { field: 'cat_12' },
  { field: 'cat_13' },
  { field: 'cat_14' },
  { field: 'cat_15' },
  { field: 'all_cats' },

  { field: 'Observation_comment' },
  { field: 'All Cats_comment_from report' },

  { field: 'upstream_scope_3' },
  { field: 'share_upstream_of_scope_3' },
  { field: 'scope_1_share_of_total_upstream_emissions' },
  { field: 'total_upstream_emissions' },
  { field: 'revenue' },
  { field: 'currency' },
  { field: 'revenue_million' },
  { field: 'cradle_to_gate' },
  { field: 'ghg_standard' },

  { field: 'source_emissions_page_move' },
  { field: 'emission_intensity' },
  { field: 'source_emission_report' },
  { field: 'emission_page' },
  { field: 'source_emission_link' },
  { field: 'source_revenue' },
  { field: 'page_revenue' },
  { field: 'source_revenue_link' },
  { field: 'publication_date' },
  { field: 'comment' },
  { field: 'status' }
]

interface AnalysisResults {
  message?: string
  analysis: {
    yearlyReports: Array<Record<string, string>>
  }
}

const DEFAULT_YEAR = new Date().getFullYear() - 1

const DEFAULT_EMISSIONS: Emission[] = [
  {
    year: DEFAULT_YEAR,
    total_emission_market_based: '',
    emission_intensity: null,
    cradle_to_gate: null,
    scope_1: null,
    scope_2_location_based: '',
    scope_2_market_based: '',
    scope_2_unknown: '',
    total_scope_3: '',
    cat_1: '',
    cat_2: '',
    cat_3: '',
    cat_4: '',
    cat_5: '',
    cat_6: '',
    cat_7: '',
    cat_8: '',
    cat_9: '',
    cat_10: '',
    cat_11: '',
    cat_12: '',
    cat_13: '',
    cat_14: '',
    cat_15: '',
    total_reported_emission_scope_1_2_3: null,
    source_emission_link: '',
    source: null,
    status: null,
    comment: null,
    revenue: null,
    all_cats: null,
    currency: null,
    industry: null,
    isic_rev_4: null,
    fiscal_year: null,
    company_name: null,
    ghg_standard: null,
    page_revenue: null,
    emission_page: null,
    source_revenue: null,
    hq_country_move: null,
    revenue_million: null,
    publication_date: null,
    upstream_scope_3: null,
    source_revenue_link: null,
    source_emission_report: null,
    total_upstream_emissions: null,
    share_upstream_of_scope_3: null,
    source_emisions_page_move: null,
    total_emission_location_based: null,
    total_reported_emission_scope_1_2: null,
    scope_1_share_of_total_upstream_emissions: null
  }
]

const UploadReportPage = ({ title }: { title: string }): React.ReactElement => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>()
  const [specialInstructions, setSpecialInstructions] = useState<string>('')
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>() // testImageAnalysis
  const inProgress = useMemo(() => analysisResults === null, [analysisResults])

  const [emissions, setEmissions] = useState<Emission[]>(DEFAULT_EMISSIONS)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  const handleValueChange: DataTableOnChangeFunction = (columnIndex, field, value) => {
    const newEmissions = emissions.map((emission, index) => {
      if (index === columnIndex) {
        return { ...emission, [field]: value?.name }
      }
      return emission
    })
    setEmissions(newEmissions)
  }

  const handleAddYear = (): void => {
    const lastEmission = emissions?.[emissions?.length - 1] ?? DEFAULT_EMISSIONS[0]
    setEmissions([
      ...emissions,
      {
        ...DEFAULT_EMISSIONS[0],
        year: parseInt((lastEmission?.year ?? DEFAULT_YEAR).toString()) + 1
      }
    ])
  }

  const handleSubmitDataForm = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const response = await fetch('/api/slack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        jsonData: emissions
      })
    })
    if (response.ok) {
      window.alert('Data submitted successfully!')
      setEmissions(DEFAULT_EMISSIONS)
      setName('')
      setEmail('')
    } else {
      window.alert('Failed to submit data.')
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files?.[0] !== null) {
      setSelectedFile(event.target.files?.[0])
    }
  }

  const handleSubmitImage = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (selectedFile !== undefined) {
      setAnalysisResults(null)
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('specialInstructions', specialInstructions)

      const res = await fetch('/api/uploadAnalysis', {
        method: 'POST',
        body: formData
      })

      const analysisData = await res.json()
      setAnalysisResults(analysisData)
    }
  }

  async function postData(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault()
    console.log('POST TO /api/slack')
  }

  return (
    <Container>
      <Typography variant='h1' gutterBottom>{title}</Typography>
      <Box component='form' onSubmit={(e) => { void handleSubmitImage(e) }} sx={{ mt: 2 }}>
        <TextField
          type='file'
          inputProps={{ accept: 'image/*' }}
          onChange={handleFileChange}
          fullWidth
        />
        <TextField
          label='Special instructions to the AI (optional)'
          placeholder='e.g. “Note that all emissions are reported as millions of tonnes and need to be converted”'
          fullWidth
          value={specialInstructions}
          onChange={(event) => setSpecialInstructions(event.target.value)}
          sx={{ mb: 2 }}
        />
        {(selectedFile !== undefined) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant='body1'>
              Selected file: {selectedFile?.name}
            </Typography>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              sx={{ mt: 2, mb: 2 }}
              disabled={inProgress}
            >
              Start the AI analysis
            </Button>
          </Box>
        )}
      </Box>
      {(inProgress) && (
        <CircularProgress />
      )}
      <form onSubmit={handleSubmitDataForm}>
        <Grid item xs={12} sx={{ textAlign: 'right' }}>
          <Button onClick={handleAddYear}>Add year</Button>
        </Grid>
        <Grid item xs={12}>
          <RevenueTable emissions={emissions} onChange={handleValueChange} />
        </Grid>
        <Grid item xs={12}>
          <EmissionsOverviewTable emissions={emissions} onChange={handleValueChange} />
        </Grid>
        <Grid item xs={12}>
          <EmissionsDetailsTable emissions={emissions} onChange={handleValueChange} />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'right' }}>
          <Typography variant='h3'>
            Your info
          </Typography>
          <TextField
            label='Name'
            placeholder='Enter your name'
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label='Email'
            placeholder='Enter your email'
            fullWidth
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant='contained' color='primary' type='submit' sx={{ mt: 2 }} disabled={inProgress}>
            Submit data
          </Button>
        </Grid>
      </form>
      {(analysisResults !== null && analysisResults !== undefined) && (
        <>
          <CopyToClipboardButton
            textToCopy={jsonToTSV(analysisResults?.analysis?.yearlyReports, headers)}
            label='Copy sheet data'
          />
          <DataTable
            data={analysisResults?.analysis?.yearlyReports ?? []}
            headers={headers}
          />
        </>
      )}
      <Box component='form' onSubmit={(e) => { void postData(e) }} sx={{ mt: 2 }}>
        <Button
          variant='contained'
          color='primary'
          type='submit'
          sx={{ mt: 2, mb: 2 }}
        >
          Post to Slack
        </Button>
      </Box>
    </Container>
  )
}
export default UploadReportPage

function CopyToClipboardButton ({ textToCopy, label = 'Copy' }: { textToCopy: string, label: string }): React.ReactElement {
  const handleCopyClick = (): void => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        window.alert('Text copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err)
      })
  }

  return (
    <Button variant='outlined' color='primary' type='submit' sx={{ mt: 2 }} onClick={handleCopyClick}>
      {label}
    </Button>
  )
}

export const getStaticProps = async (): Promise<GetStaticPropsResult<{}>> => {
  return {
    props: {
      title: 'Upload image for analysis'
    }
  }
}
