import React from 'react'
import { Box, Container, Typography } from '@mui/material'

interface PageTopBannerProps {
  title?: string
  description?: string
  children?: React.ReactNode
}

const PageTopBanner = ({
  title = 'Welcome',
  description = 'Welcome to a world of open, accessible, transparent, actionable sustainability data. We just launched.',
  children
}: PageTopBannerProps): React.ReactElement => {
  return (
    <Box
      sx={{
        backgroundColor: 'var(--wp--preset--color--tertiary)',
        color: 'white',
        px: '1.75rem',
        py: {
          xs: 6,
          md: 12
        },
        mb: 4
      }}
    >
      <Container>
        <Typography variant='subtitle1' component='h2'>
          {title}
        </Typography>
        <Typography variant='h1' sx={{ marginTop: '8px' }}>
          {description}
        </Typography>
        {children}
      </Container>
    </Box>
  )
}

export default PageTopBanner
