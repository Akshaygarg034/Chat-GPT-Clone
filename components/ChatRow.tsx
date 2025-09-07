// components/ChatRow.tsx
'use client'

import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useSWR from "swr"

type Props = { id: string }

type MessageType = {
    _id: string
    userEmail: string
    chatId: string
    text: string
    createdAt: string
    user: { _id: string; name: string; avatar: string }
}

export default function ChatRow({ id }: Props) {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()
    const [active, setActive] = useState(false)

    useEffect(() => {
        if (pathname) {
            setActive(pathname.includes(id))
        }
    }, [pathname, id])

    // Fetch messages for this chat
    const fetcher = async (key: [string, string]) => {
        const [url, chatId] = key;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId }),
        });
        const data = await response.json();
        return data.messages;
    };

    const shouldFetch = Boolean(session && id)

    const { data: messages } = useSWR(
        shouldFetch ? ["/api/getmessages", id] : null,
        fetcher
    )

    const deleteChat = async () => {
        if (!session) return
        await fetch("/api/deletechat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId: id }),
        })
        router.replace("/")
    }

    const lastMessageText = messages?.length
        ? messages[messages.length - 1].text
        : "New Chat"



    return (
        <Link
            href={`/chat/${id}`}
            className={`chatrow gap-9 justify-center ${active ? "bg-[#242424]" : ""}`}
        >
            <p className="flex-1 hidden md:inline-flex truncate">
                {lastMessageText}
            </p>
            <TrashIcon
                onClick={deleteChat}
                className="h-5 w-5 text-gray-500 hover:text-red-700 cursor-pointer"
            />
        </Link>
    )
}
