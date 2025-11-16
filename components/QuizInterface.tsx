"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, ArrowLeft, ArrowRight, X, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

// Definición de tipos
type Option = {
  id: string
  text?: string
  image?: string
}

type Question = {
  id: number
  text: string
  options: Option[]
  correctAnswer: string
  type?: "multiple-choice" | "image-matrix" | "input-text" | "yes-no"
  stimulus?: string | string[]
  formula?: string
}

type QuizProps = {
  title: string
  area: string
  subtopic: string
  questions: Question[]
  duration: number // en minutos
  onComplete: (score: number, answers: Record<number, string>) => void
  onCancel: () => void
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

const questionVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
}

const optionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
}

const resultVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
}

const resultItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export function QuizInterface({ title, area, subtopic, questions, duration, onComplete, onCancel }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(duration * 60) // en segundos
  const [isFinished, setIsFinished] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [direction, setDirection] = useState(0) // -1 para atrás, 1 para adelante

  // Estados para preguntas interactivas
  const [stimulusVisible, setStimulusVisible] = useState(true)
  const [textInputValue, setTextInputValue] = useState("")

  // Manejar el temporizador
  useEffect(() => {
    if (isFinished || showResults) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinishQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isFinished, showResults])

  // Efecto para manejar estímulos con temporizador
  useEffect(() => {
    const question = questions[currentQuestionIndex]
    if (
      (question?.type === "input-text" || question?.type === "image-matrix") &&
      question.stimulus &&
      (question.skill === "memoria-trabajo" || question.skill === "memoria-visual")
    ) {
      setStimulusVisible(true)
      const timer = setTimeout(() => {
        setStimulusVisible(false)
      }, 5000) // Ocultar después de 5 segundos

      return () => clearTimeout(timer)
    } else {
      setStimulusVisible(true)
    }
    setTextInputValue(selectedAnswers[question.id] || "")
  }, [currentQuestionIndex, questions])

  // Formatear el tiempo restante
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calcular el progreso
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Manejar la selección de respuesta
  const handleSelectAnswer = (questionId: number, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  // Manejar cambio en input de texto
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInputValue(e.target.value)
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: e.target.value,
    }))
  }

  // Navegar a la siguiente pregunta
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1)
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  // Navegar a la pregunta anterior
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1)
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  // Finalizar el quiz
  const handleFinishQuiz = () => {
    setIsFinished(true)
    setShowConfirmation(true)
  }

  // Confirmar finalización y calcular puntuación
  const confirmFinish = () => {
    setIsSubmitting(true)

    // Calcular puntuación
    let correctAnswers = 0
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / questions.length) * 100)
    setScore(finalScore)

    // Mostrar resultados
    setTimeout(() => {
      setShowConfirmation(false)
      setShowResults(true)
      setIsSubmitting(false)
      onComplete(finalScore, selectedAnswers)
    }, 1000)
  }

  // Obtener la pregunta actual
  const currentQuestion = questions[currentQuestionIndex]

  // Renderizar los resultados
  if (showResults) {
    return (
      <motion.div variants={resultVariants} initial="hidden" animate="visible" className="w-full max-w-4xl mx-auto">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Resultados del Examen</CardTitle>
            <CardDescription>
              {title} - {area}: {subtopic}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              variants={resultItemVariants}
              className="flex flex-col items-center justify-center p-6 bg-[#171a4a] rounded-lg"
            >
              <div className="text-6xl font-bold mb-2">{score}%</div>
              <div className="text-lg text-gray-300">{score >= 70 ? "¡Excelente trabajo!" : "Sigue practicando"}</div>
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Resumen:</h3>
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={resultItemVariants} className="p-4 bg-[#171a4a] rounded-lg">
                  <div className="text-sm text-gray-400">Preguntas totales</div>
                  <div className="text-2xl font-bold">{questions.length}</div>
                </motion.div>
                <motion.div variants={resultItemVariants} className="p-4 bg-[#171a4a] rounded-lg">
                  <div className="text-sm text-gray-400">Respuestas correctas</div>
                  <div className="text-2xl font-bold text-green-500">
                    {questions.filter((q) => selectedAnswers[q.id] === q.correctAnswer).length}
                  </div>
                </motion.div>
                <motion.div variants={resultItemVariants} className="p-4 bg-[#171a4a] rounded-lg">
                  <div className="text-sm text-gray-400">Respuestas incorrectas</div>
                  <div className="text-2xl font-bold text-red-500">
                    {questions.filter((q) => selectedAnswers[q.id] && selectedAnswers[q.id] !== q.correctAnswer).length}
                  </div>
                </motion.div>
                <motion.div variants={resultItemVariants} className="p-4 bg-[#171a4a] rounded-lg">
                  <div className="text-sm text-gray-400">Sin responder</div>
                  <div className="text-2xl font-bold text-yellow-500">
                    {questions.filter((q) => !selectedAnswers[q.id]).length}
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div variants={resultItemVariants} className="flex justify-center pt-4">
              <Button onClick={onCancel} className="w-full max-w-xs">
                Volver a los exámenes
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Diálogo de confirmación para finalizar
  if (showConfirmation) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>¿Finalizar examen?</CardTitle>
            <CardDescription>
              {isSubmitting ? "Enviando respuestas..." : "¿Estás seguro de que deseas finalizar el examen?"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitting ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7f00b2]"></div>
              </div>
            ) : (
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowConfirmation(false)} disabled={isSubmitting}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Continuar examen
                </Button>
                <Button onClick={confirmFinish} disabled={isSubmitting}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Finalizar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-4xl mx-auto"
    >
      {/* Cabecera con información del examen */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-gray-400">
            {area}: {subtopic}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
            <Clock className="h-4 w-4" />
            {formatTime(timeRemaining)}
          </Badge>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4 mr-1" /> Salir
          </Button>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Progreso</span>
          <span>
            {currentQuestionIndex + 1} de {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Pregunta actual */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQuestionIndex}
          custom={direction}
          variants={questionVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-start gap-2">
                <span className="bg-[#7f00b2] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {currentQuestionIndex + 1}
                </span>
                <span>{currentQuestion.text}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Estímulo (si existe) */}
              {currentQuestion.stimulus && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-4 bg-black/20 rounded-lg text-center"
                >
                  {stimulusVisible ? (
                    Array.isArray(currentQuestion.stimulus) ? (
                      <p className="text-lg font-mono tracking-widest">{currentQuestion.stimulus.join(" ")}</p>
                    ) : (
                      <Image
                        src={currentQuestion.stimulus}
                        alt="Estímulo visual"
                        width={400}
                        height={200}
                        className="mx-auto rounded-md"
                      />
                    )
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <EyeOff className="h-5 w-5" />
                      <span>El estímulo ha sido ocultado.</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Renderizado condicional de tipos de pregunta */}
              {currentQuestion.type === "input-text" && (
                <Input
                  type="text"
                  placeholder="Escribe tu respuesta aquí..."
                  value={textInputValue}
                  onChange={handleInputChange}
                  className="text-lg"
                  disabled={!stimulusVisible && currentQuestion.skill.includes("memoria")}
                />
              )}

              {(currentQuestion.type === "multiple-choice" || !currentQuestion.type) && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <motion.div
                      key={option.id}
                      variants={optionVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                        selectedAnswers[currentQuestion.id] === option.id
                          ? "border-[#7f00b2] bg-[#7f00b2]/10"
                          : "border-[#2f2c79] bg-[#171a4a] hover:border-[#7f00b2]/50"
                      }`}
                      onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                            selectedAnswers[currentQuestion.id] === option.id
                              ? "border-[#7f00b2] bg-[#7f00b2] text-white"
                              : "border-gray-400"
                          }`}
                        >
                          {option.id}
                        </div>
                        <div className="text-sm">{option.text}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {currentQuestion.type === "image-matrix" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentQuestion.options.map((option) => (
                    <motion.div
                      key={option.id}
                      variants={optionVariants}
                      initial="hidden"
                      animate="visible"
                      className={`p-2 rounded-lg border-2 transition-colors cursor-pointer ${
                        selectedAnswers[currentQuestion.id] === option.id
                          ? "border-[#7f00b2] bg-[#7f00b2]/10"
                          : "border-transparent hover:border-[#7f00b2]/50"
                      }`}
                      onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                    >
                      <Image
                        src={option.image || ""}
                        alt={`Opción ${option.id}`}
                        width={150}
                        height={150}
                        className="w-full h-auto rounded-md"
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {currentQuestion.type === "yes-no" && (
                <div className="flex justify-center gap-4">
                  <Button
                    variant={selectedAnswers[currentQuestion.id] === "Sí" ? "default" : "outline"}
                    onClick={() => handleSelectAnswer(currentQuestion.id, "Sí")}
                  >
                    Sí
                  </Button>
                  <Button
                    variant={selectedAnswers[currentQuestion.id] === "No" ? "default" : "outline"}
                    onClick={() => handleSelectAnswer(currentQuestion.id, "No")}
                  >
                    No
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navegación entre preguntas */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          as={motion.button}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>

        {currentQuestionIndex < questions.length - 1 ? (
          <Button
            onClick={handleNextQuestion}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            as={motion.button}
          >
            Siguiente <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleFinishQuiz} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} as={motion.button}>
            Finalizar <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navegación rápida a preguntas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8"
      >
        <h3 className="text-sm font-medium mb-2">Navegación rápida:</h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((question, index) => (
            <motion.button
              key={question.id}
              onClick={() => {
                setDirection(index > currentQuestionIndex ? 1 : -1)
                setCurrentQuestionIndex(index)
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                index === currentQuestionIndex
                  ? "bg-[#7f00b2] text-white"
                  : selectedAnswers[question.id]
                    ? "bg-[#7f00b2]/20 text-white"
                    : "bg-[#171a4a] text-gray-300 hover:bg-[#2f2c79]"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {index + 1}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
