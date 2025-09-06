// pages/api/askquestion.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import dbConnect from '../../utils/dbConnect'
import Message from '../../models/Message'
import query from '../../utils/queryApi'

type MessageType = {
  _id: string
  userEmail: string
  chatId: string
  text: string
  createdAt: Date
  user: {
    _id: string
    name: string
    avatar: string
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

  const { prompt, chatId, model } = req.body
  if (!prompt || !chatId) return res.status(400).end()

  await dbConnect()

  // 1. Save the user's message
  await new Message({
    userEmail: session.user!.email!,
    chatId,
    text: prompt,
    createdAt: new Date(),
    user: {
      _id: session.user!.email!,
      name: session.user!.name!,
      avatar: session.user!.image! || `https://ui-avatars.com/api/?name=${session.user!.name}`,
    },
  }).save()

  // 2. Query OpenAI for the bot reply
  const response = await query(prompt, chatId, model)

  // 3. Save the ChatGPT bot response
  const botMessage = await new Message({
    userEmail: session.user!.email!,
    chatId,
    text: response || "I was unable to find an answer for that!",
    createdAt: new Date(),
    user: {
      _id: 'ChatGPT',
      name: 'ChatGPT',
      avatar:
        'https://user-images.githubusercontent.com/87669361/217633335-4989329d-ed9f-47e0-95af-e24bca141fe2.jpg',
    },
  }).save()

  // 4. Return the bot's answer text
  res.status(200).json({ answer: botMessage.text, botMessage })
}
