import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'

import { EmissionAiInsert } from 'types/global'
import { supabase } from 'lib/supabase'
import { getChatCompletion, createFunction, OpenAIFunctionParameterItems } from 'lib/openai'
import { toSlugWithPeriods } from 'lib/toSlug'
import { formatDateNoDash } from 'lib/formatDate'

export const config = {
  api: {
    bodyParser: false
  }
}

const SUPABASE_BUCKET_NAME = 'ai-image-uploads'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'POST') {
    const form = formidable()

    form.parse(req, (err, fields, files) => {
      if (err !== null) {
        res.status(500).json({ message: 'Error parsing the files' })
        return
      }
      const file = files.file?.[0] // Adjust if multiple files
      if (file === undefined) {
        res.status(400).json({ message: 'No file uploaded' })
        return
      }
      const specialInstructions = fields.specialInstructions as unknown as string
      void handleFileUpload(file, specialInstructions, res)
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler

const handleFileUpload = async (file: formidable.File, specialInstructions: string, res: NextApiResponse): Promise<void> => {
  try {
    // Read the file content
    const fileContent = fs.readFileSync(file.filepath)
    const fileName = `${formatDateNoDash(new Date())}-${toSlugWithPeriods(file.originalFilename ?? 'file')}`

    // Upload to Supabase Storage
    const uploadResults = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(fileName, fileContent, { contentType: file.mimetype ?? 'image/png' })

    if (uploadResults.error !== null && uploadResults.error.message !== 'The resource already exists') {
      throw uploadResults.error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .getPublicUrl(fileName)

    const analysis = await analyzeFile(publicUrl, specialInstructions)
    console.log('analysis:', analysis)

    res.status(200).json({ message: 'File analysis successfully', analysis })
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing the file', error })
  }
}

export async function analyzeFile (imageUrl: string, specialInstructions: string): Promise<any> {
  const analysisFunction = createFunction(
    'analyze_emissions_report',
    'Analyze a CO₂ emissions report based on the image provided. Don’t guess; leave blank if information is not available. All emission values should be converted to whole tonnes of CO₂ equivalents (t CO₂e). Convert from thousand tonnes and million tonnes (Mt or mt) to whole tonnes (t) if needed.',
    {
      yearlyReports: {
        description: 'Retrieve emissions data for all years included in this image',
        type: 'array',
        items: {
          type: 'object',
          properties: YEARLY_REPORT_FIELDS,
          required: [
            'all_cats',
            'scope_1',
            'cat_1'
          ]
        }
      }
    },
    [
      'yearlyReports'
    ]
  )
  const completion = await getChatCompletion(
    [
      {
        role: 'system',
        content: 'You are a helpful CO₂ emissions report coach designed to output JSON.'
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: `Help me analyze the company emissions report in this image. ${specialInstructions}` },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ],
    [analysisFunction],
    true
  )
  const results = completion.tool_calls?.[0].function.arguments !== undefined
    ? JSON.parse(completion.tool_calls?.[0].function.arguments) as Record<string, string>
    : undefined
  return results
}

const YEARLY_REPORT_FIELDS: Record<keyof EmissionAiInsert, OpenAIFunctionParameterItems> = {
  year: { type: 'integer', description: 'Year the data pertains to' },
  fiscal_year: { type: 'integer', description: 'Fiscal year the data pertains to' },

  scope_1: { type: 'number', description: 'Direct emissions from owned or controlled sources' },
  scope_2_market_based: { type: 'number', description: 'Indirect emissions from the generation of purchased electricity, heat, and steam, based on market-based methods' },
  scope_2_location_based: { type: 'number', description: 'Indirect emissions from the generation of purchased electricity, heat, and steam, based on location-based methods' },
  scope_2_unknown: { type: 'number', description: 'Indirect emissions from purchased electricity with an unspecified method' },
  total_scope_3: { type: 'number', description: 'Total reported emissions for Scope 3' },
  cat_1: { type: 'number', description: 'Emissions in Category 1: Purchased goods and services' },
  cat_2: { type: 'number', description: 'Emissions in Category 2: Capital goods' },
  cat_3: { type: 'number', description: 'Emissions in Category 3: Fuel- and energy-related activities not included in Scope 1 or 2' },
  cat_4: { type: 'number', description: 'Emissions in Category 4: Upstream transportation and distribution' },
  cat_5: { type: 'number', description: 'Emissions in Category 5: Waste generated in operations' },
  cat_6: { type: 'number', description: 'Emissions in Category 6: Business travel' },
  cat_7: { type: 'number', description: 'Emissions in Category 7: Employee commuting' },
  cat_8: { type: 'number', description: 'Emissions in Category 8: Upstream leased assets' },
  cat_9: { type: 'number', description: 'Emissions in Category 9: Downstream transportation and distribution' },
  cat_10: { type: 'number', description: 'Emissions in Category 10: Processing of sold products' },
  cat_11: { type: 'number', description: 'Emissions in Category 11: Use of sold products' },
  cat_12: { type: 'number', description: 'Emissions in Category 12: End-of-life treatment of sold products' },
  cat_13: { type: 'number', description: 'Emissions in Category 13: Downstream leased assets' },
  cat_14: { type: 'number', description: 'Emissions in Category 14: Franchises' },
  cat_15: { type: 'number', description: 'Emissions in Category 15: Investments' },
  all_cats: { type: 'number', description: 'Total emissions from all categories' },
  ghg_standard: { type: 'string', description: 'Greenhouse gas accounting standard used' },

  revenue: { type: 'number', description: 'Company revenue, converted to million USD' },
  revenue_local: { type: 'number', description: 'Company revenue, in millions in the specified currency' },
  currency: { type: 'string', description: 'The specified currency of the revenue' },

  source_emissions_page_move: { type: 'integer', description: 'Report page number for emissions data' },
  source_emission_report: { type: 'string', description: 'Source report for emissions data' },
  emission_page: { type: 'integer', description: 'Report page number containing emission data' },
  source_emission_link: { type: 'string', description: 'Link to the source of the emission data' },
  source_revenue: { type: 'string', description: 'Source of the revenue data' },
  page_revenue: { type: 'integer', description: 'Report page number containing revenue data' },
  source_revenue_link: { type: 'string', description: 'Link to the source of the revenue data' },
  publication_date: { type: 'string', description: 'Date of publication of the data, format YYYY-MM-DD' },
  status: { type: 'string', description: 'Status of the data or report', enum: ['Not Started', 'Ongoing', 'Done'] }
}
