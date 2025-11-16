"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Code, Sparkles, Zap, Terminal, Copy, CheckCircle2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type AIModel = {
  id: string
  name: string
  provider: string
  description: string
}

type AIResponse = {
  id: string
  content: string
  model: string
  timestamp: Date
}

const availableModels: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Modelo más avanzado de OpenAI con capacidades multimodales",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "Modelo rápido y eficiente para la mayoría de tareas",
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Modelo más potente de Anthropic con razonamiento avanzado",
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Equilibrio entre rendimiento y velocidad",
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    provider: "Meta",
    description: "Modelo de código abierto de Meta de 70B parámetros",
  },
]

export function AIConfigPanel() {
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o")
  const [temperature, setTemperature] = useState<number>(0.7)
  const [maxTokens, setMaxTokens] = useState<number>(1000)
  const [prompt, setPrompt] = useState<string>("")
  const [systemPrompt, setSystemPrompt] = useState<string>("Eres un asistente útil y preciso.")
  const [useSystemPrompt, setUseSystemPrompt] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [responses, setResponses] = useState<AIResponse[]>([])
  const [activeTab, setActiveTab] = useState<string>("config")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Construir el payload para la API
      const payload = {
        model: selectedModel,
        messages: [
          ...(useSystemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: prompt },
        ],
        temperature,
        max_tokens: maxTokens,
      }

      // Simular una llamada a la API (en un entorno real, esto sería un fetch a tu backend)
      // En este ejemplo, simulamos una respuesta después de un retraso
      setTimeout(() => {
        // Simular respuesta
        const newResponse: AIResponse = {
          id: `resp-${Date.now()}`,
          content: `Esta es una respuesta simulada para la solicitud: "${prompt.substring(0, 30)}..."\n\nUsando el modelo ${selectedModel} con temperatura ${temperature} y ${maxTokens} tokens máximos.`,
          model: selectedModel,
          timestamp: new Date(),
        }

        setResponses((prev) => [newResponse, ...prev])
        setIsLoading(false)
        setActiveTab("responses")
      }, 1500)

      // En un entorno real, sería algo como:
      /*
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al generar respuesta')
      }

      const data = await response.json()
      setResponses(prev => [data, ...prev])
      */
    } catch (err: any) {
      console.error("Error generando respuesta:", err)
      setError(err.message || "Error al generar respuesta")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const generatePythonCode = (model: string) => {
    return `import requests
import json

url = "https://api.yourbackend.com/generate"

payload = {
    "model": "${model}",
    "messages": [
        {"role": "system", "content": "${systemPrompt}"},
        {"role": "user", "content": "${prompt.replace(/"/g, '\\"')}"}
    ],
    "temperature": ${temperature},
    "max_tokens": ${maxTokens}
}

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
result = response.json()

print(result["content"])`
  }

  const generateNodeCode = (model: string) => {
    return `const fetch = require('node-fetch');

async function generateText() {
  const response = await fetch('https://api.yourbackend.com/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      model: '${model}',
      messages: [
        {role: 'system', content: '${systemPrompt.replace(/'/g, "\\'")}'},
        {role: 'user', content: '${prompt.replace(/'/g, "\\'")}'}
      ],
      temperature: ${temperature},
      max_tokens: ${maxTokens}
    })
  });
  
  const result = await response.json();
  console.log(result.content);
}

generateText();`
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
        <TabsList className="bg-[#1a1a1a] mb-4">
          <TabsTrigger
            value="config"
            className="data-[state=active]:bg-[#60d4ea]/20 data-[state=active]:text-[#60d4ea]"
          >
            <Zap className="w-4 h-4 mr-2" />
            Configuración
          </TabsTrigger>
          <TabsTrigger
            value="responses"
            className="data-[state=active]:bg-[#60d4ea]/20 data-[state=active]:text-[#60d4ea]"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Respuestas ({responses.length})
          </TabsTrigger>
          <TabsTrigger value="code" className="data-[state=active]:bg-[#60d4ea]/20 data-[state=active]:text-[#60d4ea]">
            <Code className="w-4 h-4 mr-2" />
            Código
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="flex-1 overflow-auto mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de API Generativa</CardTitle>
              <CardDescription>Configura los parámetros para generar texto con modelos de IA</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="model">Modelo</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Selecciona un modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex flex-col">
                              <span>{model.name}</span>
                              <span className="text-xs text-muted-foreground">{model.provider}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {availableModels.find((m) => m.id === selectedModel)?.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="temperature">Temperatura: {temperature.toFixed(1)}</Label>
                    </div>
                    <Slider
                      id="temperature"
                      min={0}
                      max={2}
                      step={0.1}
                      value={[temperature]}
                      onValueChange={(value) => setTemperature(value[0])}
                      className="my-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Valores más bajos generan respuestas más deterministas, valores más altos más creativas.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="max-tokens">Tokens máximos: {maxTokens}</Label>
                    </div>
                    <Slider
                      id="max-tokens"
                      min={100}
                      max={4000}
                      step={100}
                      value={[maxTokens]}
                      onValueChange={(value) => setMaxTokens(value[0])}
                      className="my-2"
                    />
                    <p className="text-xs text-muted-foreground">Limita la longitud de la respuesta generada.</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="use-system-prompt" checked={useSystemPrompt} onCheckedChange={setUseSystemPrompt} />
                    <Label htmlFor="use-system-prompt">Usar prompt de sistema</Label>
                  </div>

                  {useSystemPrompt && (
                    <div>
                      <Label htmlFor="system-prompt">Prompt de sistema</Label>
                      <Textarea
                        id="system-prompt"
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        placeholder="Instrucciones para el modelo..."
                        className="h-20"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Define el comportamiento general del modelo.</p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Escribe tu prompt aquí..."
                      className="h-32"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full">
                  {isLoading ? "Generando..." : "Generar respuesta"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="flex-1 overflow-auto mt-0">
          <ScrollArea className="h-full">
            {responses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Sparkles className="h-12 w-12 mb-4 opacity-50" />
                <p>No hay respuestas generadas todavía</p>
                <Button variant="link" onClick={() => setActiveTab("config")} className="mt-2">
                  Configura y genera tu primera respuesta
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {responses.map((response, index) => (
                  <Card key={response.id} className="bg-[#1a1a1a]">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm font-medium">
                            {availableModels.find((m) => m.id === response.model)?.name || response.model}
                          </CardTitle>
                          <CardDescription>{response.timestamp.toLocaleString()}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(response.content, index)}>
                          {copiedIndex === index ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-[#141414] p-3 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{response.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="code" className="flex-1 overflow-auto mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Código para integración</CardTitle>
              <CardDescription>Ejemplos de código para integrar con la API generativa</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="python">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center">
                      <Terminal className="mr-2 h-4 w-4" />
                      Python
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="relative">
                      <pre className="bg-[#141414] p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{generatePythonCode(selectedModel)}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generatePythonCode(selectedModel), -1)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Este código utiliza la biblioteca requests para enviar una solicitud a tu backend.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="node">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center">
                      <Terminal className="mr-2 h-4 w-4" />
                      Node.js
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="relative">
                      <pre className="bg-[#141414] p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{generateNodeCode(selectedModel)}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generateNodeCode(selectedModel), -1)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Este código utiliza node-fetch para enviar una solicitud a tu backend.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="curl">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center">
                      <Terminal className="mr-2 h-4 w-4" />
                      cURL
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="relative">
                      <pre className="bg-[#141414] p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`curl -X POST \\
  https://api.yourbackend.com/generate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "${selectedModel}",
    "messages": [
      {"role": "system", "content": "${systemPrompt.replace(/"/g, '\\"')}"},
      {"role": "user", "content": "${prompt.replace(/"/g, '\\"')}"}
    ],
    "temperature": ${temperature},
    "max_tokens": ${maxTokens}
  }'`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          copyToClipboard(
                            `curl -X POST \\
  https://api.yourbackend.com/generate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "${selectedModel}",
    "messages": [
      {"role": "system", "content": "${systemPrompt.replace(/"/g, '\\"')}"},
      {"role": "user", "content": "${prompt.replace(/"/g, '\\"')}"}
    ],
    "temperature": ${temperature},
    "max_tokens": ${maxTokens}
  }'`,
                            -1,
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Comando cURL para probar la API desde la terminal.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Nota: Reemplaza "https://api.yourbackend.com/generate" y "YOUR_API_KEY" con tus valores reales.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
