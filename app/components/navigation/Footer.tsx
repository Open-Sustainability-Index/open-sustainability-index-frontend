import { Box, Typography, Link } from '@mui/material'
import React from 'react'

import config from 'config/config'
import links from './links'

function Footer (): React.ReactElement {
  return (
    <Box sx={{ bgcolor: 'primary.main', p: 2, mt: 'auto', color: 'white', textAlign: 'center' }}>
      <Typography variant='h6'>{config.appName}</Typography>
      <Typography variant='body1'>
        {links.filter(link => link.display.includes('footer')).map((link) => (
          <Link key={link.name} href={link.path} color='secondary' style={{ marginRight: '0.5em' }}>
            {link.name}
          </Link>
        ))}
      </Typography>
      <Typography variant='body2'>hello@climatewiki.io</Typography>
      <Typography variant='body2'>+46 (8) 880 880</Typography>
    </Box>
  )
}

export default Footer
