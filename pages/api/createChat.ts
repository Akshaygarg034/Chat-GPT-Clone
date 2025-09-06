// pages/api/createChat.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import dbConnect from '../../utils/dbConnect'
import Chat from '../../models/Chat' // use the schema above

type Data = { chatId: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).end()
  }

  await dbConnect()
  const chatId = nanoid()
  await new Chat({
    chatId,
    userEmail: session.user!.email!,
    createdAt: new Date(),
  }).save()

  res.status(200).json({ chatId })
}
