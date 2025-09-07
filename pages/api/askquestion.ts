import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import dbConnect from '../../utils/dbConnect'
import Message from '../../models/Message'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

type Data = {
  answer: string
  botMessage: MessageType
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') return res.status(405).end()
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).end()

  const { prompt, chatId } = req.body as { prompt: string; chatId: string }
  if (!prompt || !chatId) return res.status(400).end()

  await dbConnect()

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

  // Choose model (flash = cheaper/faster, pro = better reasoning)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  // 3) Generate response
  const result = await model.generateContent(prompt)
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
}
