import React from 'react'
import { Box, Typography } from '@mui/material'

interface InfoHelpBoxProps {
  title?: string
  instructions?: string[]
}

const InfoHelpBox: React.FC<InfoHelpBoxProps> = ({ title = 'Information', instructions }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#FFF9C4',
        border: '1px solid #F0E68C',
        borderRadius: '8px',
        padding: '1em'
      }}
    >
      {title !== undefined && (
        <Typography variant='h3' sx={{ fontSize: '1em' }} gutterBottom>
          {title}
        </Typography>
      )}
      {(instructions?.length ?? 0) > 0 && (
        <Box component='ul' sx={{ paddingLeft: '2em', margin: 0 }}>
          {instructions?.map((instruction, index) => (
            <Typography component='li' variant='body2' key={index} sx={{ fontSize: '1em' }}>
              {instruction}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default InfoHelpBox
