"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Trash2, Key, Loader2 } from "lucide-react"
import MessageBubble from "@/components/message-bubble"
import type { Message } from "@/app/page"

interface ChatBoxProps {
  apiKey: string
  messages: Message[]
  onMessagesChange: (messages: Message[]) => void
  onClearChat: () => void
  onClearApiKey: () => void
}

export default function ChatBox({ apiKey, messages, onMessagesChange, onClearChat, onClearApiKey }: ChatBoxProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMessage]
    onMessagesChange(newMessages)
    setInput("")
    setIsLoading(true)

    // Add empty assistant message for streaming
    const assistantMessage: Message = { role: "assistant", content: "" }
    const messagesWithAssistant = [...newMessages, assistantMessage]
    onMessagesChange(messagesWithAssistant)

    try {
      const response = await fetch("http://localhost:5050/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ prompt: input.trim() }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let result = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          result += decoder.decode(value, { stream: true })

          // Update the last assistant message with streaming content
          const updatedMessages = [...newMessages]
          updatedMessages.push({ role: "assistant", content: result })
          onMessagesChange(updatedMessages)
        }
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, there was an error processing your request. Please check your API key and try again.",
      }
      onMessagesChange([...newMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

 return (
    <div className="h-screen bg-black flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-black border-b border-zinc-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-white text-xl font-semibold">Chat</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearChat}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearApiKey}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <Key className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="max-w-4xl mx-auto p-4 space-y-6 pb-6">
            {messages.length === 0 ? (
              <div className="text-center text-zinc-500 mt-20">
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Send className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium mb-2">Start a conversation</p>
                <p className="text-sm">Type a message below to get started</p>
              </div>
            ) : (
              messages.map((message, index) => <MessageBubble key={index} message={message} />)
            )}
            {isLoading && messages[messages.length - 1]?.role === "assistant" && (
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Sticky Input */}
      <div className="sticky bottom-0 z-10 bg-black border-t border-zinc-800 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-white rounded-2xl h-12"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-white text-black hover:bg-zinc-200 rounded-2xl h-12 px-6"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
