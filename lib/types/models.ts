export interface Model {
  id: string
  name: string
  provider: string
  providerId: string
}

export const models: Model[] = [
  // {
  //   id: 'gpt-4o',
  //   name: 'GPT-4o',
  //   provider: 'OpenAI',
  //   providerId: 'openai'
  // },
  // {
  //   id: 'gpt-4o-mini',
  //   name: 'GPT-4o mini',
  //   provider: 'OpenAI',
  //   providerId: 'openai'
  // },
  // {
  //   id: 'claude-3-5-sonnet-latest',
  //   name: 'Claude 3.5 Sonnet',
  //   provider: 'Anthropic',
  //   providerId: 'anthropic'
  // },
  // {
  //   id: 'claude-3-5-haiku-latest',
  //   name: 'Claude 3.5 Haiku',
  //   provider: 'Anthropic',
  //   providerId: 'anthropic'
  // },
  // {
  //   id: 'claude-3-opus-latest',
  //   name: 'Claude 3 Opus',
  //   provider: 'Anthropic',
  //   providerId: 'anthropic'
  // },
  // {
  //   id: 'gemini-1.5-pro-002',
  //   name: 'Gemini 1.5 Pro',
  //   provider: 'Google Generative AI',
  //   providerId: 'google'
  // },
  // {
  //   id: 'gemini-2.0-flash-exp',
  //   name: 'Gemini 2.0 Flash (Experimental)',
  //   provider: 'Google Generative AI',
  //   providerId: 'google'
  // },

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

  // {
  //   id: 'qwen2.5',
  //   name: 'Qwen 2.5',
  //   provider: 'Ollama',
  //   providerId: 'ollama'
  // },
  // {
  //   id: process.env.NEXT_PUBLIC_AZURE_DEPLOYMENT_NAME || 'undefined',
  //   name: process.env.NEXT_PUBLIC_AZURE_DEPLOYMENT_NAME || 'Undefined',
  //   provider: 'Azure',
  //   providerId: 'azure'
  // },
  // Deepseek function calling is currently unstable: https://github.com/vercel/ai/issues/4313#issuecomment-2587891644
  // If you want to use Deepseek, remove the comment and add it to the models array
  // {
  //   id: 'deepseek-chat',
  //   name: 'DeepSeek v3',
  //   provider: 'DeepSeek',
  //   providerId: 'deepseek'
  // },
  // {
  //   id: process.env.NEXT_PUBLIC_OPENAI_COMPATIBLE_MODEL || 'undefined',
  //   name: process.env.NEXT_PUBLIC_OPENAI_COMPATIBLE_MODEL || 'Undefined',
  //   provider: 'OpenAI Compatible',
  //   providerId: 'openai-compatible'
  // }
]
