'use client'

import TypeIt from 'typeit-react'
import { PencilSquareIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

type MessageType = {
  _id: string
  userEmail: string
  chatId: string
  text: string
  createdAt: Date
  user: {
    _id: string
    name: string
  }
}

type Props = {
  message: MessageType
  isLast: boolean
  isNewBotMessage?: boolean
  canEdit?: boolean
  onEdit?: () => void
}

export default function Message({
  message,
  isNewBotMessage = false,
  canEdit = false,
  onEdit,
}: Props) {
  const isChatBot = message.user.name === 'Gemini'
  const [copied, setCopied] = useState(false)
  const imageRegex = /\[Image:\s*(https?:\/\/[^\]]+)\]/i
  const imageMatch = message.text.match(imageRegex)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="py-3 text-white">
      <div className={`relative flex max-w-3xl my-4 mx-auto ${!isChatBot ? 'justify-end' : ''}`}>
        <div className={`relative group ${!isChatBot ? 'max-w-[80%]' : 'w-[100%]'} flex flex-col items-start gap-3 px-5 py-2 rounded-3xl ${!isChatBot ? 'bg-[#303030]' : ''}`}>

          {imageMatch && !isChatBot && canEdit ? (
            <>
              <img
                src={imageMatch[1]}
                alt="query image"
                className="max-h-56 rounded-md"
              />
              {/* Optionally show text without image markdown */}
              <p className="text-base mt-2">{message.text.replace(imageRegex, '').trim()}</p>
            </>
          ) : isChatBot && isNewBotMessage ? (
            <TypeIt
              options={{ strings: [message.text], speed: 20, waitUntilVisible: true }}
            />
          ) : (
            <p className="text-base">{message.text}</p>
          )}


          <div className="absolute h-[200%] w-[100%] top-0 left-0"></div>

          {/* Edit button, only visible for user's own messages on hover */}
          {canEdit && !isChatBot && (
            <button
              type="button"
              onClick={onEdit}
              className="invisible group-hover:visible absolute left-3 -bottom-6 flex items-center text-xs text-gray-300 hover:text-white"
              title="Edit message"
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
          )}

          {/* Copy icon, toggles to check icon on click */}
          <button
            type="button"
            onClick={handleCopy}
            className={`${!isChatBot && 'invisible'} group-hover:visible absolute ${isChatBot ? 'left-4' : ' left-12'} -bottom-6 flex items-center text-gray-300 hover:text-white`}
            title={copied ? 'Copied!' : 'Copy message'}
          >
            {copied ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <ClipboardIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
