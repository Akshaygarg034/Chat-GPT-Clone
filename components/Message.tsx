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
  const isChatGPT = message.user.name === 'ChatGPT'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="py-3 text-white">
      <div className={`relative flex max-w-3xl mx-auto ${!isChatGPT ? 'justify-end' : ''}`}>
        <div className={`relative group flex items-start gap-3 px-5 py-2 rounded-3xl ${!isChatGPT ? 'bg-[#303030]' : ''}`}>
          {/* Bubble text */}
          <p className="text-base">
            {isChatGPT && isNewBotMessage ? (
              <TypeIt
                options={{ strings: [message.text], speed: 20, waitUntilVisible: true }}
              />
            ) : (
              message.text
            )}
          </p>

          <div className="absolute h-[200%] w-[100%] top-0 left-0"></div>

          {/* Edit button, only visible for user's own messages on hover */}
          {canEdit && !isChatGPT && (
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
            className={`${!isChatGPT && 'invisible'} group-hover:visible absolute ${isChatGPT ? 'left-4' : ' left-12'} -bottom-6 flex items-center text-gray-300 hover:text-white`}
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
