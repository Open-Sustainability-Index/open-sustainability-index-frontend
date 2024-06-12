import Link from 'next/link';

import { companyPath } from 'app/services/companies';

interface CompanyListItemProps {
  company: any;
  inProgress?: boolean;
}

const CompanyListItem = ({
  company,
  inProgress = false,
}: CompanyListItemProps): React.ReactElement => {
  return (
    <div
      className={inProgress === company.Name ? 'inProgress' : ''}
      title={`id: ${company.Name as number}`}
    >
      <Link legacyBehavior href={companyPath(company)}>
        <a>{company.Name}</a>
      </Link>
      <style jsx>
        {`
          .inProgress {
            opacity: 0.3;
          }
        `}
      </style>
    </div>
  );
};
export default CompanyListItem;
