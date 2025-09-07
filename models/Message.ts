// models/Message.ts
import { Schema, model, models } from 'mongoose'

const MessageSchema = new Schema({
  userEmail: String,
  chatId: String,
  text: String,
  createdAt: Date,
  user: {
    _id: String,
    name: String
  }
})

export default models.Message || model('Message', MessageSchema)
