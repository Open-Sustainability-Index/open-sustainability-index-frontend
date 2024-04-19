import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsContext, GetStaticPathsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'

import { getPostDetails } from 'app/services/wordpress'

interface WordpressPageParams extends ParsedUrlQuery {
  wordpressSlug: string
}

interface WordpressPageProps {
  wordpress: Wordpress | undefined
  wordpressHistory: Wordpress[] | undefined
  wordpressSlug?: string | null
  title: string
}

const WordpressPage = ({ title, wordpress, wordpressSlug }: WordpressPageProps): React.ReactElement => {
  if (
    wordpress === null
  ) {
    return <div>Wordpress not found</div>
  } else {
    return (
      <>
        {wordpress?.content &&
          <div dangerouslySetInnerHTML={{ __html: wordpress.content }} />
        }
      </>
    )
  }
}

export default WordpressPage

export async function getStaticProps (context: GetStaticPropsContext<CompanyPageParams>): Promise<GetStaticPropsResult<WordpressPageProps>> {
  const wordpressSlug = context.params?.wordpressSlug
  const wordpress = await getPostDetails(wordpressSlug as string)
  return {
    props: {
      wordpressSlug,
      wordpress,
    }
  }
}

export async function getStaticPaths (context: GetStaticPathsContext): Promise<GetStaticPathsResult<CompanyPageParams>> {
  // const locales = context.locales ?? ['en']
  return {
    paths: [],
    fallback: true // false → 404, true: Next.js tries to generate page
  }
}
