// utils/queryApi.ts
import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const query = async (prompt: string, chatId: string, model: string) => {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  })

  // Optional mapping if you keep legacy names in UI
  const chosenModel = model === 'text-davinci-003' ? 'gpt-3.5-turbo-instruct' : model

  try {
    const { textStream } = await streamText({
    model: openai(chosenModel),
    prompt,
    temperature: 1,
    maxOutputTokens: 512,
    topP: 1
    })

    let fullText = ''
    for await (const chunk of textStream) {
      fullText += chunk
    }
    return fullText?.trim() || 'I was unable to find an answer for that!'
  } catch (err: any) {
    return `ChatGPT was unable to find an answer for that! (Error: ${err?.message || 'unknown'})`
  }
}

export default query
