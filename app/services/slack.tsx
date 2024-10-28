import { WebClient } from '@slack/web-api'
import { error } from 'console'

// Initialize the Slack client with your bot token
const client = new WebClient(process.env.SLACK_BOT_TOKEN)

// Send the message to a specific channel
export async function postToSlack ({ jsonData, email, name }: { jsonData: object, email: string, name?: string }) {
  try {
    const message = `The user ${name} with email ${email} just submitted the following JSON:\n\`\`\`${JSON.stringify(jsonData, null, 2)}\`\`\``

    const response = await client.chat.postMessage({
      channel: '#data-submissions', // Replace with your channel ID
      text: message
    })

    if (response.ok) {
      console.log('Message sent successfully!')
      return response
    } else {
      console.error('Failed to send message:', response.error)
      return error
    }
  } catch (error) {
    console.error('Error sending message:', error)
    return error
  }
}
