import { getChat, saveChat } from '@/lib/actions/chat'
import { generateRelatedQuestions } from '@/lib/agents/generate-related-questions'
import { getMessageText } from '@/lib/utils'
import { convertToModelMessages, type UIMessageStreamWriter } from 'ai'
import type { ChatDataParts, ChatUIMessage } from '@/lib/types'

interface HandleStreamFinishParams {
  messages: ChatUIMessage[]
  model: string
  chatId: string
  writer: UIMessageStreamWriter<ChatUIMessage>
  skipRelatedQuestions?: boolean
}

export async function handleStreamFinish({
  messages,
  model,
  chatId,
  writer,
  skipRelatedQuestions = false
}: HandleStreamFinishParams) {
  try {
    let updatedMessages = messages

    if (!skipRelatedQuestions) {
      const loadingPart: {
        type: 'data-related-questions'
        data: ChatDataParts['related-questions']
      } = {
        type: 'data-related-questions',
        data: { items: [] }
      }
      writer.write(loadingPart)

      const modelMessages = await convertToModelMessages(messages, {
        convertDataPart: () => undefined
      })

      const relatedQuestions = await generateRelatedQuestions(modelMessages, model)

      const relatedPart: {
        type: 'data-related-questions'
        data: ChatDataParts['related-questions']
      } = {
        type: 'data-related-questions',
        data: relatedQuestions.object
      }
      writer.write(relatedPart)

      const lastAssistantIndex = [...messages]
        .reverse()
        .findIndex(message => message.role === 'assistant')
      if (lastAssistantIndex >= 0) {
        const targetIndex = messages.length - 1 - lastAssistantIndex
        updatedMessages = messages.map((message, index) =>
          index === targetIndex
            ? { ...message, parts: [...message.parts, relatedPart] }
            : message
        )
      }
    }

    if (process.env.NEXT_PUBLIC_ENABLE_SAVE_CHAT_HISTORY !== 'true') {
      return
    }

    const firstUserMessage = messages.find(message => message.role === 'user')
    const title = firstUserMessage ? getMessageText(firstUserMessage) : ''

    const savedChat = (await getChat(chatId)) ?? {
      messages: [],
      createdAt: new Date(),
      userId: 'anonymous',
      path: `/search/${chatId}`,
      title: title || 'New chat',
      id: chatId
    }

    await saveChat({
      ...savedChat,
      messages: updatedMessages
    }).catch(error => {
      console.error('Failed to save chat:', error)
      throw new Error('Failed to save chat history')
    })
  } catch (error) {
    console.error('Error in handleStreamFinish:', error)
    throw error
  }
}
