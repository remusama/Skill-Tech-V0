import { Card, CardContent } from "@/components/ui/card"
import { EleonorAIChat } from "@/components/EleonorAIChat" // Importamos el chat real
import AvatarDisplay from "@/components/AvatarDisplay";

// El antiguo VirtualAssistant ha sido reemplazado por la integración completa de Eleonor AI.
export function VirtualAssistant() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Columna Izquierda: VTuber */}
      <div className="lg:col-span-2">
        <Card className="h-[calc(100vh-6rem)] bg-black/20 border-none overflow-hidden">
          <AvatarDisplay />
        </Card>
      </div>

      {/* Columna Derecha: Chat con Eleonor AI */}
      <div className="lg:col-span-1 bg-black/20 rounded-lg p-4 flex flex-col h-[calc(100vh-6rem)]">
        <EleonorAIChat />
      </div>
    </div>
  )
}
