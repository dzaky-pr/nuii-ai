import type { ChatUIMessage, ToolInvocation } from '@/lib/types'
import { getMessageText } from '@/lib/utils'
import { useMemo } from 'react'
import { AnswerSection } from './answer-section'
import { ReasoningAnswerSection } from './reasoning-answer-section'
import RelatedQuestions from './related-questions'
import { ToolSection } from './tool-section'
import { UserMessage } from './user-message'

interface RenderMessageProps {
  message: ChatUIMessage
  messageId: string
  getIsOpen: (id: string) => boolean
  onOpenChange: (id: string, open: boolean) => void
  onQuerySelect: (query: string) => void
  chatId?: string
}

export function RenderMessage({
  message,
  messageId,
  getIsOpen,
  onOpenChange,
  onQuerySelect,
  chatId
}: RenderMessageProps) {
  const relatedQuestions = useMemo(() => {
    const parts = message.parts.filter(
      part => part.type === 'data-related-questions'
    )
    return parts.length > 0 ? parts[parts.length - 1].data : null
  }, [message.parts])

  const reasoningText = useMemo(
    () =>
      message.parts
        .filter(part => part.type === 'reasoning')
        .map(part => part.text)
        .join('\n'),
    [message.parts]
  )

  const textContent = useMemo(() => getMessageText(message), [message])

  // render for manual tool call
  const toolData = useMemo(() => {
    const toolParts = message.parts.filter(
      part => part.type === 'data-tool_call'
    )

    const toolDataMap = toolParts.reduce((acc, part) => {
      const existing = acc.get(part.data.toolCallId)
      if (!existing || part.data.state === 'result') {
        acc.set(part.data.toolCallId, {
          toolCallId: part.data.toolCallId,
          toolName: part.data.toolName,
          state: part.data.state,
          args: part.data.args,
          result: part.data.result
        } as ToolInvocation)
      }
      return acc
    }, new Map<string, ToolInvocation>())

    return Array.from(toolDataMap.values())
  }, [message.parts])

  if (message.role === 'user') {
    return <UserMessage message={textContent} />
  }

  return (
    <>
      {toolData.map(tool => (
        <ToolSection
          key={tool.toolCallId}
          tool={tool}
          isOpen={getIsOpen(tool.toolCallId)}
          onOpenChange={open => onOpenChange(tool.toolCallId, open)}
        />
      ))}
      {reasoningText ? (
        <ReasoningAnswerSection
          content={{
            reasoning: reasoningText,
            answer: textContent
          }}
          isOpen={getIsOpen(messageId)}
          onOpenChange={open => onOpenChange(messageId, open)}
          chatId={chatId}
        />
      ) : (
        <AnswerSection
          content={textContent}
          isOpen={getIsOpen(messageId)}
          onOpenChange={open => onOpenChange(messageId, open)}
          chatId={chatId}
        />
      )}
      {relatedQuestions && (
        <RelatedQuestions
          items={relatedQuestions.items}
          onQuerySelect={onQuerySelect}
          isOpen={getIsOpen(`${messageId}-related`)}
          onOpenChange={open => onOpenChange(`${messageId}-related`, open)}
        />
      )}
    </>
  )
}
