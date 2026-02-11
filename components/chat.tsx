'use client'

import { CHAT_ID } from '@/lib/constants'
import type { ChatUIMessage } from '@/lib/types'
import { convertToUIMessages } from '@/lib/utils'
import { getCookie, setCookie } from '@/lib/utils/cookies'
import { generateId } from 'ai'
import { useChat } from '@ai-sdk/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ChatMessages } from './chat-messages'
import { ChatPanel } from './chat-panel'

type StreamProtocol = 'text' | 'data'

export function Chat({
  id,
  savedMessages = [],
  query
}: {
  id: string
  savedMessages?: ChatUIMessage[]
  query?: string
}) {
  const [selectedModelId, setSelectedModelId] = useState<string>('')
  const [dynamicStreamProtocol, setDynamicStreamProtocol] =
    useState<StreamProtocol>('data')

  // 1. Ambil model dari cookie
  useEffect(() => {
    const modelFromCookie = getCookie('selected-model')

    if (!modelFromCookie) {
      setCookie('selected-model', 'groq:llama-3.3-70b-versatile')
      setSelectedModelId('groq:llama-3.3-70b-versatile')
    } else {
      setSelectedModelId(modelFromCookie)
    }
  }, [])

  // 2. Update streamProtocol setelah selectedModelId benar
  useEffect(() => {
    if (selectedModelId) {
      setDynamicStreamProtocol(
        selectedModelId === 'nuii-ai:nuii-ai' ? 'text' : 'data'
      )
    }
  }, [selectedModelId])

  const handleSearchModeToggle = (isSearchMode: boolean) => {
    const newModelId = isSearchMode
      ? 'groq:llama-3.3-70b-versatile'
      : 'nuii-ai:nuii-ai'
    setCookie('selected-model', newModelId)
    setSelectedModelId(newModelId)
  }

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    stop,
    append
  } = useChat({
    streamProtocol: dynamicStreamProtocol,
    initialMessages: convertToUIMessages(savedMessages ?? []),
    id: CHAT_ID,
    body: {
      id
    },
    sendExtraMessageFields: true,
    onFinish: () => {
      window.history.replaceState({}, '', `/search/${id}`)
    },
    onError: (error: { message: any }) => {
      toast.error(`Error in chat: ${error.message}`)
      console.error('Error in chat:', error)
    }
  })

  useEffect(() => {
    setMessages(convertToUIMessages(savedMessages ?? []))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const onQuerySelect = (query: string) => {
    append({
      id: generateId(),
      role: 'user',
      parts: [{ type: 'text', text: query }]
    })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e)
  }

  return (
    <div className="flex flex-col w-full max-w-3xl pt-14 pb-60 mx-auto stretch">
      <ChatMessages
        messages={messages}
        onQuerySelect={onQuerySelect}
        isLoading={isLoading}
        chatId={id}
      />
      <ChatPanel
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={onSubmit}
        isLoading={isLoading}
        messages={messages}
        setMessages={setMessages}
        stop={stop}
        query={query}
        append={append}
        onSearchModeToggle={handleSearchModeToggle}
      />
    </div>
  )
}
