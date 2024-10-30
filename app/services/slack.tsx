import { WebClient, ChatPostMessageResponse } from '@slack/web-api'

import jsonToTSV from 'app/utils/jsonToTSV'
import { config } from 'config/config'

// Initialize the Slack client with your bot token
const client = new WebClient(process.env.SLACK_BOT_TOKEN)

interface PostToSlackProps {
  companyName: string
  jsonData: Array<{ [key: string]: any }>
  email: string
  name?: string
}

// Send the message to a specific channel
export async function postToSlack ({ companyName, jsonData, email, name }: PostToSlackProps): Promise<ChatPostMessageResponse | string | unknown | undefined> {
  try {
    const message = `${(name !== undefined ? name : '(Someone)')} with email ${email !== undefined ? email : '(n/a)'} just submitted the following data for *${companyName}*:\n\`\`\`${JSON.stringify(jsonData, null, 2)}\`\`\`\nHere is the CSV version for easy insert into Supabase:\n\`\`\`${jsonToTSV(jsonData, undefined, undefined, ',')}\`\`\``

    if (config.sendRealMessages === false) {
      console.log('Message not sent because sendRealMessages is false:', message)
      return
    }

    const response = await client.chat.postMessage({
      channel: '#data-submissions',
      text: message
    })

    if (response.ok) {
      console.log('Message sent successfully!')
      return response
    } else {
      console.error('Failed to send message:', response.error)
      return response.error
    }
  } catch (error: unknown) {
    console.error('Error sending message:', error)
    return error
  }
}
