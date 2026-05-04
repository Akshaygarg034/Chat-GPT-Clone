// pages/api/getmessages.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import dbConnect from '../../utils/dbConnect'
import Message from '../../models/Message'

type MessageType = {
  _id: string
  userEmail: string
  chatId: string
  text: string
  createdAt: Date
  user: { _id: string; name: string }
}

type Data = { messages: MessageType[] }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).end()

  const { chatId } = req.body
  if (!chatId) return res.status(400).end()

  try {
    await dbConnect()
    const docs = await Message.find({
      userEmail: session.user!.email!,
      chatId,
    })
      .sort({ createdAt: 1 })
      .lean()
      .exec()

    const messages: MessageType[] = (docs as any[]).map((doc) => ({
      _id: doc._id.toString(),
      userEmail: doc.userEmail,
      chatId: doc.chatId,
      text: doc.text,
      createdAt: doc.createdAt,
      user: { _id: doc.user._id, name: doc.user.name },
    }))

    return res.status(200).json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return res.status(500).end()
  }
}
