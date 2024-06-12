import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { config } from 'config/config';
import { formatDate } from 'lib/formatDate';
import { fetchCompanies, companyPath } from 'app/services/companies';
import navigationLinks from 'app/components/navigation/links';

interface SiteUrlProps {
  path: string;
}

const SiteUrl = ({ path }: SiteUrlProps): string => {
  const getDate = (): string => formatDate(new Date());
  return `<url>
      <loc>${config.appUrl as string}${path.substring(1)}</loc>
      <lastmod>${getDate()}</lastmod>
    </url>`;
};

interface SitemapProps {
  pagePaths: string[];
}

const Sitemap = ({ pagePaths }: SitemapProps): string => {
  return `<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>
      ${pagePaths?.map((path) => SiteUrl({ path })).join('\n')}
    </urlset>`;
};

const getPagePaths = async (): Promise<string[]> => {
  const companies =
    (await fetchCompanies({
      page: 1,
      pageSize: 10000,
      sort: 'emission_intensity',
      order: 'asc' /*, filters: { 'net-zero': 'Active' } */,
    })) ?? [];
  return ['/', ...navigationLinks.map((link) => link.path), ...companies.map(companyPath)];
};

interface SitemapPageParams extends ParsedUrlQuery {}

export async function getServerSideProps({
  res,
}: GetServerSidePropsContext<SitemapPageParams>): Promise<
  GetServerSidePropsResult<SitemapPageParams>
> {
  if (res !== undefined) {
    const pagePaths = await getPagePaths();
    res.setHeader('Content-Type', 'text/xml');
    res.write(Sitemap({ pagePaths }));
    res.end();
  }
  return { props: {} };
}

export default Sitemap;
