import React from 'react'
import { Box, Typography } from '@mui/material'
import { COLORS } from 'app/theme/theme'

interface InfoHelpBoxProps {
  title?: string
  instructions?: string[]
}

const InfoHelpBox: React.FC<InfoHelpBoxProps> = ({ title = 'Information', instructions }) => {
  return (
    <Box
      sx={{
        backgroundColor: COLORS.GRAY_LIGHT,
        borderRadius: '4px',
        padding: '1em',
        margin: '0.5em 0'
      }}
    >
      {title !== undefined && (
        <Typography variant={(instructions?.length ?? 0) > 0 ? 'h3' : 'body2'} sx={{ fontSize: '1em', margin: '0' }} gutterBottom>
          {title}
        </Typography>
      )}
      {(instructions?.length ?? 0) > 0 && (
        <Box component='ol' sx={{ paddingLeft: '2em', margin: 0 }}>
          {instructions?.map((instruction, index) => (
            <Typography component='li' variant='body2' key={index} sx={{ fontSize: '1em', margin: '0.5em' }}>
              {instruction}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default InfoHelpBox
