declare module 'postgraphile-plugin-nested-mutations'
declare module 'react-toastify'

declare global {
  interface Window {
    gtag: (event: string, action: string, options: any) => void
  }
}

interface Company {
  name: string
  id?: number
  symbol?: string
}
