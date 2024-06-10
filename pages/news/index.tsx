import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Typography, Container, Grid } from '@mui/material'

import config from 'config/config'
import { getPostsList, WordpressPost } from 'app/services/wordpress'
import PageTopBanner from 'app/components/page/PageTopBanner'
import NextMUILink from 'app/components/navigation/NextMUILink'

interface WordpressListPageProps {
  wordpressPosts?: WordpressPost[]
  title: string
  description: string
}

const WordpressListPage = ({ title, description, wordpressPosts }: WordpressListPageProps): React.ReactElement => {
  return (
    <>
      <PageTopBanner subtitle={description} title={title} />
      <Container>
        {wordpressPosts?.map((post, index) => (
          <Grid container spacing={2} key={index} p={4}>
            <Grid item xs={12}>
              <NextMUILink href={`/news/${post.slug}`} variant='h6'>
                <Typography variant='body2'>{post.dateFormatted}</Typography>
                <Typography variant='h3'>{post.title}</Typography>
              </NextMUILink>
            </Grid>
          </Grid>
        ))}
      </Container>
    </>
  )
}

export default WordpressListPage

export async function getStaticProps (context: GetStaticPropsContext): Promise<GetStaticPropsResult<WordpressListPageProps>> {
  const wordpressPosts = await getPostsList()
  return {
    props: {
      wordpressPosts,
      title: 'News',
      description: `The latest news from ${config.appName as string}`
    },
    revalidate: 5 * 60
  }
}
