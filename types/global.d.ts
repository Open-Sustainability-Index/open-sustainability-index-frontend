declare module 'postgraphile-plugin-nested-mutations'
declare module 'react-toastify'

declare global {
  interface Window {
    gtag: (event: string, action: string, options: any) => void
  }
}

interface SeoProps {
  title: string
  description: string
  imageUrl?: string
}

interface Company {
  Name: string
  Source: string
  Year: string
  'Company DB Input': string
  Industry: string
  'ISIC Rev. 4.': string
  'HQ Country (move)': string
  'Fr. Client (y/n)': string
  'Scope 1\n(t CO₂e)': string
  'Scope 2\n(t CO₂e)': string
  'Scope 2 type': string
  'Scope 2\n(CO₂e) \nMarket-based': string
  'Scope 2\n(CO₂e) \nLocation-based': string
  'Scope 2\n(CO₂e) \nUnknown': string
  'Total Scope 3\n(CO₂e)': string
  'Total Emissions\n(t CO₂e) - - Market-based': string
  'Total Emissions\n(t CO₂e) - Location-based': string
  'Total Reported Emissions (Scope 1+2+3)\n(CO₂e)': string
  'CO₂e factor': string
  'Cat. 1': string
  'Cat. 2': string
  'Cat. 3': string
  'Cat. 4': string
  'Cat. 5': string
  'Cat. 6': string
  'Cat. 7': string
  'Cat. 8': string
  'Cat. 9': string
  'Cat. 10': string
  'Cat. 11': string
  'Cat. 12': string
  'Cat. 13': string
  'Cat. 14': string
  'Cat. 15': string
  'All cats?\n': string
  '': string
  'Upstream Scope 3\n(t CO₂e)': string
  'Share Upstream of Scope 3': string
  'Scope 1 share of total upstream emissions': string
  'Total Upstream Emissions\n(t CO₂e) ': string
  'Revenue (million)': string
  'Factor (x1000, etc.)': string
  Currency: string
  'Revenue \n(SEK)': string
  'Cradle-to-gate emissions / SEK\n(kg CO₂e)': string
  'GHG Standard': string
  'Source emisions page (MOVE)': string
  'Source Emissions / Report': string
  'Emissions Page': string
}
