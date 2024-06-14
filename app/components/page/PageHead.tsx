import React from 'react'
import Head from 'next/head'

import { config } from 'config/config'
import { PageProps } from 'types/global'

const PageHead = ({ title, description, imageUrl, iconUrl = '/favicon.png', canonicalPath, redirectTo }: PageProps): React.ReactElement | null => {
  const pageTitle = (title !== undefined && title !== null)
    ? `${(title)} – ${config.appName as string}`
    : `${config.appName as string} – ${(config.appTagline as string)}`

  const pageDescription = description ?? config.appDescription ?? ''

  const thumbnailUrl = imageUrl ?? `${config.appUrl as string}images/preview_default.jpg` // ?? `https://screens.myscreenshooterserver.com/?url=${config.appUrl}${path.slice(1)}${(path.includes('?') ? '&' : '?')}thumbnail=true`

  // SEO: title 60 characters, description 160 characters
  if (config.isDevelopment === true) console.log(`SEO Metadata:\n• title (${60 - pageTitle.length}): “${pageTitle}”\n• description (${160 - pageDescription.length}): “${pageDescription}”\n• imageUrl: ${thumbnailUrl}`)

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name='description' content={pageDescription} />

      <meta charSet='utf-8' />
      <meta httpEquiv='content-language' content={config.locale?.split('_')[0]} />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />

      <link rel='manifest' href='/manifest.json' />

      <link rel='shortcut icon' type='image/x-icon' href={iconUrl} />

      <meta property='og:site_name' content={config.appName} />
      <meta property='og:title' content={pageTitle} />
      <meta property='og:description' content={pageDescription} />
      <meta property='og:locale' content={config.locale} />

      {(thumbnailUrl !== undefined && thumbnailUrl !== null) && (
        <>
          <meta property='og:image' content={thumbnailUrl} />
          <meta name='twitter:image' content={thumbnailUrl} />
        </>
      )}

      <meta name='twitter:card' content='summary' />
      <meta name='twitter:title' content={pageTitle} />
      <meta name='twitter:description' content={pageDescription} />

      <link rel='apple-touch-icon' href={iconUrl} />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
      <meta name='apple-mobile-web-app-title' content={config.appName} />

      {(canonicalPath !== undefined) && (
        <link rel='canonical' href={`${config.appUrl as string}${canonicalPath.slice(1)}`} />
      )}
      {(redirectTo !== undefined) && (
        <meta httpEquiv='refresh' content={`0;url=${config.appUrl as string}${redirectTo.slice(1)}`} />
      )}
    </Head>
  )
}
export default PageHead
