import React, { useState, useMemo } from 'react'
import type { GetStaticPropsResult } from 'next'
import { Grid, Container, Typography, Button, Box, TextField, CircularProgress, Fab, Grow } from '@mui/material'
import { DropzoneArea } from 'mui-file-dropzone'

import { PageProps, ViewEmission, EmissionInsert } from 'types/global'
import { dateAsISO } from 'lib/formatDate'

import { DataTableOnChangeFunction } from 'app/components/common/DataTable'
import { RevenueTable, EmissionsDetailsTable } from 'app/components/companies/CompanyDetails'
import { SearchField } from 'app/components/navigation/SearchBlock'
import Toast, { ToastMessage } from 'app/components/common/Toast'
import InfoHelpBox from 'app/components/common/InfoHelpBox'
import PageTopBanner from 'app/components/page/PageTopBanner'

const UploadReportPage = ({ title, description }: PageProps): React.ReactElement => {
  const [inProgress, setInProgress] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<ToastMessage | undefined>()
  const [companyName, setCompanyName] = useState<string>('')
  const [companySlug, setCompanySlug] = useState<string | undefined>('')
  const [emissions, setEmissions] = useState<EmissionInsert[]>(DEFAULT_EMISSIONS)

  return (
    <>
      <PageTopBanner subtitle={description} title={title}>
        <InfoHelpBox
          embedded
          title='Instructions'
          instructions={[
            'Search / add name of the company that you’d like to add missing data for',
            'Upload a screenshot of revenue and emissions data and let AI fill the table – or add data manually if you prefer that',
            'Verify / adjust data in the tables',
            'Add name + email so we can get in touch for questions & verification (completely optional)',
            'Submit the data'
          ]}
        />
      </PageTopBanner>

      <Container>
        <Typography variant='h3'>1. Company name</Typography>
        <SearchField
          label='Company name'
          doReroute={false}
          onChange={(name, option) => {
            setCompanyName(name)
            setCompanySlug(option?.slug)
          }}
          textFieldProps={{ size: 'medium' }}
        />

        <Typography variant='h3'>2. Upload screenshot</Typography>
        <ImageAnalysisForm
          companySlug={companySlug}
          companyName={companyName}
          setCompanyName={setCompanyName}
          emissions={emissions}
          setEmissions={setEmissions}
          inProgress={inProgress}
          setInProgress={setInProgress}
          setToastMessage={setToastMessage}
        />

        <Typography variant='h3'>3. Verify / Adjust / Add Data</Typography>
        <CompanyDataForm
          companySlug={companySlug}
          companyName={companyName}
          setCompanyName={setCompanyName}
          emissions={emissions}
          setEmissions={setEmissions}
          inProgress={inProgress}
          setInProgress={setInProgress}
          setToastMessage={setToastMessage}
        />
      </Container>

      <Toast
        message={toastMessage}
      />
    </>
  )
}
export default UploadReportPage

interface EmissionsFormProps {
  companySlug?: string
  companyName: string
  setCompanyName: (companyName: string) => void
  emissions: EmissionInsert[]
  setEmissions: (emissions: EmissionInsert[]) => void
  inProgress: boolean
  setInProgress: (inProgress: boolean) => void
  setToastMessage: (message: ToastMessage | undefined) => void
}

const CompanyDataForm: React.FC<EmissionsFormProps> = ({ companySlug, companyName, setCompanyName, emissions, setEmissions, inProgress, setInProgress, setToastMessage }) => {
  const [submitterName, setSubmitterName] = useState<string>('')
  const [submitterEmail, setSubmitterEmail] = useState<string>('')

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

  const insertCompanySlug = (): EmissionInsert[] => {
    const newEmissions = emissions.map((emission) => {
      return { ...emission, company_slug: companySlug ?? '?' }
    })
    setEmissions(newEmissions)
    return newEmissions
  }

  const handleSubmitDataForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    event.preventDefault()
    if (companyName === '') {
      window.alert('Missing company name')
      return
    }
    setInProgress(true)
    setToastMessage({ text: 'Submitting data...' })
    // Fix slug on all rows
    const jsonData = insertCompanySlug()
    const response = await fetch('/api/slack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyName,
        name: submitterName,
        email: submitterEmail,
        jsonData
      })
    })
    if (response.ok) {
      setToastMessage({ text: 'Data submitted successfully!', severity: 'success' })
      setEmissions(DEFAULT_EMISSIONS)
      setCompanyName('')
      setSubmitterName('')
      setSubmitterEmail('')
    } else {
      setToastMessage({ text: 'Failed to submit data', severity: 'error' })
    }
    setInProgress(false)
  }

  return (
    <form>
      <Typography variant='body2'>Add or adjust data submitted by the AI image processing.</Typography>
      <Box sx={{ textAlign: 'right', mb: 0, mt: 4 }}>
        <Button variant='contained' onClick={handleAddYear}>+ Add Year</Button>
      </Box>
      <Grid item xs={12} sx={{ my: 2 }}>
        <RevenueTable emissions={emissions as ViewEmission[]} onChange={handleValueChange} />
      </Grid>
      <Grid item xs={12} sx={{ my: 2 }}>
        <EmissionsDetailsTable emissions={emissions as ViewEmission[]} onChange={handleValueChange} />
      </Grid>

      <Typography variant='h3'>Contact info</Typography>
      <Typography variant='body2'>If you want, add your name and email so we can get in touch if we have any questions.</Typography>
      <TextField
        label='Name'
        placeholder='Enter your name'
        fullWidth
        value={submitterName}
        onChange={(event) => setSubmitterName(event.target.value)}
        sx={{ mb: 1 }}
      />
      <TextField
        label='Email'
        placeholder='Enter your email'
        fullWidth
        value={submitterEmail}
        onChange={(event) => setSubmitterEmail(event.target.value)}
        sx={{ mb: 2 }}
      />

      <Typography variant='h3'>Submit data</Typography>
      <Typography variant='body2' sx={{ mb: 6 }}>When you feel ready, submit the data for review with the big purple “Submit Data” button. We review and publish data within 48 hours.</Typography>
      <Grow in timeout={800}>
        <Fab
          variant='extended'
          color='secondary'
          aria-label='submit'
          onClick={(e) => { void handleSubmitDataForm(e) }}
          disabled={inProgress}
          sx={{ position: 'fixed', width: '10em', left: 'calc(50vw - 5em)', bottom: '3em' }}
        >
          Submit Data
        </Fab>
      </Grow>
    </form>
  )
}

