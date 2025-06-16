"use client"

import { Card } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import type { Message } from "@/app/page"
import { User, Bot } from "lucide-react"

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-4 h-4 text-black" />
        </div>
      )}

      <Card
        className={`max-w-[80%] md:max-w-[70%] ${
          isUser ? "bg-white text-black" : "bg-zinc-900 border-zinc-800 text-white"
        } rounded-2xl overflow-hidden`}
      >
        <div className="px-4 py-2">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                code: ({ inline, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
                  if (inline) {
                    return (
                      <code className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    )
                  }
                  return (
                    <div className="my-4">
                      <pre className="bg-zinc-800 rounded-lg p-4 overflow-x-auto">
                        <code className="text-zinc-200 text-sm font-mono">{children}</code>
                      </pre>
                    </div>
                  )
                },
                p: ({ children }) => <p className="prose prose-invert max-w-none mb-3 last:mb-0 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="prose prose-invert max-w-none list-disc list-inside mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="prose prose-invert max-w-none list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                h1: ({ children }) => <h1 className="prose prose-invert max-w-none text-xl font-semibold mb-3 mt-6 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="prose prose-invert max-w-none text-lg font-semibold mb-3 mt-5 first:mt-0">{children}</h2>,
                h3: ({ children }) => <h3 className="prose prose-invert max-w-none text-base font-semibold mb-2 mt-4 first:mt-0">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="prose prose-invert max-w-none border-l-4 border-zinc-600 pl-4 my-3 italic">{children}</blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </Card>

      {isUser && (
        <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  )
}
