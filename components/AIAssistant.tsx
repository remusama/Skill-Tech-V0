"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EleonorAIChat } from "./EleonorAIChat"

export function AIAssistant() {
  return (
    <div className="w-full h-[calc(100vh-150px)] flex flex-col p-4">
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            EleonorAI
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <EleonorAIChat />
        </CardContent>
      </Card>
    </div>
  )
}
