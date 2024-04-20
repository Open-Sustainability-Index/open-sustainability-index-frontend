import React from 'react'
import type { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsContext, GetStaticPathsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'

import { getPostDetails, postSeoProps, WordpressPost } from 'app/services/wordpress'

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

export default WordpressPage

export async function getStaticProps (context: GetStaticPropsContext<WordpressPageParams>): Promise<GetStaticPropsResult<WordpressPageProps>> {
  const wordpressSlug = context.params?.wordpressSlug
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

export async function getStaticPaths (context: GetStaticPathsContext): Promise<GetStaticPathsResult<WordpressPageParams>> {
  // const locales = context.locales ?? ['en']
  return {
    paths: [],
    fallback: true // false → 404, true: Next.js tries to generate page
  }
}
