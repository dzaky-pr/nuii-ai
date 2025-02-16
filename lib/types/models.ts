export interface Model {
  id: string
  name: string
  provider: string
  providerId: string
}

export const models: Model[] = [
  {
    id: 'km-pln-ai',
    provider: 'KM PLN',
    providerId: 'km-pln',
    name: 'KM PLN Assistant'
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
  },
  {
    id: 'accounts/fireworks/models/deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'Fireworks',
    providerId: 'fireworks'
  },
  {
    id: 'accounts/fireworks/models/llama-v3p1-405b-instruct',
    name: 'llama-v3p1-405b-instruct',
    provider: 'Fireworks',
    providerId: 'fireworks'
  }
]
