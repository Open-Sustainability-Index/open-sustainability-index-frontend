import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import useDebounce from 'app/hooks/useDebounce'
import { fetchCompanies } from 'app/services/companies'

// interface SearchBlockProps {
// }

const SearchBlock = (): React.ReactElement => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1em 0 3em'
      }}
    >
      <SearchField />
    </Box>
  )
}

export default SearchBlock

const SearchField = (): React.ReactElement => {
  const [userInput, setUserInput] = useState<string>('')
  const debouncedUserInput = useDebounce(userInput, 500)

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
      }}
      inputValue={userInput !== '' ? userInput : selectedOption}
      renderInput={(params) => (
        <TextField {...params} label='Search...' />
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
