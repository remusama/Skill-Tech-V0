"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, FileText, Microscope, Calculator, Code, BookMarked, Stethoscope, Info } from "lucide-react"
import { QuizInterface } from "./QuizInterface"
import { getRandomQuestions } from "./QuizData"
import { motion, AnimatePresence } from "framer-motion"

// Modificar el array examAreas para que todos los exámenes aparezcan como "Disponible"

const examAreas = [
  {
    id: "ciencias",
    name: "Ciencias",
    icon: Microscope,
    exams: [
      {
        id: "fisica-1",
        title: "Física I: Mecánica Clásica",
        professor: "Dr. Ricardo Alonso",
        duration: "120 min",
        questions: 45,
        date: "2023-12-15",
        status: "Disponible",
        difficulty: 75,
      },
      {
        id: "quimica-organica",
        title: "Química Orgánica",
        professor: "Dra. María Fernández",
        duration: "90 min",
        questions: 30,
        date: "2023-12-18",
        status: "Disponible",
        difficulty: 80,
      },
      {
        id: "biologia-celular",
        title: "Biología Celular",
        professor: "Dr. Javier Martínez",
        duration: "100 min",
        questions: 40,
        date: "2023-12-10",
        status: "Disponible",
        difficulty: 65,
      },
    ],
  },
  {
    id: "matematicas",
    name: "Matemáticas",
    icon: Calculator,
    exams: [
      {
        id: "calculo-1",
        title: "Cálculo Diferencial",
        professor: "Dr. Pablo Sánchez",
        duration: "120 min",
        questions: 25,
        date: "2023-12-14",
        status: "Disponible",
        difficulty: 85,
      },
      {
        id: "algebra-lineal",
        title: "Álgebra Lineal",
        professor: "Dra. Laura Gómez",
        duration: "90 min",
        questions: 30,
        date: "2023-12-20",
        status: "Disponible",
        difficulty: 80,
      },
      {
        id: "estadistica",
        title: "Estadística y Probabilidad",
        professor: "Dr. Carlos Ruiz",
        duration: "100 min",
        questions: 35,
        date: "2023-12-08",
        status: "Disponible",
        difficulty: 70,
      },
    ],
  },
  {
    id: "humanidades",
    name: "Humanidades",
    icon: BookMarked,
    exams: [
      {
        id: "historia-universal",
        title: "Historia Universal Contemporánea",
        professor: "Dra. Ana Rodríguez",
        duration: "90 min",
        questions: 40,
        date: "2023-12-13",
        status: "Disponible",
        difficulty: 60,
      },
      {
        id: "filosofia",
        title: "Filosofía Moderna",
        professor: "Dr. Eduardo Torres",
        duration: "80 min",
        questions: 25,
        date: "2023-12-19",
        status: "Disponible",
        difficulty: 65,
      },
      {
        id: "literatura",
        title: "Literatura Latinoamericana",
        professor: "Dra. Carmen Vega",
        duration: "100 min",
        questions: 30,
        date: "2023-12-07",
        status: "Disponible",
        difficulty: 55,
      },
    ],
  },
  {
    id: "ingenieria",
    name: "Ingeniería",
    icon: Code,
    exams: [
      {
        id: "programacion",
        title: "Programación Orientada a Objetos",
        professor: "Dr. Miguel Ángel López",
        duration: "120 min",
        questions: 30,
        date: "2023-12-16",
        status: "Disponible",
        difficulty: 75,
      },
      {
        id: "estructuras",
        title: "Análisis de Estructuras",
        professor: "Dra. Sofía Mendoza",
        duration: "100 min",
        questions: 25,
        date: "2023-12-21",
        status: "Disponible",
        difficulty: 85,
      },
      {
        id: "circuitos",
        title: "Circuitos Eléctricos",
        professor: "Dr. Roberto Díaz",
        duration: "90 min",
        questions: 35,
        date: "2023-12-09",
        status: "Disponible",
        difficulty: 80,
      },
    ],
  },
  {
    id: "medicina",
    name: "Medicina",
    icon: Stethoscope,
    exams: [
      {
        id: "anatomia",
        title: "Anatomía Humana",
        professor: "Dr. Fernando Gutiérrez",
        duration: "120 min",
        questions: 50,
        date: "2023-12-17",
        status: "Disponible",
        difficulty: 90,
      },
      {
        id: "fisiologia",
        title: "Fisiología Médica",
        professor: "Dra. Patricia Herrera",
        duration: "110 min",
        questions: 45,
        date: "2023-12-22",
        status: "Disponible",
        difficulty: 85,
      },
      {
        id: "farmacologia",
        title: "Farmacología Básica",
        professor: "Dr. Alejandro Morales",
        duration: "100 min",
        questions: 40,
        date: "2023-12-11",
        status: "Disponible",
        difficulty: 80,
      },
    ],
  },
]

// Función para determinar el color según la dificultad
const getDifficultyColor = (difficulty) => {
  if (difficulty < 60) return "#4AE54A" // Verde para dificultad baja
  if (difficulty < 80) return "#FFBB28" // Amarillo para dificultad media
  return "#FF4D4F" // Rojo para dificultad alta
}

