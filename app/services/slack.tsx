import { WebClient, ChatPostMessageResponse } from '@slack/web-api'
import jsonToTSV from 'app/utils/jsonToTSV'

// Initialize the Slack client with your bot token
const client = new WebClient(process.env.SLACK_BOT_TOKEN)

// Send the message to a specific channel
export async function postToSlack ({ jsonData, email, name }: { jsonData: Array<{ [key: string]: any }>, email: string, name?: string }): Promise<ChatPostMessageResponse | string | unknown | undefined> {
  try {
    const message = `${name as string ?? '(Someone)'} with email ${email ?? 'n/a'} just submitted the following data:\n\`\`\`${JSON.stringify(jsonData, null, 2)}\`\`\`\nHere is the CSV version for easy insert into Supabase:\n\`\`\`${jsonToTSV(jsonData, undefined, undefined, ',')}\`\`\``

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
