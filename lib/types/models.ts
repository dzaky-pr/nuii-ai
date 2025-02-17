export interface Model {
  id: string
  name: string
  provider: string
  providerId: string
}

export const models: Model[] = [
  {
    id: 'nuii-ai',
    name: 'nuii-ai',
    provider: 'NUII AI',
    providerId: 'nuii-ai'
  },
  {
    id: 'llama-3.3-70b-versatile',
    name: 'llama-3.3-70b-versatile',
    provider: 'Groq',
    providerId: 'groq'
  }
]
