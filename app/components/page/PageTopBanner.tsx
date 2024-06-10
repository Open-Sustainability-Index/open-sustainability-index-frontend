import React from 'react'
import { Box, Container, Typography } from '@mui/material'

interface PageTopBannerProps {
  subtitle?: string
  title?: string
  children?: React.ReactNode
}

const PageTopBanner = ({
  subtitle = 'Welcome',
  title = 'Welcome to a world of open, accessible, transparent, actionable sustainability data. We just launched.',
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
          {subtitle}
        </Typography>
        <Typography variant='h1' sx={{ marginTop: '8px' }}>
          {title}
        </Typography>
        {children}
      </Container>
    </Box>
  )
}

export default PageTopBanner
