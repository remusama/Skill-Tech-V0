import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { EleonorAIChat } from "@/components/EleonorAIChat" // Importamos el chat
import AvatarDisplay from "@/components/AvatarDisplay";

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Columna Izquierda: VTuber y Estadísticas */}
      <div className="lg:col-span-2 space-y-8">
        <Card className="h-3/5 bg-black/20 border-none overflow-hidden">
          <AvatarDisplay />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Actividad Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#FF8042]">76%</div>
              <Progress value={76} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Horas Esta Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00C49F]">131:42:11</div>
              <Progress value={75} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Columna Derecha: Chat con Eleonor AI */}
      <div className="lg:col-span-1 bg-black/20 rounded-lg p-4 flex flex-col h-[calc(100vh-4rem)]">
        <EleonorAIChat />
      </div>
    </div>
  )
}
