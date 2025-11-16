"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const tutorialSteps = [
  {
    title: "Bienvenido a SkillTech",
    content:
      "Esta plataforma te ayudará a gestionar tus proyectos y mejorar tus habilidades. Vamos a hacer un recorrido rápido.",
  },
  {
    title: "Dashboard",
    content: "Aquí podrás ver un resumen de tu actividad, resultados de exámenes y progreso general.",
  },
  {
    title: "Calendario",
    content: "Mantén un registro de tus eventos, fechas de exámenes y plazos importantes.",
  },
  {
    title: "Exámenes",
    content:
      "En esta sección encontrarás todas las evaluaciones. Prepárate y mide tus conocimientos en diversas áreas.",
  },
  {
    title: "Documentos",
    content: "Almacena y comparte documentos importantes relacionados con tus proyectos.",
  },
]

export function TutorialOverlay({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  // Verificamos que tengamos todos los datos necesarios antes de renderizar
  if (!tutorialSteps || !onComplete) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#171a4a] p-6 rounded-lg shadow-lg max-w-md w-full border border-[#2f2c79]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{tutorialSteps[currentStep]?.title || ""}</h2>
          <Button variant="ghost" size="icon" onClick={handleSkip}>
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
        <p className="text-gray-300 mb-6">{tutorialSteps[currentStep]?.content || ""}</p>
        {currentStep === 4 && (
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Calendario Mejorado</h2>
            <p className="mb-4">
              Hemos mejorado el calendario con nuevas funciones como arrastrar y soltar eventos, filtrado por
              categorías, y múltiples vistas para organizar mejor tu tiempo.
            </p>
            <p>Prueba a crear un nuevo evento o arrastra uno existente para cambiar su horario.</p>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentStep ? "bg-[#7f00b2]" : "bg-gray-600"}`}
              />
            ))}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleSkip}>
              Saltar
            </Button>
            <Button onClick={handleNext}>{currentStep === tutorialSteps.length - 1 ? "Finalizar" : "Siguiente"}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
