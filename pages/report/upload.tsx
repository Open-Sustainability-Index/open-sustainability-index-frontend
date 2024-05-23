// pages/upload.js
import React, { useState } from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Container, Typography, Button, Box, TextField } from '@mui/material'

const UploadPage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [response, setResponse] = useState(null)

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (selectedImage) {
      const formData = new FormData()
      formData.append('file', selectedImage)

      const res = await fetch('/api/uploadAnalysis', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      setResponse(data)
    }
  }

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Upload Image
      </Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          type='file'
          inputProps={{ accept: 'image/*' }}
          onChange={handleImageChange}
          fullWidth
        />
        {selectedImage && (
          <Box sx={{ mt: 2 }}>
            <Typography variant='body1'>
              Selected file: {selectedImage.name}
            </Typography>
          </Box>
        )}
        <Button variant='contained' color='primary' type='submit' sx={{ mt: 2 }}>
          Upload
        </Button>
      </Box>
      {response && (
        <Box sx={{ mt: 2 }}>
          <Typography variant='body1'>
            Response: {JSON.stringify(response, null, 2)}
          </Typography>
        </Box>
      )}
    </Container>
  )
}
export default UploadPage

export const getStaticProps = async (context: GetStaticPropsContext): Promise<GetStaticPropsResult<{}>> => {
  return {
    props: {
      title: 'Upload Image',
    }
  }
}
