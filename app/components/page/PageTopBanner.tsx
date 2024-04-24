import React from 'react'
import { Box, Typography } from '@mui/material'

const PageTopBanner = ({
  title = 'Welcome',
  description = 'Welcome to a world of open, accessible, transparent, actionable sustainability data. We just launched.'
}) => {
  return (
    <Box
      sx={{
        backgroundColor: 'var(--wp--preset--color--tertiary)',
        color: 'white',
        py: 2,
        px: 3
      }}
    >
      <Typography variant='subtitle1' component='h1'>
        {title}
      </Typography>
      <Typography variant='h2' sx={{ marginTop: '8px', color: 'black', fontSize: '36px' }}>
        {description}
      </Typography>
    </Box>
  )
}

export default PageTopBanner
