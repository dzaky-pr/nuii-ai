'use client'

import Image from 'next/image'
import { CollapsibleMessage } from './collapsible-message'
import { DefaultSkeleton } from './default-skeleton'
import { BotMessage } from './message'
import { MessageActions } from './message-actions'

export type AnswerSectionProps = {
  content: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  chatId?: string
}

export function AnswerSection({
  content,
  isOpen,
  onOpenChange,
  chatId
}: AnswerSectionProps) {
  const enableShare = process.env.NEXT_PUBLIC_ENABLE_SHARE === 'true'

  // Bersihkan string: hapus prefix "data:" jika ada
  let cleanedContent = content.trim()
  if (cleanedContent.startsWith('data:')) {
    cleanedContent = cleanedContent.slice(5).trim()
  }

  // Parsing JSON; jika gagal, gunakan content as-is sebagai answer
  let parsed: { answer?: string; image?: string } = {}
  try {
    parsed = JSON.parse(cleanedContent)
  } catch (e) {
    parsed.answer = cleanedContent
  }

  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible={false}
      header={
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold">Answer</span>
        </div>
      }
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showBorder={false}
    >
      <div className="flex flex-col gap-4">
        {parsed.answer ? (
          <BotMessage message={parsed.answer} />
        ) : (
          <DefaultSkeleton />
        )}
        {parsed.image && (
          <div className="mt-4">
            <Image
              src={`/${parsed.image}`}
              alt="Answer image"
              width={400}
              height={300}
              className="rounded"
            />
          </div>
        )}
        {parsed.image && <p>Gambar {parsed.image.split('/').pop()}</p>}
        <MessageActions
          message={parsed.answer || content}
          chatId={chatId}
          enableShare={enableShare}
        />
      </div>
    </CollapsibleMessage>
  )
}
