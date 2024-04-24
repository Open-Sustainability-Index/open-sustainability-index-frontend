import { useState, useMemo, MouseEvent } from 'react'
// import { useRouter } from 'next/router'
import { Button, Box, Menu, MenuItem } from '@mui/material'
// import MoreVertIcon from '@mui/icons-material/MoreVert'
import BusinessIcon from '@mui/icons-material/Business'
import CheckIcon from '@mui/icons-material/Check'
import { Company } from 'types/global'

// import { useListCompanies } from 'graphql/collections/company/hooks'
// import { Company } from 'graphql/__generated__/graphql'

const SELECTED_STOCK_NONE = -1

interface CompanySelectProps {
  selectedCompanyId: string | undefined
  setSelectedCompanyId: (companyId: string) => void
}

export default function CompanySelect ({ selectedCompanyId, setSelectedCompanyId }: CompanySelectProps): React.ReactElement {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // const { data: allCompanies } = useListCompanies()
  const allCompanies = { allCompaniesList: [] as Company[] }

  const handleClick = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  const availableCompanies = useMemo(
    () => {
      return allCompanies?.allCompaniesList
    },
    [allCompanies?.allCompaniesList]
  )

  const isNoneSelected = useMemo(
    () => {
      const firstCompanyId = allCompanies?.allCompaniesList?.[0]?.company_name
      // Auto-select first company
      if (firstCompanyId !== undefined) {
        setSelectedCompanyId?.(firstCompanyId)
      } else {
        // showNotification?.('No company available', 'warning')
      }
      return selectedCompanyId === undefined
    },
    [allCompanies?.allCompaniesList]
  )

  const selectedCompaniesText = useMemo(
    () => availableCompanies
      ?.find((currentCompany) => (typeof selectedCompanyId !== 'undefined' ? selectedCompanyId : SELECTED_STOCK_NONE) === currentCompany?.company_name)
      ?.company_name,
    [selectedCompanyId, availableCompanies]
  )

  return (
    <>
      <Box flexGrow={1} />
      <Button
        onClick={handleClick}
        color={isNoneSelected ? 'warning' : 'info'}
        endIcon={<BusinessIcon />}
      >
        {isNoneSelected ? 'Select Company' : selectedCompaniesText}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '.MuiPaper-root': {
            borderRadius: { xs: '4px' },
            padding: { xs: 0 }
          }
        }}
      >
        {availableCompanies?.map((availableCompany) => (
          <CompanyButton
            key={availableCompany?.company_name}
            company={availableCompany}
            handleClose={handleClose}
            selectedCompanyId={selectedCompanyId}
            setSelectedCompanyId={setSelectedCompanyId}
          />
        ))}
      </Menu>
    </>
  )
}

interface CompanyButtonProps {
  company: Company
  handleClose: () => void
  selectedCompanyId: string | undefined
  setSelectedCompanyId: (companyId: string) => void
}

const CompanyButton = ({ company, handleClose, selectedCompanyId, setSelectedCompanyId }: CompanyButtonProps): React.ReactElement => {
  const isSelected = selectedCompanyId === company.company_name

  const handleClickOnCompany = (): void => {
    setSelectedCompanyId?.(company.company_name ?? -1)
    // void router.push(config.startPagePath as string)
    handleClose()
  }

  return (
    <MenuItem onClick={handleClickOnCompany}>
      {isSelected ? <CheckIcon /> : null}
      {company.company_name}
    </MenuItem>
  )
}
