// components/Ss.tsx
'use client'

import { signOut, useSession } from 'next-auth/react'
import NewChat from './NewChat'
import ChatRow from './ChatRow'
import dynamic from 'next/dynamic'
const ModelSelection = dynamic(() => import('./ModelSelection'), { ssr: false })
import useSWR from 'swr'
import { useState } from 'react'
import {
  ArrowRightOnRectangleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

export default function Ss() {
  const [toggleDrawer, setToggleDrawer] = useState(false)
  const { data: session } = useSession()

  const fetcher = (url: string) =>
    fetch(url)
      .then(res => res.json())
      .then((data: { chats: { chatId: string; lastMessage: string }[] }) => data.chats)

  const { data: chats, error } = useSWR(session ? '/api/getChats' : null, fetcher)

  return (
    <div>
      {/* Small Screen */}
      <div className="md:hidden flex">
        <div
          className="w-[34px] h-[34px] object-contain cursor-pointer p-2"
          onClick={() => setToggleDrawer(true)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 20 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 8.4H20V5.6H0V8.4ZM0 14H20V11.2H0V14ZM0 2.8H20V0H0V2.8Z"
              fill="#999"
            />
          </svg>
        </div>

        <div
          className={`flex flex-col absolute right-0 left-0 z-10 shadow-secondary py-4 bg-[#171717] max-w-xs h-screen overflow-y-auto md:min-w-[20rem] ${
            !toggleDrawer ? '-translate-x-[100vh]' : 'translate-x-0'
          } transition-all duration-700`}
        >
          <div className="p-2 flex flex-col flex-1">
            <div className="flex-1">
              <NewChat />
              <div className="sm:inline">
                <ModelSelection />
              </div>
              <div className="flex flex-col space-y-1 my-2">
                {!chats && !error && (
                  <div className="animate-pulse text-center text-[#888]">
                    Loading Chats...
                  </div>
                )}
                {chats?.map(chat => (
                  <ChatRow key={chat.chatId} id={chat.chatId} lastMessage={chat.lastMessage} />
                ))}
              </div>
            </div>

            <hr className="mb-2 border-[#2f2f2f]" />

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

              <div onClick={() => signOut()} className="chatrow justify-start cursor-pointer">
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <p>Log out</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-1 md:hidden absolute right-36 border-[#424242] border ${
            !toggleDrawer ? '-translate-x-[100vh]' : 'translate-x-0'
          } transition-all duration-700`}
        >
          <PlusIcon
            className="w-[34px] h-[34px] rotate-45 text-white cursor-pointer"
            onClick={() => setToggleDrawer(false)}
          />
        </div>
      </div>
    </div>
  )
}
