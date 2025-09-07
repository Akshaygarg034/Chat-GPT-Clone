import { GoogleGenerativeAI } from '@google/generative-ai'

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const query = async (prompt: string, chatId: string, model: string) => {
  const chosenModel = model === 'gemini-1.5-flash' || model === 'gemini-1.5-pro' ? model : 'gemini-1.5-flash'
  try {
    const genModel = gemini.getGenerativeModel({ model: chosenModel })

    const result = await genModel.generateContent(prompt)
    const fullText = result.response.text() || 'I was unable to find an answer for that!'
    return fullText.trim()
  } catch (err: any) {
    return `Gemini was unable to find an answer for that! (Error: ${err?.message || 'unknown'})`
  }
}

export default query
