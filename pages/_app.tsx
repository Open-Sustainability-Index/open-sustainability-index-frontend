import React from 'react'
import type { AppProps } from 'next/app'
import Router from 'next/router'
import { ThemeProvider } from '@mui/material/styles'

import { googlePageview } from '../app/components/page/GoogleAnalytics'
import PageHead from '../app/components/page/PageHead'
import Notifications from '../app/components/page/Notifications'
import '../app/theme/globals.css'
import '../app/theme/wordpress.css'
import theme from '../app/theme/theme'
import Header from '../app/components/navigation/Header'
import Footer from '../app/components/navigation/Footer'

Router.events.on('routeChangeComplete', path => googlePageview(path))

export default function App ({ Component, pageProps, router }: AppProps): React.ReactElement {
  // this.props (Server + Client): Component, err, pageProps, router
  const { showFooter } = pageProps
  return (
    <ThemeProvider theme={theme}>
      <PageHead {...pageProps} />
      <Header />
      <Component
        {...pageProps}
        {...router}
      />
      {showFooter !== false && (
        <Footer />
      )}
      <Notifications />
    </ThemeProvider>
  )
}
