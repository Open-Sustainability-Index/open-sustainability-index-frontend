import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'

interface StartPageProps {
  title: string
}

function StartPage ({ title }: StartPageProps): React.ReactElement {
  return (
    <h1>{title}</h1>
  )
}
export default StartPage

export async function getStaticProps (context: GetStaticPropsContext): Promise<GetStaticPropsResult<StartPageProps>> {
  return {
    props: {
      title: 'Welcome to ClimateWiki!'
    }
  }
}
