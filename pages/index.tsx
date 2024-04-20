import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'

import { getPostDetails, postSeoProps, WordpressPost } from 'app/services/wordpress'

interface WordpressHomePageParams extends ParsedUrlQuery {
  wordpressSlug: string
}

interface WordpressHomePageProps {
  wordpressPost?: WordpressPost
  wordpressHistory?: WordpressPost[]
  wordpressSlug?: string | null
  title: string
}

const WordpressHomePage = ({ wordpressPost }: WordpressHomePageProps): React.ReactElement => {
  if (wordpressPost === null) {
    return <div>Wordpress page not found</div>
  } else {
    return (
      <>
        {wordpressPost?.content !== undefined &&
          <div dangerouslySetInnerHTML={{ __html: wordpressPost.content }} />}
      </>
    )
  }
}

export default WordpressHomePage

export async function getStaticProps (context: GetStaticPropsContext<WordpressHomePageParams>): Promise<GetStaticPropsResult<WordpressHomePageProps>> {
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
