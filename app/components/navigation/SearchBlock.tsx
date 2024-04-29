import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import useDebounce from 'app/hooks/useDebounce'
import { fetchCompanies } from 'app/services/companies'

interface SearchBlockProps {
  children?: React.ReactNode
}

const SearchBlock = ({ children }: SearchBlockProps): React.ReactElement => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1em 0 3em'
      }}
    >
      <SearchField />
      {children}
    </Box>
  )
}

export default SearchBlock

const SearchField = (): React.ReactElement => {
  const [userInput, setUserInput] = useState<string>('')
  const debouncedUserInput = useDebounce(userInput, 500)

  const router = useRouter()
  const [listOptions, setListOptions] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string>('')

  useEffect(() => {
    async function fetchNewCompanies (): Promise<void> {
      const companies = await fetchCompanies({ filters: { company_name: debouncedUserInput } })
      const companyNames = companies.map(company => company.company_name)
      setListOptions(companyNames)
    }
    void fetchNewCompanies()
  }, [debouncedUserInput])

  return (
    <Autocomplete
      freeSolo
      options={listOptions}
      value={selectedOption}
      renderOption={(props, option) => (
        <li {...props} key={option}>{option}</li>
      )}
      onChange={(event, newSelectedOption) => {
        setSelectedOption(newSelectedOption ?? '')
        if (newSelectedOption !== null) {
          void router.push(`/companies?company_name=${newSelectedOption}`)
        } else {
          void router.push('/companies')
        }
      }}
      inputValue={userInput !== '' ? userInput : selectedOption}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Search for company'
          size='small'
          margin='normal'
        />
      )}
      onInputChange={(event, newInputValue) => {
        setUserInput(newInputValue)
      }}
      /*
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option) => option ?? '(none)'}
      */
      sx={{
        width: { xs: '90%', md: '30em' }
      }}
    />
  )
}
