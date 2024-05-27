import { DataTableHeader } from 'app/components/common/DataTable'

interface JSONObject { [key: string]: any }

export default function jsonToTSV (
  jsonArray: JSONObject[],
  headers?: readonly DataTableHeader[],
  includeHeaders = true
): string {
  if (jsonArray.length === 0) return ''

  // Determine headers
  let headerFields: string[]
  if (headers !== undefined) {
    headerFields = headers.map(header => header.field)
  } else {
    headerFields = Object.keys(jsonArray[0])
  }

  const tsvArray = []

  // Join headers with a tab character
  if (includeHeaders) {
    const headerLabels = (headers !== undefined) ? headers.map(header => header.label ?? header.field) : headerFields
    tsvArray.push(headerLabels.join('\t'))
  }

  // Process each JSON object into a TSV string
  jsonArray.forEach(obj => {
    const row = headerFields.map(field => obj[field])
    tsvArray.push(row.join('\t'))
  })

  // Join all rows with a newline character
  return tsvArray.join('\n')
}
