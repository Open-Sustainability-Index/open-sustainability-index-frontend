// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import { OpenAI } from 'openai'

import { getChatCompletion, createFunction, OpenAIFunctionParameterItems } from 'lib/openai'

export const config = {
  api: {
    bodyParser: false
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const form = formidable()

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: 'Error parsing the files' })
        return
      }

      const file = files.file[0] // Adjust if multiple files

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })

      try {
        const fileStream = fs.createReadStream(file.filepath)
        const openaiFile = { id: 'file-HzZtRG0zuft4SyeoRzqLD0EK' } // file1
        // const openaiFile = { id: 'file-kJfWw8U7ITF3h2l6zeUHiEjj' } // file2
        // const openaiFile = await openai.files.create({
        //   purpose: 'assistants',
        //   file: fileStream
        // })

        const openaiFile2 = await openai.files.retrieve(openaiFile.id);

        console.log('openaiFile2:', openaiFile2)

        // Add to Vector Store for folder analysis:
        // https://platform.openai.com/storage/vector_stores/vs_kyaPD1PqJWEZdX2lX8PZrArv
        // await openai.beta.vectorStores.files.create(
        //   'vs_kyaPD1PqJWEZdX2lX8PZrArv',
        //   { file_id: openaiFile.id }
        // );

        const analysis = await analyzeFile(openaiFile)
        console.log('analysis:', analysis)

        res.status(200).json({ message: 'File uploaded successfully', analysis })
      } catch (error) {
        res.status(500).json({ message: 'Error uploading the file', error })
      }
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler

export async function analyzeFile (file: OpenAI.Files.FileObject): Promise<void> {
  const analysisFunction = createFunction(
    'analyze_emissions_report',
    'Analyze a CO₂ emissions report based on the file provided. Don’t guess; leave blank if information is not available. All emission values should be converted to tonnes of CO₂ equivalents (t CO₂e).',
    {
      yearlyReports: {
        description: 'Retrieve emissions data for all years included in this file',
        type: 'array',
        items: {
          type: 'object',
          properties: YEARLY_REPORT_FIELDS
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
        content: `Help me analyze this CO₂ emissions report: ${file.id}.`,
        attachments: [{ file_id: file.id, tools: [{ type: "file_search" }] }],
      }
    ],
    [analysisFunction],
    true
  )
  const results = completion.tool_calls ?.[0].function.arguments !== undefined
    ? JSON.parse(completion.tool_calls ?.[0].function.arguments) as Record<string, string>
    : undefined
  return results
}

const YEARLY_REPORT_FIELDS: Record<string, OpenAIFunctionParameterItems> = {
  company_name: { type: 'string', description: 'Name of the company reporting emissions' },
  year: { type: 'integer', description: 'Year the data pertains to' },
  fiscal_year: { type: 'integer', description: 'Fiscal year the data pertains to' },
  industry: { type: 'string', description: 'Industry sector of the company' },
  isic_rev_4: { type: 'string', description: 'International Standard Industrial Classification code' },
  hq_country_move: { type: 'string', description: 'Country where company headquarters is located' },

  scope_1: { type: 'number', description: 'Direct emissions from owned or controlled sources' },
  scope_2_market_based: { type: 'number', description: 'Indirect emissions from the generation of purchased electricity, heat, and steam, based on market-based methods' },
  scope_2_location_based: { type: 'number', description: 'Indirect emissions from the generation of purchased electricity, heat, and steam, based on location-based methods' },
  scope_2_unknown: { type: 'number', description: 'Indirect emissions from purchased electricity with an unspecified method' },
  total_scope_3: { type: 'number', description: 'Total reported emissions for Scope 3' },
  total_emission_market_based: { type: 'number', description: 'Total emissions based on market-based methods' },
  total_emission_location_based: { type: 'number', description: 'Total emissions based on location-based methods' },
  total_reported_emission_scope_1_2: { type: 'number', description: 'Total reported emissions for Scope 1 and 2' },
  total_reported_emission_scope_1_2_3: { type: 'number', description: 'Total reported emissions for Scope 1, 2, and 3' },
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
  upstream_scope_3: { type: 'number', description: 'Total upstream Scope 3 emissions' },
  share_upstream_of_scope_3: { type: 'number', description: '% share of total upstream emissions in Scope 3' },
  scope_1_share_of_total_upstream_emissions: { type: 'number', description: '% share of Scope 1 emissions in total upstream emissions' },
  total_upstream_emissions: { type: 'number', description: 'Total upstream emissions in CO₂ equivalents' },
  revenue: { type: 'number', description: 'Company revenue' },
  currency: { type: 'string', description: 'Currency of the revenue' },
  revenue_million: { type: 'number', description: 'Company revenue in millions' },
  cradle_to_gate: { type: 'number', description: 'Emissions from cradle-to-gate activities' },
  ghg_standard: { type: 'string', description: 'Greenhouse gas accounting standard used' },
  emission_intensity: { type: 'number', description: 'Emission intensity (t CO₂e / million)' },

  source: { type: 'string', description: 'Source of the emissions data, e.g. name of company' },
  source_emissions_page_move: { type: 'integer', description: 'Report page number for emissions data' },
  source_emission_report: { type: 'string', description: 'Source report for emissions data' },
  emission_page: { type: 'integer', description: 'Report page number containing emission data' },
  source_emission_link: { type: 'string', description: 'Link to the source of the emission data' },
  source_revenue: { type: 'string', description: 'Source of the revenue data' },
  page_revenue: { type: 'integer', description: 'Report page number containing revenue data' },
  source_revenue_link: { type: 'string', description: 'Link to the source of the revenue data' },
  publication_date: { type: 'string', description: 'Date of publication of the data, format YYYY-MM-DD' },
  comment: { type: 'string', description: 'Additional comments or notes' },
  status: { type: 'string', description: 'Status of the data or report', enum: ['Not Started', 'Ongoing', 'Done'] }
}
