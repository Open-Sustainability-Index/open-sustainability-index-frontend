import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import 'swagger-ui-react/swagger-ui.css'
const SwaggerUI = dynamic(import('swagger-ui-react'), { ssr: false }) as any

const APIDocs = (): React.ReactElement => {
  const [spec, setSpec] = useState()

  useEffect(() => {
    async function get (): Promise<void> {
      const data = await (
        await fetch('https://api.opensustainabilityindex.org/openapi.json')
      ).json()
      setSpec(data)
    }
    void get()
  }, [])

  return (
    <SwaggerUI spec={spec} />
  )
}
export default APIDocs
