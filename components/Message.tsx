'use client'

import TypeIt from 'typeit-react'
import { PencilSquareIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

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

const parseMarkdown = (text: string): JSX.Element[] => {
  const elements: JSX.Element[] = [];
  const lines = text.split('\n');
  
  lines.forEach((line, index) => {
    if (line.trim() === '') {
      elements.push(<br key={`br-${index}`} />);
      return;
    }
    
    // Handle headers
    if (line.startsWith('# ')) {
      elements.push(<h1 key={`h1-${index}`} className="text-2xl font-bold my-2">{line.substring(2)}</h1>);
      return;
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={`h2-${index}`} className="text-xl font-bold my-2">{line.substring(3)}</h2>);
      return;
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={`h3-${index}`} className="text-lg font-bold my-2">{line.substring(4)}</h3>);
      return;
    }
    
    // Handle bold text with **
    const parts: (string | JSX.Element)[] = [];
    let remaining = line;
    
    while (remaining.includes('**')) {
      const before = remaining.substring(0, remaining.indexOf('**'));
      remaining = remaining.substring(remaining.indexOf('**') + 2);
      
      if (remaining.includes('**')) {
        const boldText = remaining.substring(0, remaining.indexOf('**'));
        remaining = remaining.substring(remaining.indexOf('**') + 2);
        
        if (before) parts.push(before);
        parts.push(<strong key={`strong-${index}-${parts.length}`} className="font-bold">{boldText}</strong>);
      } else {
        parts.push(before + '**' + remaining);
        remaining = '';
      }
    }
    
    if (remaining) parts.push(remaining);
    
    elements.push(<p key={`p-${index}`} className="my-1">{parts}</p>);
  });
  
  return elements;
};

export default function Message({
  message,
  isNewBotMessage = false,
  canEdit = false,
  onEdit,
}: Props) {
  const isChatBot = message.user.name === 'Gemini'
  const [copied, setCopied] = useState(false)
  const imageRegex = /\[Image:\s*(https?:\/\/[^\]]+)\]/i
  const imageMatch = message.text.match(imageRegex)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="py-3 text-white">
      <div className={`relative flex max-w-3xl my-4 mx-auto ${!isChatBot ? 'justify-end' : ''}`}>
        <div className={`relative group ${!isChatBot ? 'max-w-[80%]' : 'w-[100%]'} flex flex-col items-start gap-3 px-5 py-2 rounded-3xl ${!isChatBot ? 'bg-[#303030]' : ''}`}>

          {imageMatch && !isChatBot && canEdit ? (
            <>
              <img
                src={imageMatch[1]}
                alt="query image"
                className="max-h-56 rounded-md"
              />
              {/* Optionally show text without image markdown */}
             <div className="text-base mt-2">{parseMarkdown(message.text.replace(imageRegex, '').trim())}</div>
            </>
          ) : isChatBot && isNewBotMessage ? (
            <TypeIt
              options={{ 
                strings: [message.text], 
                speed: 20, 
                waitUntilVisible: true,
                afterComplete: function (instance: any) {
                  instance.destroy();
                }
              }}
              getBeforeInit={(instance: any) => {
                // Format the text for TypeIt to handle basic formatting
                const formattedText = message.text
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\#\s(.*?)(?=\n|$)/g, '<h1 style="font-size: 1.5rem; font-weight: bold; margin: 0.5rem 0;">$1</h1>')
                  .replace(/\#\#\s(.*?)(?=\n|$)/g, '<h2 style="font-size: 1.25rem; font-weight: bold; margin: 0.5rem 0;">$1</h2>');
                
                instance.type(formattedText);
                return instance;
              }}
            />
          ) : (
            <p className="text-base">{parseMarkdown(message.text)}</p>
          )}


          <div className="absolute h-[200%] w-[100%] top-0 left-0"></div>

          {/* Edit button, only visible for user's own messages on hover */}
          {canEdit && !isChatBot && (
            <button
              type="button"
              onClick={onEdit}
              className="invisible group-hover:visible absolute left-3 -bottom-6 flex items-center text-xs text-gray-300 hover:text-white"
              title="Edit message"
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
          )}

          {/* Copy icon, toggles to check icon on click */}
          <button
            type="button"
            onClick={handleCopy}
            className={`${!isChatBot && 'invisible'} group-hover:visible absolute ${isChatBot ? 'left-4' : ' left-12'} -bottom-6 flex items-center text-gray-300 hover:text-white`}
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
  )
}
