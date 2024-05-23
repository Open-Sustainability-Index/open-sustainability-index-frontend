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
  /* completion =
      {
        "id": "chatcmpl-7tZRAFDoVEGLmgAMEhFrso7aElOSH",
        "object": "chat.completion",
        "created": 1693478616,
        "model": "gpt-4-0613",
        "choices": [
          {
            "index": 0,
            "message": {
              "role": "assistant",
              "content": "Jag är en AI och kan inte se vad du har i din garderob eller vad vädret är där du är just nu. Däremot kan jag föreslå att du klär dig utifrån dagens väder och de aktiviteter du planerar att göra. Om det till exempel är kallt ute, ta på dig värmande kläder. Om du ska på ett formellt möte, välj mer professionella kläder."
            },
            "finish_reason": "stop"
          }
        ],
        "usage": {
          "prompt_tokens": 15,
          "completion_tokens": 106,
          "total_tokens": 121
        }
      }
  */
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
