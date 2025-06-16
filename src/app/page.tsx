"use client"

import { useState, useEffect } from "react"
import ApiKeyInput from "@/components/api-key-input"
import ChatBox from "@/components/chat-box"

export interface Message {
  role: "user" | "assistant"
  content: string
}

export default function Home() {
  const [apiKey, setApiKey] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // Load API key and messages from localStorage
    const savedApiKey = localStorage.getItem("chat-api-key")
    const savedMessages = localStorage.getItem("chat-messages")

    if (savedApiKey) {
      setApiKey(savedApiKey)
    }

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error("Failed to parse saved messages:", error)
      }
    }
  }, [])

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key)
    localStorage.setItem("chat-api-key", key)
  }

  const handleNewMessage = (newMessages: Message[]) => {
    setMessages(newMessages)
    localStorage.setItem("chat-messages", JSON.stringify(newMessages))
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem("chat-messages")
  }

  const clearApiKey = () => {
    setApiKey("")
    localStorage.removeItem("chat-api-key")
  }

  if (!apiKey) {
    return <ApiKeyInput onSubmit={handleApiKeySubmit} />
  }

  return (
    <ChatBox
      apiKey={apiKey}
      messages={messages}
      onMessagesChange={handleNewMessage}
      onClearChat={clearChat}
      onClearApiKey={clearApiKey}
    />
  )
}
