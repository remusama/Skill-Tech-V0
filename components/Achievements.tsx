"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Award,
  MessageSquare,
  Calculator,
  FlaskRoundIcon as Flask,
  Cpu,
  Music,
  Activity,
  Theater,
  CheckCircle,
  Lock,
} from "lucide-react"

// Tipos para los logros
type Achievement = {
  id: string
  title: string
  description: string
  level: number
  maxLevel: number
  unlocked: boolean
  icon: React.ElementType
}

// Tipo para las categorías de habilidades
type SkillCategory = {
  id: string
  name: string
  icon: React.ElementType
  color: string
  achievements: Achievement[]
}

// Datos de habilidades académicas
const academicSkills: SkillCategory[] = [
  {
    id: "communication",
    name: "Comunicación",
    icon: MessageSquare,
    color: "#FF8042",
    achievements: [
      {
        id: "clear-voice",
        title: "Voz Clara",
        description: "Comunicas ideas con claridad y precisión",
        level: 8,
        maxLevel: 10,
        unlocked: true,
        icon: MessageSquare,
      },
      {
        id: "internal-narrator",
        title: "Narrador Interno",
        description: "Desarrollas un estilo narrativo propio",
        level: 6,
        maxLevel: 10,
        unlocked: true,
        icon: MessageSquare,
      },
      {
        id: "ideas-bridge",
        title: "Puente de Ideas",
        description: "Conectas conceptos complejos de forma accesible",
        level: 4,
        maxLevel: 10,
        unlocked: true,
        icon: MessageSquare,
      },
      {
        id: "speaker-training",
        title: "Orador en Formación",
        description: "Presentas ante grupos con confianza creciente",
        level: 3,
        maxLevel: 10,
        unlocked: false,
        icon: MessageSquare,
      },
      {
        id: "active-listening",
        title: "Escucha Activa",
        description: "Comprendes y respondes efectivamente a otros",
        level: 7,
        maxLevel: 10,
        unlocked: true,
        icon: MessageSquare,
      },
    ],
  },
  {
    id: "math",
    name: "Matemática",
    icon: Calculator,
    color: "#0088FE",
    achievements: [
      {
        id: "logical-mind",
        title: "Mente Lógica",
        description: "Resuelves problemas con pensamiento estructurado",
        level: 9,
        maxLevel: 10,
        unlocked: true,
        icon: Calculator,
      },
      {
        id: "number-architect",
        title: "Arquitecto de Números",
        description: "Construyes soluciones matemáticas elegantes",
        level: 7,
        maxLevel: 10,
        unlocked: true,
        icon: Calculator,
      },
      {
        id: "challenge-solved",
        title: "Desafío Resuelto",
        description: "Superas problemas matemáticos complejos",
        level: 5,
        maxLevel: 10,
        unlocked: true,
        icon: Calculator,
      },
      {
        id: "analytical-vision",
        title: "Visión Analítica",
        description: "Analizas datos y patrones con precisión",
        level: 6,
        maxLevel: 10,
        unlocked: true,
        icon: Calculator,
      },
      {
        id: "method-master",
        title: "Maestro del Método",
        description: "Dominas técnicas matemáticas avanzadas",
        level: 2,
        maxLevel: 10,
        unlocked: false,
        icon: Calculator,
      },
    ],
  },
  {
    id: "science",
    name: "Ciencia",
    icon: Flask,
    color: "#00C49F",
    achievements: [
      {
        id: "natural-curious",
        title: "Curioso Natural",
        description: "Exploras el mundo con preguntas constantes",
        level: 8,
        maxLevel: 10,
        unlocked: true,
        icon: Flask,
      },
      {
        id: "empirical-explorer",
        title: "Explorador Empírico",
        description: "Realizas experimentos para probar teorías",
        level: 6,
        maxLevel: 10,
        unlocked: true,
        icon: Flask,
      },
      {
        id: "deduction-light",
        title: "Luz de la Deducción",
        description: "Extraes conclusiones lógicas de observaciones",
        level: 5,
        maxLevel: 10,
        unlocked: true,
        icon: Flask,
      },
      {
        id: "scientific-mentor",
        title: "Mentor Científico",
        description: "Compartes conocimiento científico con otros",
        level: 3,
        maxLevel: 10,
        unlocked: false,
        icon: Flask,
      },
      {
        id: "hypothesis-builder",
        title: "Constructor de Hipótesis",
        description: "Formulas teorías basadas en evidencia",
        level: 4,
        maxLevel: 10,
        unlocked: true,
        icon: Flask,
      },
    ],
  },
  {
    id: "technology",
    name: "Tecnología",
    icon: Cpu,
    color: "#FFBB28",
    achievements: [
      {
        id: "digital-apprentice",
        title: "Aprendiz Digital",
        description: "Adoptas nuevas tecnologías con facilidad",
        level: 9,
        maxLevel: 10,
        unlocked: true,
        icon: Cpu,
      },
      {
        id: "code-creator",
        title: "Creador de Código",
        description: "Programas soluciones funcionales",
        level: 7,
        maxLevel: 10,
        unlocked: true,
        icon: Cpu,
      },
      {
        id: "practical-innovator",
        title: "Innovador Práctico",
        description: "Aplicas tecnología para resolver problemas reales",
        level: 6,
        maxLevel: 10,
        unlocked: true,
        icon: Cpu,
      },
      {
        id: "engineer-process",
        title: "Ingeniero en Proceso",
        description: "Diseñas sistemas tecnológicos complejos",
        level: 4,
        maxLevel: 10,
        unlocked: false,
        icon: Cpu,
      },
      {
        id: "computational-thinker",
        title: "Pensador Computacional",
        description: "Descompones problemas en pasos lógicos",
        level: 8,
        maxLevel: 10,
        unlocked: true,
        icon: Cpu,
      },
    ],
  },
]

