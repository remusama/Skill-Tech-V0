'use client';

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX, Send, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AvatarDisplay from './AvatarDisplay';

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export function EleonorAIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hola, soy Eleonor, tu asistente personal en SkillTech. Estoy aquí para acompañarte en tu crecimiento personal, académico y emprendedor. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (!isPlaying && audioQueue.length > 0 && isTTSEnabled) {
      setIsPlaying(true);
      const audioData = audioQueue[0];
      const audio = new Audio(`data:audio/mp3;base64,${audioData}`);

      audio.onended = () => {
        setAudioQueue((prev) => prev.slice(1));
        setIsPlaying(false);
      };

      audio.onerror = () => {
        console.error("Error al reproducir el audio.");
        setAudioQueue((prev) => prev.slice(1));
        setIsPlaying(false);
      };

      audio.play();
    }
  }, [audioQueue, isPlaying, isTTSEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const assistantMessageId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ]);

    setInput("");
    setIsLoading(true);

    const url = `http://127.0.0.1:8000/api/chat/stream`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage.content }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const push = () => {
        reader.read().then(({ done, value }) => {
          if (done) {
            setIsLoading(false);
            return;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n").filter((line) => line.trim() !== "");

          lines.forEach((line) => {
            if (line.startsWith("data: ")) {
              try {
                const jsonString = line.substring(6);
                const data = JSON.parse(jsonString);

                if (data.type === "text") {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: msg.content + data.content }
                        : msg
                    )
                  );
                } else if (data.type === "audio") {
                  setAudioQueue((prev) => [...prev, data.content]);
                } else if (data.type === "done") {
                  setIsLoading(false);
                } else if (data.type === "error") {
                  setIsLoading(false);
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: `Error: ${data.content}` }
                        : msg
                    )
                  );
                }
              } catch (error) {
                console.error("Failed to parse JSON from stream:", error);
              }
            }
          });
          push();
        });
      };
      push();
    } catch (error) {
      console.error("Error en la conexión de streaming:", error);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: "error-" + Date.now(),
          role: "assistant",
          content: "Error de conexión con el servidor.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const toggleTTS = () => {
    setIsTTSEnabled(!isTTSEnabled);
    if (isTTSEnabled) {
      setAudioQueue([]);
      setIsPlaying(false);
    }
  };

  const MessageItem = React.memo(({ message }: { message: Message }) => (
    <div
      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      {message.role === "assistant" && (
        <div className="w-8 h-8 rounded-full bg-[#60d4ea]/20 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-[#60d4ea]" />
        </div>
      )}
      <Card
        className={`max-w-[80%] ${message.role === "user" ? "bg-[#60d4ea]/10" : "bg-[#1a1a1a]"}`}
      >
        <CardContent className="p-3">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {message.timestamp.toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
      {message.role === "user" && (
        <div className="w-8 h-8 rounded-full bg-[#60d4ea]/20 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-[#60d4ea]" />
        </div>
      )}
    </div>
  ));
  MessageItem.displayName = "MessageItem";

  return (
    <div className="flex h-full p-4 bg-background">
      {/* Columna del Chat */}
      <div className="w-full flex flex-col h-full">
        <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="border-t pt-4 mt-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleTTS}
                className={
                  isTTSEnabled ? "text-[#60d4ea]" : "text-muted-foreground"
                }
              >
                {isTTSEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje para Eleonor..."
                className="flex-1 min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any); // Cast to any to avoid form event type issues
                  }
                }}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="icon"
                className="self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Presiona Enter para enviar, Shift+Enter para nueva línea
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}