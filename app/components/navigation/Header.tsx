import React, { useState } from 'react'
import Link from 'next/link'
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery, createTheme, ThemeProvider } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import config from 'config/config'
import links from './links'
import theme from 'app/theme/theme'

const appBarTheme = createTheme({
  ...theme,
  typography: {
    fontSize: 15
  }
})

function Header (): React.ReactElement {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen)
  }

  const menuLinks = (
    <>
      <List>
        {links.filter(link => link.display.includes('header')).map((link) => (
          <Link href={link.path} key={link.name} passHref>
            <ListItem>
              <ListItemText primary={link.name} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Button href='/report' variant='contained' color='secondary' sx={{ margin: 2 }}>
        Report Emissions
      </Button>
    </>
  )

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      {menuLinks}
    </Box>
  )

  return (
    <ThemeProvider theme={appBarTheme}>
      <AppBar position='sticky' sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Typography variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
            <Link href='/'>{config.appName}</Link>
          </Typography>
          {isMobile
            ? (
              <IconButton
                color='inherit'
                aria-label='open drawer'
                edge='end'
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              )
            : (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                {links.filter(link => link.display.includes('header')).map((link) => (
                  <Link href={link.path} key={link.name} passHref>
                    <ListItem>
                      <ListItemText primary={link.name} />
                    </ListItem>
                  </Link>
                ))}
                <Button href='/report' variant='contained' color='secondary' sx={{ marginLeft: 2 }}>
                  Report Emissions
                </Button>
              </Box>
              )}
        </Toolbar>
        <Drawer
          anchor='right'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>
    </ThemeProvider>
  )
}

export default Header
