'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import ScrollToBottom from 'react-scroll-to-bottom'
import { ArrowDownCircleIcon } from '@heroicons/react/24/outline'
import Message from './Message'
import ChatInput from "./ChatInput";

type MessageType = {
  _id: string
  userEmail: string
  chatId: string
  text: string
  createdAt: string
  user: {
    _id: string
    name: string
    avatar: string
  }
}

type Props = { chatId: string }

export default function Chat({ chatId }: Props) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  // Track the ID of the last new bot message to animate typewriter for only that message
  const [newBotMessageId, setNewBotMessageId] = useState<string | null>(null)

  // Keep ref to previous messages length so we detect new messages
  const prevMessagesLengthRef = useRef<number>(0)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!session || !chatId) return

    async function fetchMessages() {
      setLoading(true)
      const res = await fetch('/api/getmessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId }),
      })
      if (res.ok) {
        const data: { messages: MessageType[] } = await res.json()
        // Sort by createdAt ascending
        const sorted = data.messages.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        setMessages(sorted)
        // Detect if a new bot message arrived
        if (
          sorted.length > prevMessagesLengthRef.current && // messages count increased
          sorted[sorted.length - 1].user._id === 'ChatGPT'  // last message is bot message
        ) {
          setNewBotMessageId(sorted[sorted.length - 1]._id)
        } else {
          setNewBotMessageId(null) // no new bot message
        }
        prevMessagesLengthRef.current = sorted.length
      }
      setLoading(false)
    }

    fetchMessages()
  }, [session, chatId])

  function handleUserMessage(message: MessageType) {
    setMessages((prev) => [...prev, message])
    // If message is from bot, set newBotMessageId to trigger animation
    if (message.user._id === 'ChatGPT') {
      setNewBotMessageId(message._id)
    }
  }

  return (
    <>
      <ScrollToBottom className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-[#444654]/80 hover:scrollbar-thumb-[#ACACBE]">
        {loading && <p className="mt-10 text-center text-white">Loading messages…</p>}

        {!loading && messages.length === 0 && (
          <>
            <p className="mt-10 text-center text-white">What can I help with?</p>
          </>
        )}

        {!loading &&
          messages.map((msg, idx) => (
            <Message
              key={msg._id}
              message={{ ...msg, createdAt: new Date(msg.createdAt) }}
              isLast={idx === messages.length - 1}
              isNewBotMessage={msg._id === newBotMessageId}
            />
          ))}
      </ScrollToBottom>
      <ChatInput chatId={chatId} onMessageSent={handleUserMessage} />
    </>
  )
}
