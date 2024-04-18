import Link from 'next/link'

// import { Company } from 'graphql/__generated__/graphql'
// import { companyPath, useUpdateCompany, useDeleteCompany } from '../../graphql/collections/company/hooks'

const companyPath = (company: Company): string => `/companies/${company.id}-${company.name}`

type VoidFunction = () => Promise<void>

const usePromptAndUpdateCompany = (company: Company, fieldName: keyof Company): VoidFunction => {
  // const updateCompany = useUpdateCompany()

  const handleUpdate = async (): Promise<void> => {
    const newValue = window.prompt(`New value for ${fieldName as string}?`, company[fieldName]?.toString())
    if (newValue !== null) {
      // const companyPatch = {
      //   [fieldName]: newValue
      // }
      // await updateCompany({ variables: { id: company.id, companyPatch } })
    }
  }

  return handleUpdate
}

const usePromptAndDeleteCompany = (company: Company): VoidFunction => {
  // const deleteCompany = useDeleteCompany()

  const handleDelete = async (): Promise<void> => {
    if (window.confirm(`Delete ${company.name}?`)) {
      // const variables = {
      //   id: company.id
      // }
      // await deleteCompany({ variables })
    }
  }

  return handleDelete
}

interface CompanyListItemProps {
  company: any
  inProgress?: boolean
}

const CompanyListItem = ({ company, inProgress = false }: CompanyListItemProps): React.ReactElement => {
  const promptAndUpdateCompany = usePromptAndUpdateCompany(company, 'name')
  const promptAndDeleteCompany = usePromptAndDeleteCompany(company)

  return (
    <div className={inProgress === company.id ? 'inProgress' : ''} title={`id: ${company.id as number}`}>
      <Link legacyBehavior href={companyPath(company)}><a>{company.name}</a></Link>
      <a className='action update' onClick={() => { void promptAndUpdateCompany() }}>Update</a>
      <a className='action delete' onClick={() => { void promptAndDeleteCompany() }}>Delete</a>
      <style jsx>{`
        a.action {
          margin-left: 0.5em;
          cursor: pointer;
          font-size: 0.6em;
          text-transform: uppercase;
          border-bottom: none;
        }
        a.update {
          color: lime;
        }
        a.delete {
          color: tomato;
        }

        .inProgress {
          opacity: 0.3;
        }
      `}
      </style>
    </div>
  )
}
export default CompanyListItem
