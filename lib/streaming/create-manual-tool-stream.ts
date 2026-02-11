import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText
} from 'ai'
import { getChat, saveChat } from '@/lib/actions/chat'
import { manualResearcher } from '../agents/manual-researcher'
import { getMaxAllowedTokens, truncateMessages } from '../utils/context-window'
import { executeToolCall } from './tool-execution'
import { BaseStreamConfig } from './types'
import { getMessageText } from '../utils'
import type { ChatUIMessage } from '../types'

export function createManualToolStreamResponse(config: BaseStreamConfig) {
  const stream = createUIMessageStream<ChatUIMessage>({
    originalMessages: config.messages,
    execute: async ({ writer }) => {
      const { messages, model, searchMode } = config
      try {
        const modelMessages = await convertToModelMessages(messages, {
          convertDataPart: () => undefined
        })
        const truncatedMessages = truncateMessages(
          modelMessages,
          getMaxAllowedTokens(model)
        )

        const toolCallMessages = await executeToolCall(
          truncatedMessages,
          writer,
          model,
          searchMode
        )

        const researcherConfig = manualResearcher({
          messages: [...truncatedMessages, ...toolCallMessages],
          model,
          isSearchEnabled: searchMode
        })

        const result = streamText({
          ...researcherConfig
        })

        writer.merge(result.toUIMessageStream({ sendReasoning: true }))
      } catch (error) {
        console.error('Stream execution error:', error)
      }
    },
    onFinish: async ({ messages }) => {
      if (process.env.NEXT_PUBLIC_ENABLE_SAVE_CHAT_HISTORY !== 'true') {
        return
      }

      const firstUserMessage = messages.find(message => message.role === 'user')
      const title = firstUserMessage ? getMessageText(firstUserMessage) : ''

      const savedChat = (await getChat(config.chatId)) ?? {
        messages: [],
        createdAt: new Date(),
        userId: 'anonymous',
        path: `/search/${config.chatId}`,
        title: title || 'New chat',
        id: config.chatId
      }

      await saveChat({
        ...savedChat,
        messages
      }).catch(error => {
        console.error('Failed to save chat:', error)
        throw new Error('Failed to save chat history')
      })
    },
    onError: error => {
      console.error('Stream error:', error)
      return error instanceof Error ? error.message : String(error)
    }
  })

  return createUIMessageStreamResponse({ stream })
}
