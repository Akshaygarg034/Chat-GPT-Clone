'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import ScrollToBottom from 'react-scroll-to-bottom'
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
  }
}

type Props = { chatId: string }

export default function Chat({ chatId }: Props) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [loading, setLoading] = useState(true)
  const [newBotMessageId, setNewBotMessageId] = useState<string | null>(null)
  const [promptValue, setPromptValue] = useState('')

  useEffect(() => {
    if (!session || !chatId) return

    let cancelled = false

    async function fetchMessages() {
      setLoading(true)
      try {
        const res = await fetch('/api/getmessages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId }),
        })
        if (!res.ok || cancelled) return
        const data: { messages: MessageType[] } = await res.json()
        if (cancelled) return
        setMessages(data.messages)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchMessages()
    return () => { cancelled = true }
  }, [session, chatId])

  const handleUserMessage = useCallback((message: MessageType) => {
    setMessages(prev => [...prev, message])
    if (message.user._id === 'Gemini') {
      setNewBotMessageId(message._id)
    }
  }, [])

  const handleEditRequest = useCallback((message: MessageType) => {
    setPromptValue(message.text)
  }, [])

  // Clear animation flag after typewriter finishes
  useEffect(() => {
    if (!newBotMessageId) return
    const timer = setTimeout(() => setNewBotMessageId(null), 5000)
    return () => clearTimeout(timer)
  }, [newBotMessageId])

  return (
    <>
      <ScrollToBottom className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#5c5b5b] hover:scrollbar-thumb-[#ACACBE]" followButtonClassName="hidden">
        {loading && <p className="mt-10 text-center text-white">Loading messages…</p>}
        {!loading &&
          messages.map((msg, idx) => (
            <Message
              key={msg._id}
              message={{ ...msg, createdAt: new Date(msg.createdAt) }}
              isLast={idx === messages.length - 1}
              isNewBotMessage={msg._id === newBotMessageId}
              canEdit={session?.user?.email === msg.userEmail}
              onEdit={() => handleEditRequest(msg)}
            />
          ))}
      </ScrollToBottom>
      {!loading && messages.length === 0 ? (
        <div className='h-full w-full flex flex-col items-center justify-center'>
          <p className="text-center text-3xl text-white">What can I help with?</p>
          <ChatInput
            chatId={chatId}
            messages={messages}
            onMessageSent={handleUserMessage}
            promptValue={promptValue}
            setPromptValue={setPromptValue}
          />
        </div>
      ) : (
        <ChatInput
          chatId={chatId}
          messages={messages}
          onMessageSent={handleUserMessage}
          promptValue={promptValue}
          setPromptValue={setPromptValue}
        />
      )}
    </>
  )
}
