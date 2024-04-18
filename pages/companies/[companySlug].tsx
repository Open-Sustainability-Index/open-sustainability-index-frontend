import React from 'react'
import Link from 'next/link'
import type { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsContext, GetStaticPathsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'

// import { Company } from 'graphql/__generated__/graphql'
// import { useGetCompany } from '../../graphql/collections/company/hooks'
import CompanyDetails from '../../app/components/companies/CompanyDetails'

interface CompanyPageParams extends ParsedUrlQuery {
  companyId: string
}

interface CompanyPageProps {
  companyId: number | null
  title: string
}

const CompanyPage = ({ companyId }: CompanyPageProps): React.ReactElement => {
  // const { data, loading, error } = useGetCompany(companyId ?? 0)
  // if (error != null || (data !== undefined && (data.companyById === undefined || data.companyById === null))) {
  //   throw new Error(`Error: ${error?.message as string}`)
  // }
  const loading = false
  const companyById: Company | undefined = undefined

  return (
    <>
      {loading
        ? (
          <div>Loading...</div>
          )
        : (
          <CompanyDetails company={companyById} />
          )}

      <ul>
        <li>
          <Link legacyBehavior href='/'>
            <a>Home</a>
          </Link>
        </li>
      </ul>
    </>
  )
}

export default CompanyPage

export async function getStaticProps (context: GetStaticPropsContext<CompanyPageParams>): Promise<GetStaticPropsResult<CompanyPageProps>> {
  const companyId = (context.params?.companySlug as string)?.split('-')?.pop() ?? null
  return {
    props: {
      title: `Company ${companyId as string}`,
      companyId: companyId !== null ? parseInt(companyId) : null
    }
  }
}

export async function getStaticPaths (context: GetStaticPathsContext): Promise<GetStaticPathsResult<CompanyPageParams>> {
  // const locales = context.locales ?? ['en']
  return {
    paths: [],
    fallback: true // false → 404, true: Next.js tries to generate page
  }
}
