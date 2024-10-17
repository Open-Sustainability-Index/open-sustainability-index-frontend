import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Typography, Container, Grid } from '@mui/material'

import { getPostsList, getCategoryDetails, WordpressListPageProps } from 'app/services/wordpress'
import PageTopBanner from 'app/components/page/PageTopBanner'
import NextMUILink from 'app/components/navigation/NextMUILink'

const WordpressListPage = ({ title, description, wordpressPosts }: WordpressListPageProps): React.ReactElement => {
  const firstCategory = ((wordpressPosts?.[0]?.categories) != null) ? Object.values(wordpressPosts[0].categories)[0] : undefined
  return (
    <>
      <PageTopBanner subtitle={description} title={title} />
      <Container>
        {wordpressPosts?.map((post, index) => (
          <Grid container spacing={2} key={index} p={4}>
            <Grid item xs={12}>
              <NextMUILink href={`/${firstCategory?.slug ?? 'news'}/${post.slug}`} variant='h6'>
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

export async function generatePageProps (categorySlug: string): Promise<GetStaticPropsResult<WordpressListPageProps>> {
  const category = await getCategoryDetails(categorySlug)
  const wordpressPosts = await getPostsList({ category: categorySlug })
  return {
    props: {
      wordpressPosts,
      title: category.name,
      description: category.description
    },
    revalidate: 5 * 60
  }
}

export async function getStaticProps (context: GetStaticPropsContext): Promise<GetStaticPropsResult<WordpressListPageProps>> {
  return await generatePageProps('news')
}
