'use client'

import { PencilSquareIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useRef, useMemo } from 'react'

type MessageType = {
  _id: string
  userEmail: string
  chatId: string
  text: string
  createdAt: Date
  user: {
    _id: string
    name: string
  }
}

type Props = {
  message: MessageType
  isLast: boolean
  isNewBotMessage?: boolean
  canEdit?: boolean
  onEdit?: () => void
}

function parseInline(text: string, lineIndex: number): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = []
  let remaining = text
  let partKey = 0

  while (remaining.includes('**')) {
    const startIdx = remaining.indexOf('**')
    const before = remaining.substring(0, startIdx)
    remaining = remaining.substring(startIdx + 2)

    const endIdx = remaining.indexOf('**')
    if (endIdx === -1) {
      parts.push(before + '**' + remaining)
      remaining = ''
      break
    }

    const boldText = remaining.substring(0, endIdx)
    remaining = remaining.substring(endIdx + 2)

    if (before) parts.push(before)
    parts.push(<strong key={`b-${lineIndex}-${partKey++}`} className="font-bold">{boldText}</strong>)
  }

  if (remaining) parts.push(remaining)
  return parts
}

function parseMarkdown(text: string): JSX.Element[] {
  const lines = text.split('\n')
  const elements: JSX.Element[] = []
  let consecutiveBlanks = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === '') {
      consecutiveBlanks++
      // Collapse multiple blank lines into one
      if (consecutiveBlanks <= 1) {
        elements.push(<br key={`br-${i}`} />)
      }
      continue
    }
    consecutiveBlanks = 0
    if (line.startsWith('### ')) {
      elements.push(<h3 key={`h-${i}`} className="text-lg font-bold mt-3 mb-1">{parseInline(line.substring(4), i)}</h3>)
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={`h-${i}`} className="text-xl font-bold mt-3 mb-1">{parseInline(line.substring(3), i)}</h2>)
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={`h-${i}`} className="text-2xl font-bold mt-3 mb-1">{parseInline(line.substring(2), i)}</h1>)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(<li key={`li-${i}`} className="ml-4 list-disc">{parseInline(line.substring(2), i)}</li>)
    } else {
      elements.push(<p key={`p-${i}`} className="leading-relaxed">{parseInline(line, i)}</p>)
    }
  }

  return elements
}

const IMAGE_REGEX = /\[Image:\s*(https?:\/\/[^\]]+)\]/i

export default function Message({
  message,
  isNewBotMessage = false,
  canEdit = false,
  onEdit,
}: Props) {
  const isChatBot = message.user.name === 'Gemini'
  const isError = (message as any).isError
  const [copied, setCopied] = useState(false)
  const imageMatch = message.text.match(IMAGE_REGEX)

  // Lightweight typewriter: reveal characters progressively
  const [displayedLen, setDisplayedLen] = useState(
    isChatBot && isNewBotMessage ? 0 : message.text.length
  )
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!isChatBot || !isNewBotMessage) {
      setDisplayedLen(message.text.length)
      return
    }

    setDisplayedLen(0)
    let pos = 0
    const textLen = message.text.length
    const charsPerFrame = Math.max(2, Math.ceil(textLen / 200)) // adaptive speed

    function tick() {
      pos = Math.min(pos + charsPerFrame, textLen)
      setDisplayedLen(pos)
      if (pos < textLen) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [message.text, isChatBot, isNewBotMessage])

  const visibleText = isChatBot && isNewBotMessage
    ? message.text.slice(0, displayedLen)
    : message.text

  const rendered = useMemo(() => parseMarkdown(visibleText), [visibleText])

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="py-2 text-[#ececec]">
      <div className={`relative flex max-w-3xl my-2 mx-auto ${!isChatBot ? 'justify-end' : ''}`}>
        <div className={`relative group ${!isChatBot ? 'max-w-[80%]' : 'w-full'} flex flex-col items-start gap-2 px-5 pt-2 pb-8 rounded-3xl ${
          isError ? 'bg-red-900/30 border border-red-800/50' :
          !isChatBot ? 'bg-[#2f2f2f]' : ''
        }`}>

          {imageMatch && !isChatBot && canEdit ? (
            <>
              <img
                src={imageMatch[1]}
                alt="query image"
                className="max-h-56 rounded-md"
              />
              <div className="text-base mt-2">{parseMarkdown(message.text.replace(IMAGE_REGEX, '').trim())}</div>
            </>
          ) : (
            <div className="text-base">{rendered}</div>
          )}

          <div className="absolute bottom-1.5 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {canEdit && !isChatBot && (
              <button
                type="button"
                onClick={onEdit}
                className="flex items-center text-xs text-[#888] hover:text-white"
                title="Edit message"
              >
                <PencilSquareIcon className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center text-[#888] hover:text-white"
              title={copied ? 'Copied!' : 'Copy message'}
            >
              {copied ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <ClipboardIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