// Configuración de animaciones
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (custom) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
}

export function TimedPractice() {
  const [selectedArea, setSelectedArea] = useState("ciencias")
  const [showNotification, setShowNotification] = useState(false)
  const [activeExam, setActiveExam] = useState(null)
  const [examResults, setExamResults] = useState(null)

  const handleStartExam = (exam) => {
    // Mapear el ID del área a la clave en el objeto examData
    const areaMap = {
      ciencias: "ciencias",
      matematicas: "matematicas",
      humanidades: "humanidades",
      ingenieria: "ingenieria",
      medicina: "medicina",
    }

    // Obtener el área actual
    const currentArea = examAreas.find((area) => area.id === selectedArea)
    if (!currentArea) return

    // Buscar el examen seleccionado
    const selectedExam = currentArea.exams.find((e) => e.id === exam.id)
    if (!selectedExam) return

    // Verificar si el examen está disponible
    if (selectedExam.status === "Disponible") {
      // Obtener preguntas para el examen
      const questions = getRandomQuestions(areaMap[selectedArea], selectedExam.title, 20)

      if (questions.length > 0) {
        setActiveExam({
          ...selectedExam,
          area: currentArea.name,
          questions,
        })
      } else {
        // Si no hay preguntas disponibles, mostrar notificación
        setShowNotification(true)
        setTimeout(() => {
          setShowNotification(false)
        }, 3000)
      }
    } else {
      // Si el examen no está disponible, mostrar notificación
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    }
  }

  const handleCompleteExam = (score, answers) => {
    setExamResults({
      score,
      answers,
      examTitle: activeExam.title,
      area: activeExam.area,
      date: new Date().toISOString(),
    })
  }

  const handleCancelExam = () => {
    setActiveExam(null)
    setExamResults(null)
  }

  // Si hay un examen activo, mostrar la interfaz del quiz
  if (activeExam) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
      >
        <QuizInterface
          title={activeExam.title}
          area={activeExam.area}
          subtopic={activeExam.title}
          questions={activeExam.questions}
          duration={Number.parseInt(activeExam.duration)}
          onComplete={handleCompleteExam}
          onCancel={handleCancelExam}
        />
      </motion.div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">SkillMeter - Evaluación de Habilidades</h1>

      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-[#171a4a] border border-[#2f2c79] p-4 rounded-lg shadow-lg z-50 max-w-md"
        >
          <div className="flex items-start gap-3">
            <Info className="text-[#7f00b2] h-5 w-5 mt-0.5" />
            <div>
              <h3 className="font-medium text-white mb-1">Función en desarrollo</h3>
              <p className="text-sm text-gray-300">
                La función de exámenes estará disponible próximamente. Estamos trabajando para ofrecerte la mejor
                experiencia de evaluación.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <Tabs value={selectedArea} onValueChange={setSelectedArea} className="w-full">
        <TabsList className="mb-6 flex flex-wrap justify-start gap-2 bg-transparent">
          {examAreas.map((area) => (
            <TabsTrigger
              key={area.id}
              value={area.id}
              className="flex items-center gap-2 text-gray-400 data-[state=active]:bg-transparent data-[state=active]:text-[#8884D8]"
            >
              <area.icon className="w-4 h-4" />
              {area.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          {examAreas.map(
            (area) =>
              area.id === selectedArea && (
                <motion.div key={area.id} variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                  <TabsContent key={area.id} value={area.id} className="mt-0" forceMount>
                    <div className="grid gap-6">
                      {area.exams.map((exam, index) => (
                        <motion.div
                          key={exam.id}
                          custom={index}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Card
                            key={exam.id}
                            className="bg-[#141414] border-[#2a2a2a] hover:border-[#8884D8] transition-colors"
                          >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                              <div>
                                <CardTitle className="text-lg font-medium text-white">{exam.title}</CardTitle>
                                <p className="text-sm text-gray-400">Profesor: {exam.professor}</p>
                              </div>
                              <Badge variant={exam.status === "Disponible" ? "default" : "secondary"} className="ml-2">
                                {exam.status}
                              </Badge>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-400">Duración: {exam.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-400">Preguntas: {exam.questions}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-400">Fecha: {exam.date}</span>
                                </div>
                              </div>
                              <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-400">Dificultad</span>
                                  <span
                                    className="text-gray-400"
                                    style={{ color: getDifficultyColor(exam.difficulty) }}
                                  >
                                    {exam.difficulty}%
                                  </span>
                                </div>
                                <Progress
                                  value={exam.difficulty}
                                  className="w-full"
                                  color={getDifficultyColor(exam.difficulty)}
                                />
                              </div>
                              <div className="flex justify-end">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    className="bg-[#8884D8] hover:bg-[#8884D8]/80 text-white transition-colors duration-300"
                                    onClick={() => handleStartExam(exam)}
                                  >
                                    {exam.status === "Disponible" ? "Iniciar Evaluación" : "No Disponible"}
                                  </Button>
                                </motion.div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
