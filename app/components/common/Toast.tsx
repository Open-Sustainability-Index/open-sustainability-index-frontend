import React from 'react'
import { Snackbar, Alert } from '@mui/material'

export type ToastSeverity = 'info' | 'success' | 'warning' | 'error'

export interface ToastMessage {
  text: string
  severity?: ToastSeverity
}

interface ToastProps {
  message: ToastMessage | string | undefined
  onClose?: () => void
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <Snackbar
      open={message !== undefined}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
    >
      <Alert onClose={onClose} severity={typeof message === 'object' ? message.severity : 'info'} sx={{ width: '100%' }}>
        {typeof message === 'object' ? message.text : message}
      </Alert>
    </Snackbar>
  )
}
export default Toast