// Datos de habilidades personales
const personalSkills: SkillCategory[] = [
  {
    id: "music",
    name: "Música",
    icon: Music,
    color: "#FF00FF",
    achievements: [
      {
        id: "open-ear",
        title: "Oído Abierto",
        description: "Aprecias diversos géneros y estilos musicales",
        level: 7,
        maxLevel: 10,
        unlocked: true,
        icon: Music,
      },
      {
        id: "sound-interpreter",
        title: "Intérprete del Sonido",
        description: "Tocas un instrumento con técnica creciente",
        level: 5,
        maxLevel: 10,
        unlocked: true,
        icon: Music,
      },
      {
        id: "rhythmic-soul",
        title: "Alma Rítmica",
        description: "Mantienes el ritmo y tempo con precisión",
        level: 6,
        maxLevel: 10,
        unlocked: true,
        icon: Music,
      },
      {
        id: "harmonic-voice",
        title: "Voz en Armonía",
        description: "Cantas con afinación y expresividad",
        level: 3,
        maxLevel: 10,
        unlocked: false,
        icon: Music,
      },
      {
        id: "sound-creator",
        title: "Creador Sonoro",
        description: "Compones piezas musicales originales",
        level: 2,
        maxLevel: 10,
        unlocked: false,
        icon: Music,
      },
    ],
  },
  {
    id: "sports",
    name: "Deporte",
    icon: Activity,
    color: "#8884D8",
    achievements: [
      {
        id: "body-movement",
        title: "Cuerpo en Movimiento",
        description: "Mantienes actividad física regular",
        level: 8,
        maxLevel: 10,
        unlocked: true,
        icon: Activity,
      },
      {
        id: "disciplined-energy",
        title: "Energía Disciplinada",
        description: "Entrenas con constancia y método",
        level: 6,
        maxLevel: 10,
        unlocked: true,
        icon: Activity,
      },
      {
        id: "team-spirit",
        title: "Espíritu de Equipo",
        description: "Colaboras efectivamente en deportes grupales",
        level: 7,
        maxLevel: 10,
        unlocked: true,
        icon: Activity,
      },
      {
        id: "limit-surpasser",
        title: "Superador de Límites",
        description: "Superas marcas personales con perseverancia",
        level: 5,
        maxLevel: 10,
        unlocked: true,
        icon: Activity,
      },
      {
        id: "developing-athlete",
        title: "Atleta en Desarrollo",
        description: "Perfeccionas técnicas deportivas específicas",
        level: 3,
        maxLevel: 10,
        unlocked: false,
        icon: Activity,
      },
    ],
  },
  {
    id: "acting",
    name: "Actuación",
    icon: Theater,
    color: "#82CA9D",
    achievements: [
      {
        id: "stage-presence",
        title: "Presencia Escénica",
        description: "Proyectas confianza ante el público",
        level: 4,
        maxLevel: 10,
        unlocked: true,
        icon: Theater,
      },
      {
        id: "living-narrator",
        title: "Narrador Viviente",
        description: "Cuentas historias con expresividad",
        level: 5,
        maxLevel: 10,
        unlocked: true,
        icon: Theater,
      },
      {
        id: "emotion-movement",
        title: "Emoción en Movimiento",
        description: "Expresas sentimientos a través del cuerpo",
        level: 3,
        maxLevel: 10,
        unlocked: false,
        icon: Theater,
      },
      {
        id: "intentional-voice",
        title: "Voz con Intención",
        description: "Modulas tu voz para transmitir emociones",
        level: 4,
        maxLevel: 10,
        unlocked: true,
        icon: Theater,
      },
      {
        id: "character-creator",
        title: "Creador de Personajes",
        description: "Desarrollas personajes complejos y creíbles",
        level: 2,
        maxLevel: 10,
        unlocked: false,
        icon: Theater,
      },
    ],
  },
]

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

const achievementVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.05,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
}

export function Achievements() {
  const [activeTab, setActiveTab] = useState("academic")

  // Función para determinar el color según el nivel
  const getLevelColor = (level: number, maxLevel: number) => {
    const percentage = (level / maxLevel) * 100
    if (percentage <= 30) return "bg-red-500"
    if (percentage <= 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Logros</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-[#1a1a1a]">
          <TabsTrigger
            value="academic"
            className="data-[state=active]:bg-transparent data-[state=active]:text-[#8884D8]"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Habilidades Académicas
          </TabsTrigger>
          <TabsTrigger
            value="personal"
            className="data-[state=active]:bg-transparent data-[state=active]:text-[#8884D8]"
          >
            <Award className="w-4 h-4 mr-2" />
            Habilidades Personales
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {/* Pestaña de Habilidades Académicas */}
          {activeTab === "academic" && (
            <motion.div key="academic" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <TabsContent value="academic" forceMount>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {academicSkills.map((category, categoryIndex) => (
                    <motion.div
                      key={category.id}
                      variants={cardVariants}
                      custom={categoryIndex}
                      initial="hidden"
                      animate="visible"
                    >
                      <Card className="overflow-hidden border-t-4" style={{ borderTopColor: category.color }}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <category.icon className="w-5 h-5" style={{ color: category.color }} />
                            <CardTitle>{category.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {category.achievements.map((achievement, achievementIndex) => (
                              <motion.div
                                key={achievement.id}
                                variants={achievementVariants}
                                custom={achievementIndex}
                                initial="hidden"
                                animate="visible"
                                className={`p-3 rounded-lg ${
                                  achievement.unlocked ? "bg-[#1a1a1a]" : "bg-[#1a1a1a]/50"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`rounded-full p-2 ${
                                      achievement.unlocked ? "bg-[#2a2a2a]" : "bg-[#2a2a2a]/50"
                                    }`}
                                  >
                                    {achievement.unlocked ? (
                                      <CheckCircle className="w-4 h-4 text-[#4AE54A]" />
                                    ) : (
                                      <Lock className="w-4 h-4 text-gray-500" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3
                                          className={`font-semibold ${
                                            achievement.unlocked ? "text-white" : "text-gray-500"
                                          }`}
                                        >
                                          {achievement.title}
                                        </h3>
                                        <p
                                          className={`text-xs ${
                                            achievement.unlocked ? "text-gray-400" : "text-gray-600"
                                          }`}
                                        >
                                          {achievement.description}
                                        </p>
                                      </div>
                                      {achievement.unlocked && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                          style={{ borderColor: category.color, color: category.color }}
                                        >
                                          Nivel {achievement.level}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="mt-2">
                                      <div className="flex justify-between text-xs mb-1">
                                        <span className={`${achievement.unlocked ? "text-gray-400" : "text-gray-600"}`}>
                                          Progreso
                                        </span>
                                        <span className={`${achievement.unlocked ? "text-gray-400" : "text-gray-600"}`}>
                                          {achievement.level}/{achievement.maxLevel}
                                        </span>
                                      </div>
                                      <div className="w-full bg-[#2a2a2a] h-1.5 rounded-full overflow-hidden">
                                        <motion.div
                                          className={`h-full ${
                                            achievement.unlocked
                                              ? getLevelColor(achievement.level, achievement.maxLevel)
                                              : "bg-gray-700"
                                          }`}
                                          initial={{ width: 0 }}
                                          animate={{
                                            width: `${(achievement.level / achievement.maxLevel) * 100}%`,
                                          }}
                                          transition={{ duration: 0.8, delay: 0.2 + achievementIndex * 0.1 }}
                                        ></motion.div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </motion.div>
          )}

          {/* Pestaña de Habilidades Personales */}
          {activeTab === "personal" && (
            <motion.div key="personal" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <TabsContent value="personal" forceMount>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {personalSkills.map((category, categoryIndex) => (
                    <motion.div
                      key={category.id}
                      variants={cardVariants}
                      custom={categoryIndex}
                      initial="hidden"
                      animate="visible"
                    >
                      <Card className="overflow-hidden border-t-4" style={{ borderTopColor: category.color }}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <category.icon className="w-5 h-5" style={{ color: category.color }} />
                            <CardTitle>{category.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {category.achievements.map((achievement, achievementIndex) => (
                              <motion.div
                                key={achievement.id}
                                variants={achievementVariants}
                                custom={achievementIndex}
                                initial="hidden"
                                animate="visible"
                                className={`p-3 rounded-lg ${
                                  achievement.unlocked ? "bg-[#1a1a1a]" : "bg-[#1a1a1a]/50"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`rounded-full p-2 ${
                                      achievement.unlocked ? "bg-[#2a2a2a]" : "bg-[#2a2a2a]/50"
                                    }`}
                                  >
                                    {achievement.unlocked ? (
                                      <CheckCircle className="w-4 h-4 text-[#4AE54A]" />
                                    ) : (
                                      <Lock className="w-4 h-4 text-gray-500" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3
                                          className={`font-semibold ${
                                            achievement.unlocked ? "text-white" : "text-gray-500"
                                          }`}
                                        >
                                          {achievement.title}
                                        </h3>
                                        <p
                                          className={`text-xs ${
                                            achievement.unlocked ? "text-gray-400" : "text-gray-600"
                                          }`}
                                        >
                                          {achievement.description}
                                        </p>
                                      </div>
                                      {achievement.unlocked && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                          style={{ borderColor: category.color, color: category.color }}
                                        >
                                          Nivel {achievement.level}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="mt-2">
                                      <div className="flex justify-between text-xs mb-1">
                                        <span className={`${achievement.unlocked ? "text-gray-400" : "text-gray-600"}`}>
                                          Progreso
                                        </span>
                                        <span className={`${achievement.unlocked ? "text-gray-400" : "text-gray-600"}`}>
                                          {achievement.level}/{achievement.maxLevel}
                                        </span>
                                      </div>
                                      <div className="w-full bg-[#2a2a2a] h-1.5 rounded-full overflow-hidden">
                                        <motion.div
                                          className={`h-full ${
                                            achievement.unlocked
                                              ? getLevelColor(achievement.level, achievement.maxLevel)
                                              : "bg-gray-700"
                                          }`}
                                          initial={{ width: 0 }}
                                          animate={{
                                            width: `${(achievement.level / achievement.maxLevel) * 100}%`,
                                          }}
                                          transition={{ duration: 0.8, delay: 0.2 + achievementIndex * 0.1 }}
                                        ></motion.div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
