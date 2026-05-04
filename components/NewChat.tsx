// components/NewChat.tsx
'use client'

import { PencilSquareIcon  } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useSWRConfig } from 'swr'

export default function NewChat() {
  const router = useRouter()
  const { data: session } = useSession()
  const { mutate } = useSWRConfig()

  const createNewChat = async () => {
    if (!session) {
      toast.error('Please sign in to create a chat.')
      return
    }
    try {
      const res = await fetch('/api/createChat', { method: 'POST' })
      const { chatId } = await res.json()

      // Optimistically add new chat to sidebar immediately
      mutate(
        '/api/getChats',
        (current: any) => {
          const newChat = { chatId, lastMessage: 'New Chat' }
          if (!Array.isArray(current)) return [newChat]
          return [newChat, ...current]
        },
        { revalidate: false }
      )

      router.push(`/chat/${chatId}`)
    } catch (error) {
      toast.error('Failed to create chat.')
    }
  }

  return (
    <div
      onClick={createNewChat}
      className="border-[#424242] border chatrow cursor-pointer"
    >
      <PencilSquareIcon className="h-4 w-4" />
      <p>New Chat</p>
    </div>
  )
}
