import { Industry, PageProps } from 'types/global'
import { titleCase } from 'lib/strings'

export const industriesPageProps = (industries: Industry[]): PageProps => {
  const first3IndustryNames = industries.slice(0, 3).map((industry) => titleCase(industry.name)).join(', ')
  return {
    title: 'Global industry GHG emission data per year',
    description: `Get open-source global GHG emission data (scope 1/2/3) for industries such as ${first3IndustryNames}. Includes emissions per year, industry, country, and company intensity factors.`
  }
}
