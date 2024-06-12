import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import useDebounce from 'app/hooks/useDebounce';
import { fetchSearch } from 'app/services/search';
import toSlug from 'lib/toSlug';
import { SearchResult } from 'types/global';

interface SearchBlockProps {
  children?: React.ReactNode;
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
        padding: '1em 0 3em',
      }}
    >
      <SearchField />
      {children}
    </Box>
  );
};

export default SearchBlock;

const SearchField = (): React.ReactElement => {
  const [userInput, setUserInput] = useState<string>('');
  const debouncedUserInput = useDebounce(userInput, 500);

  const router = useRouter();
  const [listOptions, setListOptions] = useState<SearchResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<SearchResult>();

  useEffect(() => {
    async function fetchNewCompanies(): Promise<void> {
      const searchResults: Awaited<ReturnType<typeof fetchSearch>> = await (
        await fetch(`/api/search?query=${encodeURIComponent(debouncedUserInput as string)}`)
      ).json();
      const resultNames = searchResults;
      setListOptions(resultNames);
    }
    void fetchNewCompanies();
  }, [debouncedUserInput]);

  return (
    <Autocomplete
      options={listOptions}
      value={selectedOption}
      renderOption={(props, option) => (
        <li {...props} key={option.slug}>
          {option.name}
        </li>
      )}
      onChange={(event, newSelectedOption) => {
        setSelectedOption(newSelectedOption as SearchResult);
        if (newSelectedOption !== null) {
          void router.push(`/company/${newSelectedOption?.slug}`);
        } else {
          void router.push('/companies');
        }
      }}
      inputValue={userInput !== '' ? userInput : selectedOption?.name}
      renderInput={(params) => (
        <TextField {...params} label='Search for company' size='small' margin='normal' />
      )}
      onInputChange={(event, newInputValue) => {
        setUserInput(newInputValue);
      }}
      getOptionLabel={(option) => option.name ?? '(none)'}
      /*
      isOptionEqualToValue={(option, value) => option === value}
      */
      sx={{
        width: { xs: '90%', md: '30em' },
      }}
    />
  );
};
