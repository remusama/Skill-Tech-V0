import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const proyectos = [
  {
    nombre: "Rediseño de la página web",
    progreso: 75,
    estado: "En progreso",
    fechaLimite: "2023-12-15",
    miembros: [
      { nombre: "Ana G.", imagen: "/placeholder.svg?height=32&width=32" },
      { nombre: "Carlos M.", imagen: "/placeholder.svg?height=32&width=32" },
      { nombre: "Elena R.", imagen: "/placeholder.svg?height=32&width=32" },
    ],
    tareas: [
      { nombre: "Diseño de la página de inicio", completada: true },
      { nombre: "Implementación del formulario de contacto", completada: false },
      { nombre: "Optimización para dispositivos móviles", completada: false },
    ],
  },
  {
    nombre: "Desarrollo de la app móvil",
    progreso: 40,
    estado: "En progreso",
    fechaLimite: "2024-03-01",
    miembros: [
      { nombre: "Luis P.", imagen: "/placeholder.svg?height=32&width=32" },
      { nombre: "María S.", imagen: "/placeholder.svg?height=32&width=32" },
    ],
    tareas: [
      { nombre: "Diseño de la interfaz de usuario", completada: true },
      { nombre: "Implementación de la autenticación", completada: true },
      { nombre: "Desarrollo de la funcionalidad principal", completada: false },
      { nombre: "Pruebas de usuario", completada: false },
    ],
  },
  {
    nombre: "Campaña de marketing digital",
    progreso: 90,
    estado: "Casi terminado",
    fechaLimite: "2023-11-30",
    miembros: [
      { nombre: "Sofia L.", imagen: "/placeholder.svg?height=32&width=32" },
      { nombre: "Diego F.", imagen: "/placeholder.svg?height=32&width=32" },
      { nombre: "Isabel M.", imagen: "/placeholder.svg?height=32&width=32" },
    ],
    tareas: [
      { nombre: "Análisis de mercado", completada: true },
      { nombre: "Creación de contenido", completada: true },
      { nombre: "Lanzamiento de anuncios", completada: true },
      { nombre: "Evaluación de resultados", completada: false },
    ],
  },
]

export function ProjectManagement() {
  return (
    <div className="space-y-6">
      {proyectos.map((proyecto, index) => (
        <Card key={index} className="bg-[#171a4a] border-[#2f2c79]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-white">{proyecto.nombre}</CardTitle>
            <Badge variant={proyecto.estado === "En progreso" ? "default" : "secondary"} className="ml-2">
              {proyecto.estado}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-400">Progreso: {proyecto.progreso}%</div>
              <div className="text-sm text-gray-400">Fecha límite: {proyecto.fechaLimite}</div>
            </div>
            <Progress value={proyecto.progreso} className="mb-4" />
            <div className="flex justify-between items-center mb-4">
              <div className="flex -space-x-2">
                {proyecto.miembros.map((miembro, mIndex) => (
                  <Avatar key={mIndex} className="border-2 border-background">
                    <AvatarImage src={miembro.imagen || "/placeholder.svg"} alt={miembro.nombre} />
                    <AvatarFallback>{miembro.nombre.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="text-sm text-gray-400">{proyecto.miembros.length} miembros</div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Tareas</h4>
              <ul className="space-y-1">
                {proyecto.tareas.map((tarea, tIndex) => (
                  <li key={tIndex} className="flex items-center">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${tarea.completada ? "bg-[#7f00b2]" : "bg-gray-500"}`}
                    ></span>
                    <span className={`text-sm ${tarea.completada ? "text-gray-400 line-through" : "text-white"}`}>
                      {tarea.nombre}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
