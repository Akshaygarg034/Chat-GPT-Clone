// pages/api/askquestion.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import dbConnect from '../../utils/dbConnect'
import Message from '../../models/Message'
import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

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

  const { prompt, chatId, model } = req.body as { prompt: string; chatId: string; model: string }
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
      name: session.user!.name!,
      avatar:
        session.user!.image! ||
        `https://ui-avatars.com/api/?name=${session.user!.name}`,
    },
  }).save()

  // 2) Call Vercel AI SDK for completion
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY!, // ensure this is set in env
  })

  // Using streamText to generate a completion; we’ll read the full text at the end.
  const { textStream } = await streamText({
    model: openai(model),
    prompt,
    temperature: 1,
    maxOutputTokens: 512,
    topP: 1
  })

  let fullText = ''
  for await (const chunk of textStream) {
    fullText += chunk
  }

  const finalText =
    fullText?.trim() || 'I was unable to find an answer for that!'

  // 3) Save bot response
  const botDoc = await new Message({
    userEmail: session.user!.email!,
    chatId,
    text: finalText,
    createdAt: new Date(),
    user: {
      _id: 'ChatGPT',
      name: 'ChatGPT',
      avatar:
        'https://static.vecteezy.com/system/resources/previews/021/059/827/non_2x/chatgpt-logo-chat-gpt-icon-on-white-background-free-vector.jpg',
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
      name: botDoc.user.name,
      avatar: botDoc.user.avatar,
    },
  }

  res.status(200).json({ answer: botMessage.text, botMessage })
}
