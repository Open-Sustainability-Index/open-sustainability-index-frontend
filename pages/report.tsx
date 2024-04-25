import React from 'react'
import Script from 'next/script'
import type { GetStaticPropsResult } from 'next'

import { PageProps } from 'types/global'
import config from 'config/config'

export default function ReportPage (): React.ReactElement {
  return (
    <>
      <Script type='text/javascript' src='https://form.jotform.com/jsform/240945423118050' />
    </>
  )
}

export async function getStaticProps (): Promise<GetStaticPropsResult<PageProps>> {
  return {
    props: {
      title: 'Report emissions',
      description: `${config.appName} enables companies to self-report and verify their sustainability data, offering a space where community-edited content meets corporate transparency.`,
      showFooter: false
    }
  }
}
