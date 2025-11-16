"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

const proyectos = [
  { nombre: "Diseño de App", progreso: 75 },
  { nombre: "Investigación de Mercado", progreso: 50 },
  { nombre: "Desarrollo Web", progreso: 30 },
]

export function TimeControl() {
  const [cronometroActivo, setCronometroActivo] = useState(false)
  const [tiempoCronometro, setTiempoCronometro] = useState(0)

  useEffect(() => {
    let interval
    if (cronometroActivo) {
      interval = setInterval(() => {
        setTiempoCronometro((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [cronometroActivo])

  const formatTiempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segs).padStart(2, "0")}`
  }

  return (
    <div className="space-y-8">
      <Card className="bg-[#171a4a] border-[#2f2c79]">
        <CardHeader>
          <CardTitle className="text-white">Cronómetro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl font-bold text-white font-mono">{formatTiempo(tiempoCronometro)}</div>
            <div className="flex gap-4">
              <Button variant="outline" size="icon" onClick={() => setCronometroActivo(!cronometroActivo)}>
                {cronometroActivo ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => setTiempoCronometro(0)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#171a4a] border-[#2f2c79]">
        <CardHeader>
          <CardTitle className="text-white">Tiempo por Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proyectos.map((proyecto, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-white">{proyecto.nombre}</span>
                <span className="text-gray-400">
                  {Math.floor(Math.random() * 8 + 2)}h {Math.floor(Math.random() * 60)}m
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
