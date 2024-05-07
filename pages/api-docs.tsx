import { Typography } from '@mui/material';
import { getPostDetails, postPageProps } from 'app/services/wordpress';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(import('swagger-ui-react'), { ssr: false }) as any;

function ApiDoc ({ title, description, wordpressPost }: HomePageProps): React.ReactElement {

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

export async function getStaticProps (context: GetStaticPropsContext<HomePageParams>): Promise<GetStaticPropsResult<HomePageProps>> {
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
