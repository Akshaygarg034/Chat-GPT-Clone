// models/Chat.ts
import { Schema, model, models } from 'mongoose'

const ChatSchema = new Schema({
  chatId:    { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date,   required: true },
})

export default models.Chat || model('Chat', ChatSchema)
