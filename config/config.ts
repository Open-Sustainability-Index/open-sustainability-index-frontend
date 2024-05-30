import packageJson from '../package.json'
import manifest from '../public/manifest.json'

export const environment = process.env.NODE_ENV
export const isDevelopment = process.env.NODE_ENV === 'development'
const appSlug = 'climate-wiki-frontend'
const serverPort = parseInt(process.env.PORT ?? '5174')

interface EnvironmentConfiguration {
  appSlug: string
  appVersion: string
  appUrl: string
  appName: string
  appTagline?: string
  appDescription?: string
  serverPort: number
  locale?: string
  googleAnalyticsId?: string | null
  fonts?: string[][]

  startPagePath?: string
  apiBaseUrl?: string
  graphqlPath?: string
  databaseUrl?: string
  allowedHostsList?: string[]

  isDevelopment: boolean
  sendRealMessages?: boolean
}

interface AllConfigurations {
  default?: EnvironmentConfiguration
  development?: Partial<EnvironmentConfiguration>
  production?: Partial<EnvironmentConfiguration>
  test?: Partial<EnvironmentConfiguration>
}

const completeConfig: AllConfigurations = {

  default: {
    serverPort,
    appSlug,
    appVersion: packageJson.version,
    appUrl: process.env.APP_URL ?? 'https://www.opensustainabilityindex.org/',
    appName: manifest.name,
    appTagline: manifest.description,
    appDescription: manifest.description,
    isDevelopment,
    locale: 'en_US',
    fonts: [
      ['Open Sans', 'wght@300;400;500;700']
    ],
    googleAnalyticsId: 'G-ZFQELW8YR1',
    databaseUrl: process.env.POSTGRES_URL,
    graphqlPath: '/api/graphql',
    apiBaseUrl: process.env.BACKEND_BASE_URL ?? 'https://api.opensustainabilityindex.org/v1/'
  },

  development: {
    appUrl: `http://localhost:${serverPort}/`,
    googleAnalyticsId: null
  },

  production: {
  }

}

// Public API
export const config = { ...completeConfig.default, ...completeConfig[environment] }
export default config
