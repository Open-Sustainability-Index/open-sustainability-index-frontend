import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  createTheme,
  ThemeProvider
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import links from './links'
import theme, { COLORS } from 'app/theme/theme'
import NextMUILink from './NextMUILink'
import Image from 'next/image'

const headerTheme = createTheme({
  ...theme,
  components: {
    ...theme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${COLORS.BLUE_LIGHT}`
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: '1.2rem',
          fontWeight: 500
        }
      }
    }
  }
})

function Header (): React.ReactElement {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const showHamburgerMenu = useMediaQuery(theme.breakpoints.down('md'))

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen)
  }

  const menuLinksForMobile = (
    <>
      <List>
        {links.filter(link => link.display.includes('header')).map((link) => (
          <NextMUILink href={link.path} key={link.name}>
            <ListItem>
              <ListItemText primary={link.name} />
            </ListItem>
          </NextMUILink>
        ))}
      </List>
      <Button href='/report' variant='contained' color='primary' sx={{ mx: 2 }}>
        Report Data
      </Button>
    </>
  )

  const drawerOnMobile = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      {menuLinksForMobile}
    </Box>
  )

  return (
    <ThemeProvider theme={headerTheme}>
      <AppBar position='sticky' sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        <Box sx={{ maxWidth: '1248px', width: '100%', margin: '0 auto' }}>
          <Toolbar sx={{ minHeight: { md: '110px' }, display: 'flex', justifyContent: 'space-between' }}>
            <NextMUILink href='/'>
              <Image src='/images/logo.svg' alt='Open Sustainability Index Logo' width={62} height={62} />
            </NextMUILink>
            {showHamburgerMenu
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
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', paddingLeft: '1em' }}>
                    {links.filter(link => link.display.includes('header')).map((link) => (
                      <NextMUILink href={link.path} key={link.name}>
                        <ListItem>
                          <ListItemText primary={link.name} />
                        </ListItem>
                      </NextMUILink>
                    ))}
                  </Box>
                  <Button href='/report' variant='contained' color='primary'>
                    Report Data
                  </Button>
                </Box>
                )}
          </Toolbar>
        </Box>
        <Drawer
          anchor='right'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {drawerOnMobile}
        </Drawer>
      </AppBar>
    </ThemeProvider>
  )
}

export default Header
