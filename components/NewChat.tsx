// components/NewChat.tsx
'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function NewChat() {
  const router = useRouter()
  const { data: session } = useSession()

  const createNewChat = async () => {
    if (!session) {
      toast.error('Please sign in to create a chat.')
      return
    }
    try {
      const res = await fetch('/api/createChat', { method: 'POST' })
      const { chatId } = await res.json()
      router.push(`/chat/${chatId}`)
    } catch (error) {
      toast.error('Failed to create chat.')
    }
  }

  return (
    <div
      onClick={createNewChat}
      className="border-gray-700 border chatrow cursor-pointer"
    >
      <PlusIcon className="h-4 w-4" />
      <p>New Chat</p>
    </div>
  )
}
