"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Folder, MoreVertical, Plus, Search } from "lucide-react"

type Document = {
  id: string
  name: string
  type: "file" | "folder"
  lastModified: Date
}

const initialDocuments: Document[] = [
  { id: "1", name: "Proyecto A", type: "folder", lastModified: new Date("2023-11-10") },
  { id: "2", name: "Informe mensual", type: "file", lastModified: new Date("2023-11-15") },
  { id: "3", name: "Presentación cliente", type: "file", lastModified: new Date("2023-11-18") },
  { id: "4", name: "Recursos", type: "folder", lastModified: new Date("2023-11-05") },
  { id: "5", name: "Contrato", type: "file", lastModified: new Date("2023-11-20") },
]

export function DocumentView() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card className="bg-[#171a4a] border-[#2f2c79]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-white">Documentos</CardTitle>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-[#000020] border-none text-white placeholder-gray-400 focus:ring-[#7f00b2] focus:ring-2"
          />
        </div>
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 hover:bg-[#2f2c79] rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {doc.type === "folder" ? (
                    <Folder className="text-[#7f00b2]" />
                  ) : (
                    <FileText className="text-gray-400" />
                  )}
                  <span className="text-white">{doc.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">{doc.lastModified.toLocaleDateString()}</span>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
