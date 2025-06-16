"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Key } from "lucide-react"

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void
}

export default function ApiKeyInput({ onSubmit }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      onSubmit(apiKey.trim())
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 py-5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
            <Key className="w-6 h-6 text-black" />
          </div>
          <CardTitle className="text-white text-2xl font-semibold">Enter API Key</CardTitle>
          <CardDescription className="text-zinc-400">Please enter your API key to start chatting</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-white"
              autoFocus
            />
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-zinc-200 font-medium"
              disabled={!apiKey.trim()}
            >
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
