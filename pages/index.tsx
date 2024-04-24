import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Typography } from '@mui/material'

import { getPostDetails, postSeoProps, WordpressPost } from 'app/services/wordpress'
import Placeholder from 'app/components/common/Placeholder'
import PageTopBanner from 'app/components/page/PageTopBanner'

interface HomePageParams extends ParsedUrlQuery {
  wordpressSlug: string
}

interface HomePageProps {
  wordpressPost?: WordpressPost
  wordpressHistory?: WordpressPost[]
  wordpressSlug?: string | null
  title: string
  description: string
}

const HomePage = ({ title, description, wordpressPost }: HomePageProps): React.ReactElement => {
  if (wordpressPost === null) {
    return <Typography>Wordpress page not found</Typography>
  } else {
    return (
      <>
        <PageTopBanner title={title} description={description} />
        <Placeholder title='Search Block' />
        <Placeholder title='3 Graphs' height='20em' />
        {wordpressPost?.content !== undefined && (
          <Typography
            className='wordpress-container'
            component='div'
            dangerouslySetInnerHTML={{ __html: wordpressPost.content }}
          />
        )}
      </>
    )
  }
}

export default HomePage

export async function getStaticProps (context: GetStaticPropsContext<HomePageParams>): Promise<GetStaticPropsResult<HomePageProps>> {
  const wordpressSlug = 'home'
  const wordpressPost = await getPostDetails(wordpressSlug as string)
  return {
    props: {
      ...postSeoProps(wordpressPost),
      wordpressSlug,
      wordpressPost
    },
    revalidate: 5 * 60
  }
}
