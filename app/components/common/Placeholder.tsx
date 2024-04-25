import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface PlaceholderProps {
  title?: string
  height?: string
}

const Placeholder = ({ title = 'Placeholder', height = '10em' }: PlaceholderProps): React.ReactElement => {
  return (
    <Box
      sx={{
        width: '100%',
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        margin: '0.2em',
        borderRadius: '0.5em'
      }}
    >
      <Typography variant='h4' color='text.secondary'>
        {title}
      </Typography>
    </Box>
  )
}

export default Placeholder
