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
      <div className="flex-1">
        <NewChat />
        <div className="hidden sm:inline">
          <ModelSelection />
        </div>

        <span className="mb-2 mt-8 flex bg-[#242424] h-[1.5px]"/>

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
 
      <span className="mb-2 bg-[#242424] h-[1.5px]"/>

      <div className="mb-2">
        <a href="https://github.com/Ash1shh/ChatGPT" target="_blank">
          <div className="chatrow justify-start">
            <GiftIcon className="h-5 w-5" />
            <p>Source Code</p>
          </div>
        </a>
        <a href="https://github.com/Ash1shh/ChatGPT/issues" target="_blank">
          <div className="chatrow justify-start">
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
            <p>Updates & FAQ</p>
          </div>
        </a>
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
