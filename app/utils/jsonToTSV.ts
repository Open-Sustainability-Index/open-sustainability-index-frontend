interface JSONObject { [key: string]: any }

export default function jsonToTSV (jsonArray: JSONObject[], includeHeaders = true): string {
  if (jsonArray.length === 0) return ''

  // Extract headers
  const headers = Object.keys(jsonArray[0])

  const tsvArray = []

  // Join headers with a tab character
  if (includeHeaders) {
    tsvArray.push(headers.join('\t'))
  }

  // Process each JSON object into a TSV string
  jsonArray.forEach(obj => {
    const row = headers.map(header => obj[header])
    tsvArray.push(row.join('\t'))
  })

  // Join all rows with a newline character
  return tsvArray.join('\n')
}
