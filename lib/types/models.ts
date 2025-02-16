export interface Model {
  id: string
  name: string
  provider: string
  providerId: string
  endpoint?: string
}

export const models: Model[] = [
  {
    id: 'nuii-ai',
    name: 'nuii-ai',
    provider: 'NUII AI',
    providerId: 'nuii-ai',
    endpoint: 'https://2jn9o6pnnztizk-11436.proxy.runpod.net/tanya'
  },
  {
    id: 'llama-3.3-70b-versatile',
    name: 'llama-3.3-70b-versatile',
    provider: 'Groq',
    providerId: 'groq'
  },
  {
    id: 'gemma2-9b-it',
    name: 'gemma2-9b-it',
    provider: 'Groq',
    providerId: 'groq'
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'mixtral-8x7b-32768',
    provider: 'Groq',
    providerId: 'groq'
  }
]