interface AnalysisResults {
  message?: string
  analysis: {
    yearlyReports: Array<Record<string, string>>
  }
}

// import testImageAnalysis from 'test/imageAnalysis.json'

const ImageAnalysisForm: React.FC<EmissionsFormProps> = ({ emissions, setEmissions, inProgress, setInProgress, setToastMessage }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [specialInstructions, setSpecialInstructions] = useState<string>('')
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>() // testImageAnalysis
  const inProgressAnalysis = useMemo(() => analysisResults === null, [analysisResults])

  const handleFilesChange = (files: File[]): void => {
    setSelectedFiles(files)
  }

  const handleSubmitImages = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (selectedFiles !== undefined) {
      setInProgress(true)
      setToastMessage({ text: 'Analyzing image...' })
      setAnalysisResults(null)

      const formData = new FormData()
      selectedFiles.forEach((file) => {
        formData.append('file', file)
      })
      formData.append('specialInstructions', specialInstructions)

      const res = await fetch('/api/uploadAnalysis', {
        method: 'POST',
        body: formData
      })

      const analysisData = await res.json()
      setAnalysisResults(analysisData)
      setEmissions(analysisData?.analysis?.yearlyReports ?? [])
      setSelectedFiles([])
      setInProgress(false)
      setToastMessage({ text: 'Analysis completed', severity: 'success' })
    }
  }

  return (
    <>
      <Box component='form' onSubmit={(e) => { void handleSubmitImages(e) }} sx={{ mt: 2 }}>
        <Typography variant='body2'>To simplify adding data, drop a screenshot from an emissions report below, or click to select files.</Typography>
        <DropzoneArea
          inputProps={{ accept: 'image/*' }}
          onChange={handleFilesChange}
          fileObjects={selectedFiles}
        />
        <Typography variant='body2'>Special instructions to the AI, like “Emissions are reported in millions of metric tons and needs to be converted” (optional).</Typography>
        <TextField
          label='Instructions to the AI (optional)'
          placeholder='e.g. “Emissions are reported as millions of tonnes and need to be converted”'
          fullWidth
          value={specialInstructions}
          onChange={(event) => setSpecialInstructions(event.target.value)}
          sx={{ mb: 2 }}
        />
        {(selectedFiles.length > 0) && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              sx={{ mt: 2, mb: 2 }}
              disabled={inProgressAnalysis}
            >
              Start the AI analysis
            </Button>
          </Box>
        )}
      </Box>
      {(inProgressAnalysis) && (
        <CircularProgress />
      )}
    </>
  )
}

const DEFAULT_YEAR = new Date().getFullYear() - 1

const DEFAULT_EMISSIONS: EmissionInsert[] = [
  {
    company_slug: '?',
    year: DEFAULT_YEAR,
    created_at: dateAsISO(new Date()) as string,
    updated_at: dateAsISO(new Date()) as string,
    fiscal_year: null,
    scope_1: null,
    scope_2_market_based: null,
    scope_2_location_based: null,
    scope_2_unknown: null,
    total_scope_3: null,
    cat_1: null,
    cat_2: null,
    cat_3: null,
    cat_4: null,
    cat_5: null,
    cat_6: null,
    cat_7: null,
    cat_8: null,
    cat_9: null,
    cat_10: null,
    cat_11: null,
    cat_12: null,
    cat_13: null,
    cat_14: null,
    cat_15: null
  }
]

export const getStaticProps = async (): Promise<GetStaticPropsResult<{}>> => {
  return {
    props: {
      title: 'Report Data',
      description: 'Add sustainability data for companies'
    }
  }
}
