// pages/api/deleteChat.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import dbConnect from "../../utils/dbConnect"
import Message from "../../models/Message"
import Chat from "../../models/Chat" // Import Chat model

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).end()
  }
  const { chatId } = req.body
  if (!chatId) {
    return res.status(400).end()
  }

  await dbConnect()

  // Delete chat document
  await Chat.deleteOne({
    chatId,
    userEmail: session.user!.email!,
  })

  // Delete all messages of this chat
  await Message.deleteMany({
    chatId,
    userEmail: session.user!.email!,
  })

  res.status(200).json({ ok: true })
}
