import { groq } from '@ai-sdk/groq'
import { experimental_createProviderRegistry as createProviderRegistry } from 'ai'

import { createOllama } from 'ollama-ai-provider'

export const registry = createProviderRegistry({
  groq,
  'nuii-ai': createOllama({
    baseURL: `${process.env.RUNPOD_SERVER_URL}`
  })
})

export function getModel(model: string) {
  const modelName = model.split(':')[1]
  if (model.includes('ollama')) {
    if (model.includes('nuii-ai')) {
      const ollama = createOllama({
        baseURL: `${process.env.RUNPOD_SERVER_URL}/tanya`
      })

      return ollama(modelName, {
        simulateStreaming: true
      })
    }
  }

  if (model.startsWith('groq:') || model.startsWith('nuii-ai:')) {
    return registry.languageModel(
      model as `nuii-ai:${string}` | `groq:${string}`
    )
  }

  throw new Error(`Invalid model identifier: ${model}`)
}

export function isProviderEnabled(providerId: string): boolean {
  switch (providerId) {
    case 'groq':
      return !!process.env.GROQ_API_KEY
    case 'nuii-ai':
      return true
    default:
      return false
  }
}

export function getToolCallModel(model?: string) {
  const provider = model?.split(':')[0]
  switch (provider) {
    case 'groq':
      return getModel('groq:llama-3.3-70b-versatile')
  }
}
