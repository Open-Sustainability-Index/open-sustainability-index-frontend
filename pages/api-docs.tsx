import { Typography } from '@mui/material';
import { WordpressPost, getPostDetails, postPageProps } from 'app/services/wordpress';
import { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import dynamic from 'next/dynamic';
import { ParsedUrlQuery } from 'querystring';
import { useEffect, useState } from 'react';
import 'swagger-ui-react/swagger-ui.css';

interface APIPageParams extends ParsedUrlQuery {
  wordpressSlug: string
}

interface APIPageProps {
  wordpressPost?: WordpressPost
  wordpressSlug?: string | null
  title: string
  description: string
}

const SwaggerUI = dynamic(import('swagger-ui-react'), { ssr: false }) as any;

function ApiDoc ({ wordpressPost }: APIPageProps): React.ReactElement {

  const [spec, setSpec] = useState()
  useEffect(() => {
    async function get () {
      const data = await (
        await fetch('https://api.opensustainabilityindex.org/openapi.json')
      ).json()
      setSpec(data)
    }
    get()
  }, [])
  return (
    <>
      {wordpressPost?.content !== undefined && (
        <Typography
          className='wordpress-container entry-content wp-block-post-content has-global-padding is-layout-constrained wp-block-post-content-is-layout-constrained'
          component='div'
          dangerouslySetInnerHTML={{ __html: wordpressPost.content }}
        />
      )}
      <SwaggerUI spec={spec} />
    </>
  )
}

export async function getStaticProps (context: GetStaticPropsContext<APIPageParams>): Promise<GetStaticPropsResult<APIPageProps>> {
  const wordpressSlug = 'api'
  const wordpressPost = await getPostDetails(wordpressSlug as string)
  return {
    props: {
      ...postPageProps(wordpressPost),
      wordpressSlug,
      wordpressPost
    },
    revalidate: 5 * 60
  }
}

export default ApiDoc;
