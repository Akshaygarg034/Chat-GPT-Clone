// pages/api/deletechat.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import dbConnect from "../../utils/dbConnect"
import Message from "../../models/Message"
import Chat from "../../models/Chat"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { chatId } = req.body
  if (!chatId) {
    return res.status(400).json({ error: "Missing chatId" })
  }

  await dbConnect()

  const chatResult = await Chat.deleteOne({
    _id: chatId,
    userEmail: session.user!.email!,
  })

  if (chatResult.deletedCount === 0) {
    return res.status(404).json({ error: "Chat not found" })
  }

  await Message.deleteMany({
    chatId,
    userEmail: session.user!.email!,
  })

  return res.status(200).json({ ok: true })
}
