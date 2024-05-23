// pages/upload.js
import React, { useState } from 'react'
import type { GetStaticPropsResult } from 'next'
import { Container, Typography, Button, Box, TextField, CircularProgress } from '@mui/material'
import DataTable, { DataTableHeader } from 'app/components/common/DataTable'

const headers: readonly DataTableHeader[] = [
  // { field: 'company_name' },
  { field: 'year', displayOnMobile: true },
  { field: 'fiscal_year' },
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
  { field: 'upstream_scope_3' },
  { field: 'share_upstream_of_scope_3' },
  { field: 'scope_1_share_of_total_upstream_emissions' },
  { field: 'total_upstream_emissions' },
  { field: 'revenue' },
  { field: 'currency' },
  { field: 'revenue_million' },
  { field: 'cradle_to_gate' },
  { field: 'ghg_standard' },
  { field: 'emission_intensity' },

  { field: 'source' },
  { field: 'source_emissions_page_move' },
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

const UploadReportPage = ({ title }: { title: string }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [analysisResults, setAnalysisResults] = useState()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files ?.[0] !== null) {
      setSelectedFile(event.target.files ?.[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (selectedFile) {
      setAnalysisResults(null)
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch('/api/uploadAnalysis', {
        method: 'POST',
        body: formData
      })

      const analysisData = await res.json()
      setAnalysisResults(analysisData)
    }
  }

  return (
    <Container>
      <Typography variant='h1' gutterBottom>{title}</Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          type='file'
          inputProps={{ accept: 'image/*' }}
          onChange={handleFileChange}
          fullWidth
        />
        {selectedFile && (
          <Box sx={{ mt: 2 }}>
            <Typography variant='body1'>
              Selected file: {selectedFile ?.name}
            </Typography>
          </Box>
        )}
        <Button variant='contained' color='primary' type='submit' sx={{ mt: 2 }}>
          Upload
        </Button>
      </Box>
      {(analysisResults === null) && (
        <CircularProgress />
      )}
      {(analysisResults !== null) && (
        null
      )}
      <DataTable
        data={analysisResults ?.analysis ?.yearlyReports ?? []}
        headers={headers}
      />
    </Container>
  )
}
export default UploadReportPage

export const getStaticProps = async (): Promise<GetStaticPropsResult<{}>> => {
  return {
    props: {
      title: 'Upload image for analysis'
    }
  }
}
