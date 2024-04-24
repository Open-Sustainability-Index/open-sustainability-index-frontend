import React from 'react'
import {
  Grid,
  Typography,
  Box,
  createTheme,
  ThemeProvider
} from '@mui/material'

import config from 'config/config'
import links from './links'
import theme, { COLORS } from 'app/theme/theme'
import NextMUILink from './NextMUILink'

const footerTheme = createTheme({
  ...theme,
  palette: {
    background: {
      default: '#FFFFFF'
    },
    text: {
      primary: COLORS.BLUE_MEDIUM
    }
  },
  typography: {
    fontSize: 15
  },
  components: {
    ...theme.components,
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'inherit',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        }
      }
    }
  }
})

const Footer = () => {
  return (
    <ThemeProvider theme={footerTheme}>
      <Box sx={{ backgroundColor: 'white', color: '#8C8C8C', px: 3, py: 10, textAlign: { sm: 'left', xs: 'center' } }}>
        <Grid container spacing={2} justifyContent='space-around'>
          <Grid item xs={12} sm={3}>
            <Typography variant='h6' color='inherit' sx={{ flexGrow: 1, textTransform: 'uppercase', fontWeight: 'bold' }}>
              <NextMUILink href='/'>{config.appName}</NextMUILink>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            {links.map((link) => (
              <Typography key={link.name}>
                <NextMUILink href={link.path} color='inherit' sx={{ textDecoration: 'none' }}>
                  {link.name}
                </NextMUILink>
              </Typography>
            ))}
          </Grid>
        </Grid>
        <Typography variant='caption' display='block' gutterBottom sx={{ textAlign: 'center', marginTop: '2em' }}>
          Licensed under CC BY-SA 4.0
        </Typography>
      </Box>
    </ThemeProvider>
  )
}

export default Footer
