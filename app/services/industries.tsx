import { Industry, PageProps } from 'types/global';

export const industriesPageProps = (industries: Industry[]): PageProps => {
  const first3IndustryNames = industries
    .slice(0, 3)
    .map((industry) => industry.name)
    .join(', ');
  return {
    title: 'Industry GHG emission data per year',
    description: `Get open-source global GHG emission data (scope 1/2/3) for industries such as ${first3IndustryNames}. Includes emissions per year, industry, country, and company intensity factors.`,
  };
};
