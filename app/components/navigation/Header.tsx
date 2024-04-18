import { AppBar, Toolbar, Typography, Button, IconButton, Box, Link, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import React, { useState } from 'react'

function Header (): React.ReactElement {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {['Companies', 'Industries', 'Countries', 'Partners', 'About', 'API', 'FAQ', 'Governance'].map((text) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Button variant='contained' color='secondary' sx={{ margin: 2 }}>
        Report Emissions
      </Button>
    </Box>
  )

  return (
    <AppBar position='sticky' sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <Typography variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
          ClimateWiki
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
              {['Companies', 'Industries', 'Countries', 'Partners', 'About', 'API', 'FAQ', 'Governance'].map((text) => (
                <Link href='#' color='secondary' key={text} sx={{ margin: 1 }}>
                  {text}
                </Link>
              ))}
              <Button variant='contained' color='secondary' sx={{ marginLeft: 2 }}>
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
  )
}

export default Header
