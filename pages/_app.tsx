import React from 'react'
import type { AppProps } from 'next/app'
import Router from 'next/router'
import { ThemeProvider } from '@mui/material/styles'
import Container from '@mui/material/Container'

import { googlePageview } from '../components/page/GoogleAnalytics'
import PageHead from '../components/page/PageHead'
import Notifications from '../components/page/Notifications'
import '../styles/globals.css'
import theme from '../theme/theme'

Router.events.on('routeChangeComplete', path => googlePageview(path))

export default function App ({ Component, pageProps, router }: AppProps): React.ReactElement {
  // this.props (Server + Client): Component, err, pageProps, router
  return (
    <ThemeProvider theme={theme}>
      <PageHead {...pageProps} />
      <Container>
        <Component
          {...pageProps}
          {...router}
        />
      </Container>
      <Notifications />
    </ThemeProvider>
  )
}
