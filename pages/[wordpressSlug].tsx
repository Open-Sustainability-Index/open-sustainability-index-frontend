import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsContext, GetStaticPathsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Typography, Container } from '@mui/material'

import { getPostDetails, postPageProps, WordpressPost } from 'app/services/wordpress'
import links from 'app/components/navigation/links'
import PageTopBanner from 'app/components/page/PageTopBanner'
import APIDocs from 'app/components/api/APIDocs'

interface WordpressPageParams extends ParsedUrlQuery {
  wordpressSlug: string
}

interface WordpressPageProps {
  wordpressPost?: WordpressPost
  wordpressHistory?: WordpressPost[]
  wordpressSlug?: string | null
  title: string
  description: string
}

const WordpressPage = ({ title, description, wordpressSlug, wordpressPost }: WordpressPageProps): React.ReactElement => {
  if (wordpressPost === null) {
    return <Typography>Wordpress page not found</Typography>
  } else {
    return (
      <>
        <PageTopBanner subtitle={title} title={description} />
        {wordpressPost?.content !== undefined && (
          <Container>
            <Typography
              className='wordpress-container entry-content wp-block-post-content is-layout-constrained wp-block-post-content-is-layout-constrained' // has-global-padding
              component='div'
              dangerouslySetInnerHTML={{ __html: wordpressPost.content }}
            />

            {wordpressSlug === 'api' && (
              <APIDocs />
            )}
          </Container>
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
      ...postPageProps(wordpressPost),
      wordpressSlug,
      wordpressPost
    },
    revalidate: 5 * 60
  }
}

export async function getStaticPaths (context: GetStaticPathsContext): Promise<GetStaticPathsResult<WordpressPageParams>> {
  // const locales = context.locales ?? ['en']
  const wordpressSlugs = links.filter(link => link.buildStaticWordpressPage !== false).map(link => link.path)
  return {
    paths: wordpressSlugs,
    fallback: true // false → 404, true: Next.js tries to generate page
  }
}
