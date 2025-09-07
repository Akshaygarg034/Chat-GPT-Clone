// utils/chatgpt.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export function getGeminiModel(modelId: string = 'gemini-1.5-flash') {
  return geminiClient.getGenerativeModel({ model: modelId })
}

export default geminiClient
