'use client'

import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { useSession } from 'next-auth/react'
import { FormEvent, useState } from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
const ModelSelection = dynamic(() => import('./ModelSelection'), { ssr: false })

type MessageType = {
    _id: string
    userEmail: string
    chatId: string
    text: string
    createdAt: string | Date
    user: { _id: string; name: string; }
}

type Props = {
    chatId: string
    messages?: MessageType[]
    onMessageSent: (message: any) => void
    promptValue: string
    setPromptValue: (v: string) => void
}

export default function ChatInput({ chatId, messages, onMessageSent, promptValue, setPromptValue }: Props) {
    const { data: session } = useSession()
    const { data: model } = useSWR('model', { fallbackData: 'text-davinci-003' })

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!promptValue || !session) return

        const input = promptValue.trim()

        // New message flow
        setPromptValue('')

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
            },
        }
        onMessageSent(userMessage)

        const res = await fetch('/api/askquestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: input, chatId, model }),
        })

        toast.loading('ChatGPT is thinking...', { id: 'thinking' })

        if (res.ok) {
            const data = await res.json()
            if (data.botMessage) {
                // Immediately add bot message and trigger animation
                toast.dismiss('thinking')
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
        <div className="flex flex-col p-4 md:p-0 items-center w-[100%]">
            <div className="bg-[#303030] text-[#ffffff] rounded-3xl text-md lg:max-w-3xl w-[100%] mt-10 mb-3">
                <form onSubmit={sendMessage} className="p-3 px-5 space-x-5 flex">
                    <input
                        type="text"
                        className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300 placeholder-[#afafaf]"
                        placeholder="Ask anything"
                        value={promptValue}
                        onChange={(e) => setPromptValue(e.target.value)}
                        disabled={!session}
                    />
                    <button
                        type="submit"
                        className="bg-[#ffffff] text-black p-2 rounded-full disabled:bg-[#858585]"
                        disabled={!promptValue || !session}
                    >
                        <ArrowUpIcon className="h-4 w-4 font-bold" />
                    </button>
                </form>
            </div>
            {(messages?.length ?? 0) !== 0 && (
                <h1 className="w-full text-center text-xs mb-5 text-white">
                    ChatGPT can make mistakes. Check important info. See <span className="underline">Cookie Preferences.</span>
                </h1>
            )}
        </div>
    )
}
