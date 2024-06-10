import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsContext, GetStaticPathsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Typography, Container, Grid } from '@mui/material'

import { getPostDetails, postPageProps, WordpressPost } from 'app/services/wordpress'
import PageTopBanner from 'app/components/page/PageTopBanner'

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

const WordpressPage = ({ title, description, wordpressPost }: WordpressPageProps): React.ReactElement => {
  if (wordpressPost === null) {
    return <Typography>Wordpress page not found</Typography>
  } else {
    return (
      <>
        <PageTopBanner subtitle='News' title={title} />
        {wordpressPost?.content !== undefined && (
          <Container>
            <Grid container spacing={2} p={4}>
              <Grid item md={4} xs={12}>
                <Typography variant='body2'>{wordpressPost.dateFormatted}</Typography>
              </Grid>
              <Grid item md={8} xs={12}>
                <Typography
                  className='wordpress-container entry-content wp-block-post-content is-layout-constrained wp-block-post-content-is-layout-constrained' // has-global-padding
                  component='div'
                  dangerouslySetInnerHTML={{ __html: wordpressPost.content }}
                />
              </Grid>
            </Grid>
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
  return {
    paths: [],
    fallback: true // false → 404, true: Next.js tries to generate page
  }
}
