import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// interface SearchBlockProps {
// }

const SearchBlock = (): React.ReactElement => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '2em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography variant='body1' color='text.secondary' />
    </Box>
  )
}

export default SearchBlock
