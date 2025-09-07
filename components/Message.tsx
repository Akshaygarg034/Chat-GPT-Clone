'use client'

import TypeIt from 'typeit-react'

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

type Props = {
  message: MessageType
  isLast: boolean
  isNewBotMessage?: boolean
}

export default function Message({
  message,
  isLast,
  isNewBotMessage = false,
}: Props) {
  const isChatGPT = message.user.name === 'ChatGPT'

  return (
    <div className={`py-5 text-white ${isChatGPT ? 'bg-[#434654]' : ''}`}>
      <div className="flex space-x-5 px-10 max-w-3xl mx-auto">
        <img
          src={message.user.avatar}
          alt={`${message.user.name} avatar`}
          className="h-8 w-8 rounded-full"
        />
        <p className="pt-1 text-sm">
          {isChatGPT && isNewBotMessage ? (
            <TypeIt
              options={{
                strings: [message.text],
                speed: 20,
                waitUntilVisible: true,
              }}
            />
          ) : (
            message.text
          )}
        </p>
      </div>
    </div>
  )
}
