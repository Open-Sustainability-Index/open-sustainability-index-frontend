import OpenAI from 'openai'

export type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessage
export type ChatInputMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam
export type ChatRole = 'system' | 'assistant' | 'user' | 'tool' | 'function'

export const getChatCompletion = async (
  messages: ChatInputMessage[],
  functions?: OpenAIFunction[],
  asJSON = true,
  aiModel = { model: 'gpt-4o' }
): Promise<ChatMessage> => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const completion = await openai.chat.completions.create({
    model: aiModel.model,
    messages,
    ...(asJSON ? { response_format: { type: 'json_object' } } : {}),
    ...(functions !== undefined
      ? {
          tools: functions.map(func => ({
            type: 'function',
            function: func
          })),
          tool_choice: { type: 'function', function: { name: functions[0].name } }
        }
      : {})
  })
  console.log(`\nUsage tokens: ${completion.usage ?.prompt_tokens}/${completion.usage ?.completion_tokens}, est. cost $${((completion.usage ?.prompt_tokens ?? 0) * 0.005 / 1000 + (completion.usage ?.completion_tokens ?? 0) * 0.015 / 1000).toFixed(4)}`);
  const response = completion.choices[0].message
  return response
}

export interface OpenAIFunctionParameterItems {
  type: 'string' | 'integer' | 'number' | 'boolean' | 'object' | 'array'
  description?: string
  items?: OpenAIFunctionParameterItems
  properties?: Record<string, OpenAIFunctionParameterItems>
  enum?: Array<string | number | boolean>
  required?: string[]
}

type OpenAIFunctionParameters = Record<string, OpenAIFunctionParameterItems>

interface OpenAIFunction {
  name: string
  description?: string
  parameters: {
    type: 'object'
    properties: OpenAIFunctionParameters
    required?: string[]
  }
}

export const createFunction = (name: string, description?: string, properties: OpenAIFunctionParameters = {}, required?: string[]): OpenAIFunction => {
  const aiFunction: OpenAIFunction = {
    name,
    description,
    parameters: {
      type: 'object',
      properties,
      required
    }
  }
  return aiFunction
}

export const getImage = async (imagePrompt: string, size: '512x512' = '512x512'): Promise<string | undefined> => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const response = await openai.images.generate({
    prompt: imagePrompt,
    n: 1,
    size
  })
  return response.data[0].url
}

// export const getAudioTranscription = async (readStream: fs.ReadStream): Promise<string | undefined> => {
//   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
//   const transcription = await openai.audio.transcriptions.create({
//     file: readStream,
//     model: 'whisper-1'
//   })
//   return transcription.text
// }
