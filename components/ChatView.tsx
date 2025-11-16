"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: number
  sender: string
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "Sistema",
    content: "¡Bienvenido al chat de SkillTech! ¿En qué puedo ayudarte hoy?",
    timestamp: new Date(),
  },
]

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "Usuario",
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulated response from the system
    setTimeout(() => {
      const systemResponse: Message = {
        id: messages.length + 2,
        sender: "Sistema",
        content: "Gracias por tu mensaje. ¿En qué más puedo ayudarte?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, systemResponse])
    }, 1000)
  }

  return (
    <Card className="bg-[#171a4a] border-[#2f2c79] h-[calc(100vh-150px)] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-white">Chat de Soporte</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "Usuario" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[70%] ${message.sender === "Usuario" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={
                        message.sender === "Usuario"
                          ? "/placeholder.svg?height=32&width=32"
                          : "/placeholder.svg?height=32&width=32"
                      }
                    />
                    <AvatarFallback>{message.sender[0]}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${message.sender === "Usuario" ? "bg-[#7f00b2] text-white" : "bg-[#2f2c79] text-white"}`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-50">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t border-[#2f2c79]">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-[#000020] border-none text-white placeholder-gray-400 focus:ring-[#7f00b2] focus:ring-2"
          />
          <Button type="submit">Enviar</Button>
        </form>
      </div>
    </Card>
  )
}
