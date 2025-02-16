import { createToolCallingStreamResponse } from '@/lib/streaming/create-tool-calling-stream'
import { FastAPIResponse } from '@/lib/types'
import { cookies } from 'next/headers'

export const maxDuration = 30

// Helper function to create a stream response
function createStreamResponse(data: any) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Format the data as a stream
      controller.enqueue(
        encoder.encode('data: ' + JSON.stringify(data) + '\n\n')
      )
      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  })
}

export async function POST(req: Request) {
  try {
    console.log('🚀 Request received')
    const { messages, id: chatId } = await req.json()
    console.log('📨 Parsed request:', { messages, chatId })

    const referer = req.headers.get('referer')
    const isSharePage = referer?.includes('/share/')
    if (isSharePage) {
      console.log('❌ Share page detected')
      return new Response('Chat API is not available on share pages', {
        status: 403,
        statusText: 'Forbidden'
      })
    }

    const cookieStore = await cookies()
    const searchMode = cookieStore.get('search-mode')?.value === 'true'
    console.log('🔍 Search mode:', searchMode)

    // Get last user message
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg: any) => msg.role === 'user')

    if (!lastUserMessage) {
      console.log('❌ No user message found')
      return new Response(JSON.stringify({ error: 'No user message found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    console.log('💬 Last user message:', lastUserMessage)

    // If search mode is enabled, use tool calling stream response
    if (searchMode) {
      console.log('🔄 Using tool calling stream response')
      return createToolCallingStreamResponse({
        messages,
        model: 'nuii-ai',
        chatId,
        searchMode
      })
    }

    // FastAPI request
    console.log('🌐 Sending request to FastAPI')
    const fastapiPayload = { query: lastUserMessage.content }
    console.log('📦 FastAPI payload:', fastapiPayload)

    const fastapiRes = await fetch(
      'https://2jn9o6pnnztizk-11436.proxy.runpod.net/tanya',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fastapiPayload)
      }
    )

    console.log('📥 FastAPI response status:', fastapiRes.status)

    if (!fastapiRes.ok) {
      const errorText = await fastapiRes.text()
      console.error('❌ FastAPI error:', errorText)
      return new Response(
        JSON.stringify({
          error: 'Error calling FastAPI',
          details: errorText
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const fastapiData: FastAPIResponse = await fastapiRes.json()
    console.log('📄 FastAPI data:', fastapiData)

    // Create assistant message
    const assistantMessage = {
      id: new Date().getTime().toString(),
      role: 'assistant',
      content: fastapiData.answer,
      data: fastapiData
    }
    console.log('🤖 Assistant message:', assistantMessage)

    // Return as stream format
    return createStreamResponse({ messageData: assistantMessage })
  } catch (error) {
    console.error('💥 API route error:', error)
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
