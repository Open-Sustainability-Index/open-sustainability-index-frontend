import React from 'react'
import type { AppProps } from 'next/app'
import Router from 'next/router'
import { ThemeProvider } from '@mui/material/styles'
import Container from '@mui/material/Container'

import { googlePageview } from '../app/components/page/GoogleAnalytics'
import PageHead from '../app/components/page/PageHead'
import Notifications from '../app/components/page/Notifications'
import '../app/theme/globals.css'
import theme from '../app/theme/theme'

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
