import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsContext, GetStaticPathsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Typography } from '@mui/material'

import { getPostDetails, postSeoProps, WordpressPost } from 'app/services/wordpress'
import links from 'app/components/navigation/links'

interface WordpressPageParams extends ParsedUrlQuery {
  wordpressSlug: string
}

interface WordpressPageProps {
  wordpressPost?: WordpressPost
  wordpressHistory?: WordpressPost[]
  wordpressSlug?: string | null
  title: string
}

const WordpressPage = ({ wordpressPost }: WordpressPageProps): React.ReactElement => {
  if (wordpressPost === null) {
    return <Typography>Wordpress page not found</Typography>
  } else {
    return (
      <>
        {wordpressPost?.content !== undefined && (
          <Typography
            className='wordpress-container'
            dangerouslySetInnerHTML={{ __html: wordpressPost.content }}
          />
        )}
      </>
    )
  }
}

export default WordpressPage

export async function getStaticProps (context: GetStaticPropsContext<WordpressPageParams>): Promise<GetStaticPropsResult<WordpressPageProps>> {
  const wordpressSlug = context.params?.wordpressSlug
  const wordpressPost = await getPostDetails(wordpressSlug as string)
  console.log('Building static WordPress page:', wordpressSlug)
  if (wordpressPost === undefined) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      ...postSeoProps(wordpressPost),
      wordpressSlug,
      wordpressPost
    },
    revalidate: 5 * 60
  }
}

export async function getStaticPaths (context: GetStaticPathsContext): Promise<GetStaticPathsResult<WordpressPageParams>> {
  // const locales = context.locales ?? ['en']
  const wordpressSlugs = links.filter(link => link.wordpressPage !== false).map(link => link.path)
  return {
    paths: wordpressSlugs,
    fallback: true // false → 404, true: Next.js tries to generate page
  }
}
