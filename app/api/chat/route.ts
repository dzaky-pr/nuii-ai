import { createManualToolStreamResponse } from '@/lib/streaming/create-manual-tool-stream'
import { convertToUIMessages, getMessageText } from '@/lib/utils'
import { isProviderEnabled } from '@/lib/utils/registry'
import { cookies } from 'next/headers'

export const maxDuration = 30

const DEFAULT_MODEL = 'groq:llama-3.3-70b-versatile'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = convertToUIMessages(body.messages ?? [])
    const chatId = body.id
    const referer = req.headers.get('referer')
    const isSharePage = referer?.includes('/share/')

    if (isSharePage) {
      return new Response('Chat API is not available on share pages', {
        status: 403,
        statusText: 'Forbidden'
      })
    }

    const cookieStore = await cookies()
    const modelFromCookie = cookieStore.get('selected-model')?.value
    const searchMode = cookieStore.get('search-mode')?.value === 'true'
    const model = modelFromCookie || DEFAULT_MODEL
    const provider = model.split(':')[0]
    if (!isProviderEnabled(provider)) {
      return new Response(`Selected provider is not enabled ${provider}`, {
        status: 404,
        statusText: 'Not Found'
      })
    }
    if (provider === 'nuii-ai') {
      const lastMessage = messages[messages.length - 1]
      const userQuery = lastMessage ? getMessageText(lastMessage) : ''
      const response = await fetch(`${process.env.RUNPOD_SERVER_URL}/tanya`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery })
      })
      if (!response.ok) {
        throw new Error(`NUII API error: ${response.statusText}`)
      }
      const data = await response.json()

      const finalObj = {
        answer: data.answer,
        image: data.image
      }

      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          const chunkStr = 'data: ' + JSON.stringify(finalObj) + '\n\n'
          controller.enqueue(encoder.encode(chunkStr))
          controller.close()
        }
      })
      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache'
        }
      })
    }

    // Gunakan createManualToolStreamResponse untuk semua provider lain
    return createManualToolStreamResponse({
      messages,
      model,
      chatId,
      searchMode
    })
  } catch (error) {
    console.error('API route error:', error)
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        status: 500
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
