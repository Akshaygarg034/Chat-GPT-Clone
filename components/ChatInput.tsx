'use client'

import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { FormEvent, useState } from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
const ModelSelection = dynamic(() => import('./ModelSelection'), { ssr: false })

type Props = {
    chatId: string
    onMessageSent: (message: any) => void
}

export default function ChatInput({ chatId, onMessageSent }: Props) {
    const [prompt, setPrompt] = useState<string>('')
    const { data: session } = useSession()
    const { data: model } = useSWR('model', { fallbackData: 'text-davinci-003' })

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!prompt || !session) return

        const input = prompt.trim()
        setPrompt('')

        // Create temporary user message for optimistic UI
        const userMessage = {
            _id: 'temp-id-' + Date.now(),
            userEmail: session.user!.email!,
            chatId,
            text: input,
            createdAt: new Date().toISOString(),
            user: {
                _id: session.user!.email!,
                name: session.user!.name!,
                avatar:
                    session.user!.image! || `https://ui-avatars.com/api/?name=${session.user!.name}`,
            },
        }

        // Optimistic UI update
        onMessageSent(userMessage)

        const res = await fetch('/api/askquestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: input, chatId, model }),
        })

        if (res.ok) {
            const data = await res.json()
            if (data.botMessage) {
                // Immediately add bot message and trigger animation
                onMessageSent({
                    ...data.botMessage,
                    createdAt: data.botMessage.createdAt || new Date().toISOString(),
                })
            }
        } else {
            toast.error('Something went wrong.')
        }
    }

    return (
        <div className="flex flex-col p-4 md:p-0 items-center">
            <div className="bg-[#41414F] text-gray-400 rounded-3xl text-sm lg:max-w-2xl w-[100%] mt-10 mb-3">
                <form onSubmit={sendMessage} className="p-3 px-5 space-x-5 flex">
                    <input
                        type="text"
                        className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300"
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={!session}
                    />
                    <button
                        type="submit"
                        className="hover:bg-[#2a2b32] text-white font-bold px-3 py-2 rounded disabled:bg-gray-300/90 disabled:cursor-not-allowed"
                        disabled={!prompt || !session}
                    >
                        <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
                    </button>
                </form>
            </div>
            <h1 className="w-full text-center text-xs mb-5 text-[#7F8186] font-semibold">
                ChatGPT Apr 1 Version. Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts.
            </h1>
        </div>
    )
}
