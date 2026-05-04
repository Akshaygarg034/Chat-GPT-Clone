// components/ChatRow.tsx
'use client'

import { TrashIcon } from "@heroicons/react/24/outline"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
    id: string
    lastMessage?: string
}

export default function ChatRow({ id, lastMessage = "New Chat" }: Props) {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()
    const [active, setActive] = useState(false)

    useEffect(() => {
        if (pathname) {
            setActive(pathname.includes(id))
        }
    }, [pathname, id])

    const deleteChat = async () => {
        if (!session) return
        await fetch("/api/deletechat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId: id }),
        })
        router.replace("/")
    }

    return (
        <Link
            href={`/chat/${id}`}
            className={`chatrow gap-9 justify-center ${active ? "bg-[#242424]" : ""}`}
        >
            <p className="flex-1 hidden md:inline-flex truncate">
                {lastMessage}
            </p>
            <TrashIcon
                onClick={(e) => {
                    e.preventDefault()
                    deleteChat()
                }}
                className="h-5 w-5 text-gray-500 hover:text-red-700 cursor-pointer"
            />
        </Link>
    )
}
