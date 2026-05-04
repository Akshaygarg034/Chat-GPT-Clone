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
} from "@heroicons/react/24/outline"

type ChatItem = {
  chatId: string
  createdAt: string
  lastMessage: string
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
      {/* Logo + Name */}
      <a className="flex items-center gap-2.5 px-2 py-3 mb-4" href="/">
        <svg width="28" height="28" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sideGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0EA5E9"/><stop offset="100%" stopColor="#8B5CF6"/></linearGradient>
            <filter id="sideGlow"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <circle cx="110" cy="110" r="90" fill="none" stroke="url(#sideGrad)" strokeWidth="4" opacity="0.3"/>
          <circle cx="110" cy="110" r="28" fill="url(#sideGrad)" filter="url(#sideGlow)"/>
          <g stroke="url(#sideGrad)" strokeWidth="3" strokeLinecap="round">
            <line x1="110" y1="82" x2="110" y2="50"/><line x1="138" y1="110" x2="170" y2="110"/><line x1="110" y1="138" x2="110" y2="170"/><line x1="82" y1="110" x2="50" y2="110"/>
            <line x1="130" y1="90" x2="155" y2="65"/><line x1="130" y1="130" x2="155" y2="155"/><line x1="90" y1="130" x2="65" y2="155"/><line x1="90" y1="90" x2="65" y2="65"/>
          </g>
          <g fill="url(#sideGrad)">
            <circle cx="110" cy="45" r="6"/><circle cx="175" cy="110" r="6"/><circle cx="110" cy="175" r="6"/><circle cx="45" cy="110" r="6"/>
            <circle cx="160" cy="60" r="5"/><circle cx="160" cy="160" r="5"/><circle cx="60" cy="160" r="5"/><circle cx="60" cy="60" r="5"/>
          </g>
        </svg>
        <p className="text-white font-semibold text-lg">LLM Chat Bot</p>
      </a>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#424242]">
        <NewChat />

        <div className="hidden sm:inline">
          <ModelSelection />
        </div>

        <span className="mb-2 mt-6 flex bg-[#2f2f2f] h-[1px]" />

        <div className="flex flex-col space-y-1 my-2">
          {chats?.map((chat) => (
            <ChatRow key={chat.chatId} id={chat.chatId} lastMessage={chat.lastMessage} />
          ))}
        </div>
      </div>

      <span className="mb-2 bg-[#2f2f2f] h-[1px]" />

      <div className="mb-2">
        {session && (
          <div className="chatrow justify-start select-none">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user?.name || 'User avatar'}
                className="h-7 w-7 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-sky-600 flex items-center justify-center text-[11px] font-semibold text-white">
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
