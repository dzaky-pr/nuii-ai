import { type Model } from '@/lib/types/models'
import {
  convertToCoreMessages,
  CoreMessage,
  CoreToolMessage,
  generateId,
  JSONValue,
  Message,
  ToolInvocation
} from 'ai'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ExtendedCoreMessage } from '../types'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Takes an array of AIMessage and modifies each message where the role is 'tool'.
 * Changes the role to 'assistant' and converts the content to a JSON string.
 * Returns the modified messages as an array of CoreMessage.
 *
 * @param aiMessages - Array of AIMessage
 * @returns modifiedMessages - Array of modified messages
 */
export function transformToolMessages(messages: CoreMessage[]): CoreMessage[] {
  return messages.map(message =>
    message.role === 'tool'
      ? {
          ...message,
          role: 'assistant',
          content: JSON.stringify(message.content),
          type: 'tool'
        }
      : message
  ) as CoreMessage[]
}

/**
 * Sanitizes a URL by replacing spaces with '%20'
 * @param url - The URL to sanitize
 * @returns The sanitized URL
 */
export function sanitizeUrl(url: string): string {
  return url.replace(/\s+/g, '%20')
}

export function createModelId(model: Model): string {
  return `${model.providerId}:${model.id}`
}

export function getDefaultModelId(models: Model[]): string {
  if (!models.length) {
    throw new Error('No models available')
  }
  return createModelId(models[0])
}

function addToolMessageToChat({
  toolMessage,
  messages
}: {
  toolMessage: CoreToolMessage
  messages: Array<Message>
}): Array<Message> {
  return messages.map(message => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map(toolInvocation => {
          const toolResult = toolMessage.content.find(
            tool => tool.toolCallId === toolInvocation.toolCallId
          )

          if (toolResult) {
            return {
              ...toolInvocation,
              state: 'result',
              result: toolResult.result
            }
          }

          return toolInvocation
        })
      }
    }

    return message
  })
}

export function convertToUIMessages(
  messages: Array<ExtendedCoreMessage>
): Array<Message> {
  let pendingAnnotations: JSONValue[] = []
  let pendingReasoning: string | undefined

  return messages.reduce((chatMessages: Array<Message>, message) => {
    // Handle tool messages
    if (message.role === 'tool') {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages
      })
    }

    // Store data message content for next assistant message
    if (message.role === 'data') {
      if (
        message.content !== null &&
        message.content !== undefined &&
        typeof message.content !== 'string' &&
        typeof message.content !== 'number' &&
        typeof message.content !== 'boolean'
      ) {
        const content = message.content as JSONValue
        if (
          content &&
          typeof content === 'object' &&
          'type' in content &&
          'data' in content
        ) {
          if (content.type === 'reasoning') {
            pendingReasoning = content.data as string
          } else {
            pendingAnnotations.push(content)
          }
        }
      }
      return chatMessages
    }

    let textContent = ''
    let toolInvocations: Array<ToolInvocation> = []

    // Handle message content
    if (message.content) {
      if (typeof message.content === 'string') {
        textContent = message.content
      } else if (Array.isArray(message.content)) {
        for (const content of message.content) {
          if (content && typeof content === 'object' && 'type' in content) {
            if (content.type === 'text' && 'text' in content) {
              textContent += content.text
            } else if (
              content.type === 'tool-call' &&
              'toolCallId' in content &&
              'toolName' in content &&
              'args' in content
            ) {
              toolInvocations.push({
                state: 'call',
                toolCallId: content.toolCallId,
                toolName: content.toolName,
                args: content.args
              } as ToolInvocation)
            }
          }
        }
      }
    }

    // Create new message
    const newMessage: Message = {
      id: generateId(),
      role: message.role,
      content: textContent,
      toolInvocations: toolInvocations.length > 0 ? toolInvocations : undefined,
      // Add pending annotations and reasoning if this is an assistant message
      ...(message.role === 'assistant' && {
        ...(pendingAnnotations.length > 0 && {
          annotations: pendingAnnotations
        }),
        ...(pendingReasoning && { reasoning: pendingReasoning })
      })
    }

    chatMessages.push(newMessage)

    // Clear pending data after adding them
    if (message.role === 'assistant') {
      pendingAnnotations = []
      pendingReasoning = undefined
    }

    return chatMessages
  }, [])
}

export function convertToExtendedCoreMessages(
  messages: Message[]
): ExtendedCoreMessage[] {
  const result: ExtendedCoreMessage[] = []

  for (const message of messages) {
    // Convert annotations to data messages
    if (message.annotations && message.annotations.length > 0) {
      message.annotations.forEach(annotation => {
        result.push({
          role: 'data',
          content: annotation
        })
      })
    }

    // Convert reasoning to data message
    if (message.reasoning) {
      result.push({
        role: 'data',
        content: {
          type: 'reasoning',
          data: message.reasoning
        } as JSONValue
      })
    }

    // Convert current message
    const converted = convertToCoreMessages([message])
    result.push(...converted)
  }

  return result
}

export const parseResponse = (rawData: string) => {
  try {
    // Remove the "data: " prefix if present
    const jsonStr = rawData.startsWith('data: ')
      ? rawData.replace('data: ', '')
      : rawData
    const parsed = JSON.parse(jsonStr)
    const messageData = parsed.messageData
    const answer = messageData.content
    const image = messageData.data?.image || null
    const context = messageData.data?.context
      ? JSON.parse(messageData.data.context)
      : []
    return {
      answer,
      image,
      context: Array.isArray(context) ? context : [context]
    }
  } catch (error) {
    console.error('Error parsing response:', error)
    return { answer: 'Error parsing response', image: null, context: [] }
  }
}
