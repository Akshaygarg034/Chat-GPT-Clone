// utils/chatgpt.ts
import { createOpenAI } from '@ai-sdk/openai'

// Initialize the Vercel AI SDK OpenAI provider with your API key
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export default openai
