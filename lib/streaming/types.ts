import type { ChatUIMessage } from '@/lib/types'

export interface BaseStreamConfig {
  messages: ChatUIMessage[]
  model: string
  chatId: string
  searchMode: boolean
}
