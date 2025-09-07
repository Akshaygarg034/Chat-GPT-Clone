import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "../../utils/dbConnect";
import Chat from "../../models/Chat";

type ChatItem = {
  chatId: string;
  createdAt: Date;
};

type Data = { chats: ChatItem[] };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).end();
  }

  await dbConnect();
  const docs = await Chat.find({ userEmail: session.user!.email! })
    .sort({ createdAt: 1 })
    .lean();

  const chats: ChatItem[] = docs.map((doc: any) => ({
    chatId: doc._id.toString(), // ✅ use Mongo’s _id
    createdAt: doc.createdAt,
  }));

  res.status(200).json({ chats });
}
