// pages/api/deleteChat.ts
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
    console.log("Method not allowed:", req.method)
    return res.status(405).json({ error: "Method not allowed" })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    console.log("Unauthorized: no session")
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { chatId } = req.body
  console.log("Deleting chatId:", chatId, "for user:", session.user?.email)
  if (!chatId) {
    console.log("Bad request: missing chatId")
    return res.status(400).json({ error: "Missing chatId" })
  }

  await dbConnect()

  // Delete the Chat document by its _id
  const chatResult = await Chat.deleteOne({
    _id: chatId,
    userEmail: session.user!.email!,
  })
  console.log("Chat.deleteOne result:", chatResult)

  if (chatResult.deletedCount === 0) {
    return res.status(404).json({ error: "Chat not found" })
  }

  // Delete all messages for that chat
  const msgResult = await Message.deleteMany({
    chatId,
    userEmail: session.user!.email!,
  })
  console.log("Message.deleteMany result:", msgResult)

  return res.status(200).json({ ok: true })
}
