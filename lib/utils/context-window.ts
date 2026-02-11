import { ModelMessage } from 'ai'

const DEFAULT_CONTEXT_WINDOW = 128_000
const DEFAULT_RESERVE_TOKENS = 30_000

export function getMaxAllowedTokens(modelId: string): number {
  let contextWindow: number
  let reserveTokens: number

  contextWindow = DEFAULT_CONTEXT_WINDOW
  reserveTokens = DEFAULT_RESERVE_TOKENS

  return contextWindow - reserveTokens
}

export function truncateMessages(
  messages: ModelMessage[],
  maxTokens: number
): ModelMessage[] {
  let totalTokens = 0
  const tempMessages: ModelMessage[] = []

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    const messageTokens = estimateMessageTokens(message)

    if (totalTokens + messageTokens <= maxTokens) {
      tempMessages.push(message)
      totalTokens += messageTokens
    } else {
      break
    }
  }

  const orderedMessages = tempMessages.reverse()

  while (orderedMessages.length > 0 && orderedMessages[0].role !== 'user') {
    orderedMessages.shift()
  }

  return orderedMessages
}

function estimateMessageTokens(message: ModelMessage): number {
  if (typeof message.content === 'string') {
    return message.content.length
  }
  if (Array.isArray(message.content)) {
    return message.content.reduce((total, part) => {
      if (part && typeof part === 'object' && 'text' in part) {
        return total + String(part.text ?? '').length
      }
      return total
    }, 0)
  }
  return 0
}
