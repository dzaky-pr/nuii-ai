import { type Model } from '@/lib/types/models'
import { generateId, JSONValue } from 'ai'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ChatDataParts, ChatUIMessage, ToolInvocation } from '../types'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

type LegacyMessage = {
  id?: string
  role: string
  content?: unknown
  annotations?: JSONValue[]
  toolInvocations?: ToolInvocation[]
  reasoning?: string
}

type ChatDataPart =
  | {
      type: 'data-tool_call'
      id?: string
      data: ChatDataParts['tool_call']
    }
  | {
      type: 'data-related-questions'
      id?: string
      data: ChatDataParts['related-questions']
    }

function isChatUIMessage(value: unknown): value is ChatUIMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as ChatUIMessage).parts)
  )
}

function extractTextContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map(part => {
        if (part && typeof part === 'object' && 'type' in part) {
          if ((part as { type: string }).type === 'text' && 'text' in part) {
            return String((part as { text: string }).text)
          }
        }
        return ''
      })
      .join('')
  }
  return ''
}

function asToolCallDataPart(tool: ToolInvocation): ChatDataPart {
  return {
    type: 'data-tool_call',
    id: tool.toolCallId,
    data: {
      toolCallId: tool.toolCallId,
      toolName: tool.toolName,
      state: tool.state,
      args: tool.args,
      result: tool.result
    }
  }
}

function annotationToDataPart(annotation: JSONValue): ChatDataPart | null {
  if (!annotation || typeof annotation !== 'object') return null
  if (!('type' in annotation) || !('data' in annotation)) return null

  const typed = annotation as { type: string; data: unknown }
  if (typed.type === 'tool_call') {
    const data = typed.data as ChatDataParts['tool_call']
    return {
      type: 'data-tool_call',
      id: data.toolCallId,
      data
    }
  }
  if (typed.type === 'related-questions') {
    return {
      type: 'data-related-questions',
      data: typed.data as ChatDataParts['related-questions']
    }
  }
  return null
}

export function convertToUIMessages(messages: unknown[]): ChatUIMessage[] {
  if (!Array.isArray(messages) || messages.length === 0) return []
  if (isChatUIMessage(messages[0])) return messages as ChatUIMessage[]

  const result: ChatUIMessage[] = []
  const pendingDataParts: ChatDataPart[] = []
  let pendingReasoning: string | undefined

  for (const rawMessage of messages as LegacyMessage[]) {
    if (!rawMessage || typeof rawMessage !== 'object') {
      continue
    }

    if (rawMessage.role === 'data') {
      const annotation = rawMessage.content as JSONValue
      const dataPart = annotationToDataPart(annotation)
      if (dataPart) {
        pendingDataParts.push(dataPart)
        continue
      }
      if (
        annotation &&
        typeof annotation === 'object' &&
        'type' in annotation &&
        annotation.type === 'reasoning' &&
        'data' in annotation
      ) {
        pendingReasoning = String(annotation.data)
      }
      continue
    }

    const parts: ChatUIMessage['parts'] = []

    if (rawMessage.role === 'assistant') {
      if (pendingReasoning) {
        parts.push({ type: 'reasoning', text: pendingReasoning })
        pendingReasoning = undefined
      }
      if (pendingDataParts.length > 0) {
        parts.push(...pendingDataParts)
        pendingDataParts.length = 0
      }
    }

    if (rawMessage.reasoning) {
      parts.push({ type: 'reasoning', text: rawMessage.reasoning })
    }

    const textContent = extractTextContent(rawMessage.content)
    if (textContent) {
      parts.push({ type: 'text', text: textContent })
    }

    if (Array.isArray(rawMessage.annotations)) {
      rawMessage.annotations
        .map(annotationToDataPart)
        .filter(Boolean)
        .forEach(part => parts.push(part as ChatDataPart))
    }

    if (Array.isArray(rawMessage.toolInvocations)) {
      rawMessage.toolInvocations.forEach(tool => {
        parts.push(asToolCallDataPart(tool))
      })
    }

    const role =
      rawMessage.role === 'user' ||
      rawMessage.role === 'assistant' ||
      rawMessage.role === 'system'
        ? rawMessage.role
        : 'assistant'

    result.push({
      id: rawMessage.id || generateId(),
      role,
      parts
    })
  }

  return result
}

export function getMessageText(message: ChatUIMessage): string {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('')
}

export function getSessionDefault(field: string) {
  if (typeof window === 'undefined') return undefined
  const stored = sessionStorage.getItem(field)
  return stored ? JSON.parse(stored) : undefined
}

export function removeSessionFile(fields: string | string[]) {
  if (typeof window === 'undefined') return

  const keys = Array.isArray(fields) ? fields : [fields]
  keys.forEach(key => sessionStorage.removeItem(key))
}
