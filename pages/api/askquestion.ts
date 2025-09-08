import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import dbConnect from '../../utils/dbConnect'
import Message from '../../models/Message'
import { GoogleGenerativeAI } from '@google/generative-ai'
import MemoryClient from 'mem0ai';

type MessageType = {
  _id: string
  userEmail: string
  chatId: string
  text: string
  createdAt: Date
  user: {
    _id: string
    name: string
  }
}

type Data =
  | {
    answer: string
    botMessage: MessageType
    error?: never
  }
  | {
    error: string
    answer?: never
    botMessage?: never
  }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).end()

    const { prompt, chatId, model } = req.body as { prompt: string; chatId: string; model?: string }
    if (!prompt || !chatId) return res.status(400).end()

    await dbConnect()

    const mem0Client = new MemoryClient({ apiKey: process.env.MEM0_API_KEY! })
    const filters = { OR: [{ user_id: chatId }] }
    const relevantMemories = await mem0Client.search(prompt, { api_version: "v2", filters })
    console.log("relevantMemories", relevantMemories)

    let promptWithMemories = `User: ${prompt}\n`
    if (relevantMemories.length > 0) {
      promptWithMemories +=
        'Relevant memories: ' +
        relevantMemories.map((m: any) => m.memory).join('. ') +
        '\n'
    }

    // 1) Save user's message
    await new Message({
      userEmail: session.user!.email!,
      chatId,
      text: prompt,
      createdAt: new Date(),
      user: {
        _id: session.user!.email!,
        name: session.user!.name!
      },
    }).save()

    // 2) Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

    const chosenModel = 'gemini-2.5-flash'
    console.log('Using model:', chosenModel)

    const generativeModel = genAI.getGenerativeModel({ model: chosenModel })

    const imageUrlMatch = promptWithMemories.match(/\[Image:\s*(https?:\/\/[^\]]+)\]/i)
    let contents

    if (imageUrlMatch) {
      const img_response = await fetch(imageUrlMatch[1]);
      const imageArrayBuffer = await img_response.arrayBuffer();
      const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');
      contents = [
        { text: promptWithMemories.replace(/\[Image:\s*https?:\/\/[^\]]+\]/i, '').trim() }, // prompt text without image markdown
        { inlineData: { mimeType: 'image/jpeg', data: base64ImageData } }, // image url here as data string
      ]
    } else {
      // Text-only prompt
      contents = [{ text: promptWithMemories }]
    }

    // 3) Generate response
    const result = await generativeModel.generateContent(contents)
    const finalText =
      result.response.text() || 'I was unable to find an answer for that!'

    // 4) Save bot response
    const botDoc = await new Message({
      userEmail: session.user!.email!,
      chatId,
      text: finalText,
      createdAt: new Date(),
      user: {
        _id: 'Gemini',
        name: 'Gemini'
      },
    }).save()

    await mem0Client.add(
      [
        { role: 'user', content: prompt },
        { role: 'assistant', content: finalText },
      ],
      { user_id: chatId }
    )

    const botMessage: MessageType = {
      _id: botDoc._id.toString(),
      userEmail: botDoc.userEmail,
      chatId: botDoc.chatId,
      text: botDoc.text,
      createdAt: botDoc.createdAt,
      user: {
        _id: botDoc.user._id,
        name: botDoc.user.name
      },
    }

    res.status(200).json({ answer: botMessage.text, botMessage })
  } catch (error: any) {
    console.error('Error in chat handler:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}