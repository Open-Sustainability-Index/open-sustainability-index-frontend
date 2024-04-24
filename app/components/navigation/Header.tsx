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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen)
  }

  const menuLinks = (
    <>
      <List>
        {links.filter(link => link.display.includes('header')).map((link) => (
          <NextMUILink href={link.path} key={link.name} passHref>
            <ListItem>
              <ListItemText primary={link.name} />
            </ListItem>
          </NextMUILink>
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
    <ThemeProvider theme={headerTheme}>
      <AppBar position='sticky' sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        <Toolbar>
          <Typography variant='h6' color='inherit' noWrap sx={{ flexGrow: 1, textTransform: 'uppercase', fontWeight: 'bold' }}>
            <NextMUILink href='/'>{config.appName}</NextMUILink>
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
                  <NextMUILink href={link.path} key={link.name} passHref>
                    <ListItem>
                      <ListItemText primary={link.name} />
                    </ListItem>
                  </NextMUILink>
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
