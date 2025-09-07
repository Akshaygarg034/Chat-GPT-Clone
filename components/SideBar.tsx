// components/SideBar.tsx
'use client'

import { signOut, useSession } from "next-auth/react"
import NewChat from "./NewChat"
import ChatRow from "./ChatRow"
import dynamic from 'next/dynamic'
const ModelSelection = dynamic(() => import('./ModelSelection'), { ssr: false })
import useSWR from "swr"
import {
  ArrowRightOnRectangleIcon,
  GiftIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline"

type ChatItem = {
  chatId: string
  createdAt: string
}

export default function SideBar() {
  const { data: session } = useSession()

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((data: { chats: ChatItem[] }) => data.chats)

  const { data: chats, error } = useSWR(
    session ? "/api/getChats" : null,
    fetcher
  )

  return (
    <div className="p-2 flex flex-col h-screen">
      {/* ChatGPT Logo + Name */}
      <a className="flex items-center gap-2 px-2 py-3 mb-4" href="/">
        <img
          src="https://res.cloudinary.com/dz1vsgxm5/image/upload/v1757192404/ChatGPTClone/icons8-chatgpt-100_l7tpts.png"
          alt="ChatGPT Logo"
          className="h-7 w-7 object-contain"
        />
        <p className="text-white font-semibold text-lg">ChatGPT</p>
      </a>
      <div className="flex-1">
        <NewChat />
        <div className="hidden sm:inline">
          <ModelSelection />
        </div>

        <span className="mb-2 mt-8 flex bg-[#242424] h-[1.5px]" />

        <div className="flex flex-col space-y-2 my-2">
          {chats?.map((chat) => (
            <ChatRow key={chat.chatId} id={chat.chatId} />
          ))}
        </div>
      </div>

      {session && (
        <img
          onClick={() => signOut()}
          src={session.user?.image!}
          alt="Profile Pic"
          className="hidden h-12 w-12 rounded-full cursor-pointer mx-auto mb-2 hover:opacity-50"
        />
      )}

      <span className="mb-2 bg-[#242424] h-[1.5px]" />

      <div className="mb-2">
        {session && (
          <div className="chatrow justify-start select-none">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user?.name || 'User avatar'}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center text-[10px] font-semibold">
                {(session.user?.name || session.user?.email || 'U')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <p className="truncate">{session.user?.name || session.user?.email}</p>
          </div>
        )}
        <div
          onClick={() => signOut()}
          className="chatrow justify-start cursor-pointer"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <p>Log out</p>
        </div>
      </div>
    </div>
  )
}
