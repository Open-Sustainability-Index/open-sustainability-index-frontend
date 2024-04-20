import { Box, Typography, Link } from '@mui/material'
import React from 'react'

function Footer (): React.ReactElement {
  const links = [
    { name: 'About', path: '/about' },
    { name: 'Support', path: '/support' },
    { name: 'Contact', path: '/contact' },
    { name: 'API', path: '/api' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Roadmap', path: '/roadmap' }
  ]

  return (
    <Box sx={{ bgcolor: 'primary.main', p: 2, mt: 'auto', color: 'white', textAlign: 'center' }}>
      <Typography variant='h6'>ClimateWiki</Typography>
      <Typography variant='body1'>
        {links.map((link) => (
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
