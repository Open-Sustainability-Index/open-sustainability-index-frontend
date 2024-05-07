import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(import('swagger-ui-react'), { ssr: false }) as any;

function ApiDoc ({ spec }: InferGetStaticPropsType<typeof getServerSideProps>) {
  return <SwaggerUI spec={spec} />;
}

export const getServerSideProps: GetStaticProps = async () => {
  const spec = await (
    await fetch('https://api.opensustainabilityindex.org/openapi.json')
  ).json()

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
