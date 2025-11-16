import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const miembrosEquipo = [
  {
    nombre: "Laura López",
    rol: "Artista",
    actividad: 78,
    tiempoHoy: "5:42",
    tiempoSemana: "12:33",
    estado: "activo",
    imagen: "/placeholder.svg?height=32&width=32",
    tareas: ["Diseño de logo", "Ilustraciones para web"],
    habilidades: ["Ilustración", "Diseño gráfico", "UI/UX"],
  },
  {
    nombre: "Sofía Martínez",
    rol: "Oradora",
    actividad: 65,
    tiempoHoy: "6:21",
    tiempoSemana: "23:14",
    estado: "ocupado",
    imagen: "/placeholder.svg?height=32&width=32",
    tareas: ["Preparación de presentación", "Ensayo de discurso"],
    habilidades: ["Oratoria", "Comunicación", "Liderazgo"],
  },
  {
    nombre: "David Mamani",
    rol: "Investigador",
    actividad: 82,
    tiempoHoy: "5:51",
    tiempoSemana: "21:24",
    estado: "activo",
    imagen: "/placeholder.svg?height=32&width=32",
    tareas: ["Análisis de datos", "Redacción de informe"],
    habilidades: ["Análisis de datos", "Estadística", "Redacción científica"],
  },
]

export function TeamManagement() {
  return (
    <Card className="bg-[#171a4a] border-[#2f2c79]">
      <CardHeader>
        <CardTitle className="text-white">Miembros del Equipo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {miembrosEquipo.map((miembro, index) => (
            <div key={index} className="flex items-start justify-between p-4 bg-[#000020] rounded-lg">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={miembro.imagen || "/placeholder.svg"} alt={miembro.nombre} />
                  <AvatarFallback>{miembro.nombre.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-white">{miembro.nombre}</div>
                  <div className="text-sm text-gray-400">{miembro.rol}</div>
                  <div className="mt-2">
                    <div className="text-sm text-gray-400 mb-1">Tareas Actuales:</div>
                    <div className="space-y-1">
                      {miembro.tareas.map((tarea, tIndex) => (
                        <div key={tIndex} className="text-sm text-white">
                          {tarea}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {miembro.habilidades.map((habilidad, hIndex) => (
                      <Badge key={hIndex} variant="secondary" className="text-xs">
                        {habilidad}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white">{miembro.tiempoHoy}</div>
                <div className="text-xs text-gray-400">Hoy</div>
                <div className="text-sm font-medium text-white mt-1">{miembro.tiempoSemana}</div>
                <div className="text-xs text-gray-400">Esta semana</div>
                <Progress value={miembro.actividad} className="w-20 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
