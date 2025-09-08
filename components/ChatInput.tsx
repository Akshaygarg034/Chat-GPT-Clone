// components/ChatInput.tsx
'use client'

import { ArrowUpIcon, PaperClipIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useSession } from 'next-auth/react'
import { FormEvent, KeyboardEvent, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'

type MessageType = {
    _id: string
    userEmail: string
    chatId: string
    text: string
    createdAt: string | Date
    user: { _id: string; name: string }
}

type Props = {
    chatId: string
    messages?: MessageType[]
    onMessageSent: (message: any) => void
    promptValue: string
    setPromptValue: (v: string) => void
}

export default function ChatInput({
    chatId,
    messages,
    onMessageSent,
    promptValue,
    setPromptValue,
}: Props) {
    const { data: session } = useSession()
    const { data: model } = useSWR('model', { fallbackData: 'gemini-1.5-flash' })

    const [uploading, setUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [publicId, setPublicId] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'               // Reset height to recalc scrollHeight
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px' // Set to scrollHeight
        }
    }

    const handlePinClick = () => {
        fileInputRef.current?.click()
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage(e as any)
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        toast.loading('Uploading image...', { id: 'upload' })

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
                { method: 'POST', body: formData }
            )
            const data = await res.json()
            if (data.secure_url && data.public_id) {
                setImageUrl(data.secure_url)
                setPublicId(data.public_id)
                toast.success('Image uploaded', { id: 'upload' })
            } else {
                throw new Error('Upload failed')
            }
        } catch {
            toast.error('Upload failed', { id: 'upload' })
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    // Client-side call to your own API route for deletion
    const handleRemoveImage = async () => {
        if (!publicId) {
            setImageUrl(null)
            return
        }
        toast.loading('Removing image...', { id: 'remove' })
        try {
            const res = await fetch('/api/delete-cloudinary-image', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicId }),
            })
            if (res.ok) {
                toast.success('Image removed', { id: 'remove' })
            } else {
                toast('Image removed locally', { id: 'remove', icon: '⚠️' })
            }
        } catch {
            toast('Image removed locally', { id: 'remove', icon: '⚠️' })
        } finally {
            setImageUrl(null)
            setPublicId(null)
        }
    }

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault()
        if ((!promptValue && !imageUrl) || !session) return

        let input = promptValue.trim()

        // If image is present, append its url inside prompt for Gemini understanding
        if (imageUrl) {
            input += `\n\n[Image: ${imageUrl}]`
        }

        setPromptValue('')
        setImageUrl(null)
        setPublicId(null)

        const userMessage = {
            _id: 'temp-id-' + Date.now(),
            userEmail: session.user!.email!,
            chatId,
            text: input,
            image: imageUrl, // Keep image property if you want to render image separately in UI
            createdAt: new Date().toISOString(),
            user: { _id: session.user!.email!, name: session.user!.name! },
        }
        onMessageSent(userMessage)
        toast.loading('ChatGPT is thinking...', { id: 'thinking' })

        const res = await fetch('/api/askquestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: input, chatId, model, imageUrl }),
        })

        if (res.ok) {
            toast.dismiss('thinking')
            const data = await res.json()
            if (data.botMessage) {
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
        <div className="flex flex-col p-4 md:p-0 items-center w-full">
            <div className="bg-[#303030] text-white rounded-3xl w-full lg:max-w-3xl mt-10 mb-3">
                <form onSubmit={sendMessage} className="flex items-center space-x-3 p-3 px-3">
                    <button
                        type="button"
                        onClick={handlePinClick}
                        disabled={uploading}
                        className="p-2 text-[#afafaf] hover:text-white hover:bg-[#454545] rounded-full"
                    >
                        <PaperClipIcon className="h-5 w-5 -rotate-45" />
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <textarea
                        className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-400 placeholder-[#afafaf] scrollbar-none"
                        placeholder={uploading ? 'Uploading...' : imageUrl ? 'Image attached, add text…' : 'Ask anything'}
                        value={promptValue}
                        onChange={(e) => {
                            setPromptValue(e.target.value)
                            handleInput()
                        }}
                        disabled={!session || uploading}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        style={{
                            resize: 'none',
                            maxHeight: '200px',
                            overflowY: 'auto'
                        }}
                    />
                    <button
                        type="submit"
                        className="bg-white text-black p-2 rounded-full disabled:bg-[#454545] disabled:text-white disabled:cursor-not-allowed"
                        disabled={(!promptValue && !imageUrl) || !session}
                    >
                        <ArrowUpIcon className="h-4 w-4" />
                    </button>
                </form>

                {imageUrl && (
                    <div className="px-5 pb-3 relative">
                        <div className="inline-block relative">
                            <img src={imageUrl} alt="preview" className="max-h-40 rounded-lg" />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {messages && messages.length > 0 && (
                <h1 className="w-full text-center text-xs mb-5 text-white">
                    ChatGPT can make mistakes. Check important info. See <span className="underline">Cookie Preferences.</span>
                </h1>
            )}
        </div>
    )
}
