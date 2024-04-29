import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
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

import config from 'config/config'
import links from './links'
import theme, { COLORS } from 'app/theme/theme'
import NextMUILink from './NextMUILink'
import Image from 'next/image'

const headerTheme = createTheme({
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
    ...theme.typography,
    fontSize: 15,
    h6: {
      '@media (max-width:600px)': {
        fontSize: '1em'
      }
    }
  },
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
          color: COLORS.BLUE_MEDIUM,
          textDecoration: 'none',
          '&:hover': {
            color: COLORS.BLUE_HOVER,
            textDecoration: 'underline'
          }
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

  const menuLinks = (
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
      <Button href='/report' variant='contained' color='secondary' sx={{ margin: 2, textTransform: 'none', fontSize: '1rem', padding: '10px 30px', borderRadius: '50px' }}>
        Report Data
      </Button>
    </>
  )

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      {menuLinks}
    </Box>
  )

  return (
    <ThemeProvider theme={headerTheme}>
      <AppBar position='sticky' sx={{ bgcolor: 'background.default', color: 'text.primary', maxWidth: '1248px' }}>
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
                <Button href='/report' variant='contained' color='secondary' sx={{ marginLeft: 2, textTransform: 'none', fontSize: '1rem', padding: '10px 30px', borderRadius: '50px' }}>
                  Report Data
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
