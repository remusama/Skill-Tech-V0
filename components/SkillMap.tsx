"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Pie,
  PieChart,
  Cell,
} from "recharts"
import { BarChart2, PieChartIcon, Activity, LineChartIcon, RefreshCw } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

// Datos para el gráfico de matriz (radar)
const academicSkillsData = [
  { subject: "Comunicación", A: 7, fullMark: 10 },
  { subject: "Matemática", A: 8, fullMark: 10 },
  { subject: "Ciencia", A: 6, fullMark: 10 },
  { subject: "Tecnología", A: 9, fullMark: 10 },
  { subject: "Pensamiento Crítico", A: 7, fullMark: 10 },
  { subject: "Resolución de Problemas", A: 8, fullMark: 10 },
]

const personalSkillsData = [
  { subject: "Música", A: 5, fullMark: 10 },
  { subject: "Deporte", A: 4, fullMark: 10 },
  { subject: "Actuación", A: 3, fullMark: 10 },
  { subject: "Liderazgo", A: 6, fullMark: 10 },
  { subject: "Trabajo en Equipo", A: 8, fullMark: 10 },
  { subject: "Creatividad", A: 7, fullMark: 10 },
]

// Datos para el gráfico de barras de progreso
const progressData = [
  { name: "Ene", Comunicación: 3, Matemática: 5, Ciencia: 2, Tecnología: 4 },
  { name: "Feb", Comunicación: 4, Matemática: 5, Ciencia: 3, Tecnología: 5 },
  { name: "Mar", Comunicación: 5, Matemática: 6, Ciencia: 4, Tecnología: 6 },
  { name: "Abr", Comunicación: 5, Matemática: 7, Ciencia: 4, Tecnología: 7 },
  { name: "May", Comunicación: 6, Matemática: 7, Ciencia: 5, Tecnología: 8 },
  { name: "Jun", Comunicación: 7, Matemática: 8, Ciencia: 6, Tecnología: 9 },
]

// Datos para el gráfico de barras de comparación
const comparisonData = [
  { name: "Comunicación", Nivel: 7, "Promedio Clase": 5.5 },
  { name: "Matemática", Nivel: 8, "Promedio Clase": 6.2 },
  { name: "Ciencia", Nivel: 6, "Promedio Clase": 5.8 },
  { name: "Tecnología", Nivel: 9, "Promedio Clase": 7.1 },
  { name: "Música", Nivel: 5, "Promedio Clase": 4.3 },
  { name: "Deporte", Nivel: 4, "Promedio Clase": 6.5 },
]

// Datos para el gráfico de pastel de distribución de tiempo
const timeSpentData = [
  { name: "Comunicación", value: 8 },
  { name: "Matemática", value: 6 },
  { name: "Ciencia", value: 4 },
  { name: "Tecnología", value: 6 },
  { name: "Otras", value: 2 },
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

export function SkillMap() {
  const [activeTab, setActiveTab] = useState("matrix")
  const [mounted, setMounted] = useState(false)
  const [chartsKey, setChartsKey] = useState(0)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const { theme } = useTheme()
  const containerRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      setChartsKey((prev) => prev + 1)
    }, 100)

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      setChartsKey((prev) => prev + 1)
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const getChartColors = useCallback(() => {
    const baseColors = {
      dark: {
        primary: "hsl(272, 100%, 25%)",
        secondary: "hsl(240, 19%, 16%)",
        background: "hsl(240, 33%, 7%)",
        foreground: "hsl(0, 0%, 100%)",
        muted: "hsl(240, 19%, 16%)",
        mutedForeground: "hsl(215, 20.2%, 65.1%)",
        border: "hsl(240, 19%, 26%)",
        accent: "hsl(240, 19%, 16%)",
      },
      light: {
        primary: "hsl(270, 29%, 50%)",
        secondary: "hsl(280, 29%, 74%)",
        background: "hsl(0, 0%, 90%)",
        foreground: "hsl(0, 0%, 24%)",
        muted: "hsl(300, 4%, 65%)",
        mutedForeground: "hsl(0, 0%, 24%)",
        border: "hsl(280, 29%, 74%)",
        accent: "hsl(280, 29%, 74%)",
      },
    }

    const chartPalette = {
      dark: ["#9333EA", "#60A5FA", "#4ADE80", "#F472B6", "#FBBF24", "#34D399", "#A78BFA", "#FB7185"],
      light: ["#7D5AA4", "#5B8AF0", "#4CAF50", "#E57CD8", "#F0B86C", "#26A69A", "#9575CD", "#F06292"],
    }

    const currentTheme = theme === "light" ? "light" : "dark"
    const colors = baseColors[currentTheme]
    const palette = chartPalette[currentTheme]

    return {
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.background,
      foreground: colors.foreground,
      muted: colors.muted,
      mutedForeground: colors.mutedForeground,
      border: colors.border,

      gridLines: theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
      tooltip: {
        background: theme === "light" ? "#FFFFFF" : "#1E1E1E",
        border: theme === "light" ? "#E2E8F0" : "#333333",
        text: theme === "light" ? "#1E293B" : "#E2E8F0",
      },

      palette,

      radar: {
        fill: palette[0],
        stroke: palette[0],
      },
      line: {
        comunicacion: palette[1],
        matematica: palette[0],
        ciencia: palette[2],
        tecnologia: palette[3],
      },
      bar: {
        nivel: palette[0],
        promedio: palette[1],
      },
      pie: palette,

      activeTab:
        theme === "light"
          ? "bg-primary/10 text-primary border-primary"
          : "bg-primary/20 text-primary-foreground border-primary/70",
    }
  }, [theme])

  const colors = getChartColors()

  const forceUpdate = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
    setChartsKey((prev) => prev + 1)
    setMounted(false)
    setTimeout(() => {
      setMounted(true)
    }, 50)
  }, [])

  if (!mounted) {
    return (
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">SkillMap - Visualización de Habilidades</h1>
          <Button variant="outline" size="sm" onClick={forceUpdate} className="flex items-center gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Actualizar Gráficos
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-background border flex flex-wrap">
            <TabsTrigger value="matrix" className="font-medium">
              <Activity className="w-4 h-4 mr-2" />
              Matriz de Habilidades
            </TabsTrigger>
            <TabsTrigger value="progress" className="font-medium">
              <LineChartIcon className="w-4 h-4 mr-2" />
              Progreso Temporal
            </TabsTrigger>
            <TabsTrigger value="comparison" className="font-medium">
              <BarChart2 className="w-4 h-4 mr-2" />
              Comparación
            </TabsTrigger>
            <TabsTrigger value="distribution" className="font-medium">
              <PieChartIcon className="w-4 h-4 mr-2" />
              Distribución de Tiempo
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-md border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Habilidades Académicas</CardTitle>
                <CardDescription>Visualización en matriz de tus habilidades académicas</CardDescription>
              </CardHeader>
              <CardContent className="h-80 pt-4">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary/50" />
                    <p className="text-muted-foreground">Cargando gráficos...</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Habilidades Personales</CardTitle>
                <CardDescription>Visualización en matriz de tus habilidades personales</CardDescription>
              </CardHeader>
              <CardContent className="h-80 pt-4">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary/50" />
                    <p className="text-muted-foreground">Cargando gráficos...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>
    )
  }

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: colors.tooltip.background,
      border: `1px solid ${colors.tooltip.border}`,
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      fontSize: "12px",
      padding: "8px 12px",
      color: colors.tooltip.text,
    },
  }

  return (
    <div className="p-4 md:p-8" ref={containerRef}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">SkillMap - Visualización de Habilidades</h1>
        <Button variant="outline" size="sm" onClick={forceUpdate} className="flex items-center gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Actualizar Gráficos
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-background border flex flex-wrap">
          <TabsTrigger value="matrix" className={`data-[state=active]:${colors.activeTab} font-medium`}>
            <Activity className="w-4 h-4 mr-2" />
            Matriz de Habilidades
          </TabsTrigger>
          <TabsTrigger value="progress" className={`data-[state=active]:${colors.activeTab} font-medium`}>
            <LineChartIcon className="w-4 h-4 mr-2" />
            Progreso Temporal
          </TabsTrigger>
          <TabsTrigger value="comparison" className={`data-[state=active]:${colors.activeTab} font-medium`}>
            <BarChart2 className="w-4 h-4 mr-2" />
            Comparación
          </TabsTrigger>
          <TabsTrigger value="distribution" className={`data-[state=active]:${colors.activeTab} font-medium`}>
            <PieChartIcon className="w-4 h-4 mr-2" />
            Distribución de Tiempo
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "matrix" && (
            <motion.div key="matrix" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <TabsContent value="matrix" className="space-y-6" forceMount>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={cardVariants} custom={0} initial="hidden" animate="visible">
                    <Card className="shadow-md border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Habilidades Académicas</CardTitle>
                        <CardDescription>Visualización en matriz de tus habilidades académicas</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80 pt-4">
                        <div
                          key={`academic-${chartsKey}`}
                          style={{ width: "100%", height: "100%", minHeight: "300px" }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={academicSkillsData}>
                              <PolarGrid stroke={colors.gridLines} />
                              <PolarAngleAxis
                                dataKey="subject"
                                tick={{
                                  fill: colors.foreground,
                                  fontSize: 12,
                                  fontFamily: "inherit",
                                }}
                              />
                              <PolarRadiusAxis
                                angle={30}
                                domain={[0, 10]}
                                tick={{
                                  fill: colors.foreground,
                                  fontSize: 10,
                                  fontFamily: "inherit",
                                }}
                              />
                              <Radar
                                name="Nivel"
                                dataKey="A"
                                stroke={colors.radar.stroke}
                                fill={colors.radar.fill}
                                fillOpacity={0.6}
                              />
                              <Tooltip {...tooltipStyle} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                      <div className="px-6 pb-6">
                        <p className="text-sm text-muted-foreground">
                          Este gráfico muestra tus niveles de competencia en diferentes áreas académicas en una escala
                          de 0 a 10. La forma del polígono indica tus fortalezas y áreas de mejora.
                        </p>
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div variants={cardVariants} custom={1} initial="hidden" animate="visible">
                    <Card className="shadow-md border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Habilidades Personales</CardTitle>
                        <CardDescription>Visualización en matriz de tus habilidades personales</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80 pt-4">
                        <div
                          key={`personal-${chartsKey}`}
                          style={{ width: "100%", height: "100%", minHeight: "300px" }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={personalSkillsData}>
                              <PolarGrid stroke={colors.gridLines} />
                              <PolarAngleAxis
                                dataKey="subject"
                                tick={{
                                  fill: colors.foreground,
                                  fontSize: 12,
                                  fontFamily: "inherit",
                                }}
                              />
                              <PolarRadiusAxis
                                angle={30}
                                domain={[0, 10]}
                                tick={{
                                  fill: colors.foreground,
                                  fontSize: 10,
                                  fontFamily: "inherit",
                                }}
                              />
                              <Radar
                                name="Nivel"
                                dataKey="A"
                                stroke={colors.palette[1]}
                                fill={colors.palette[1]}
                                fillOpacity={0.6}
                              />
                              <Tooltip {...tooltipStyle} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                      <div className="px-6 pb-6">
                        <p className="text-sm text-muted-foreground">
                          Este gráfico muestra tus habilidades personales y sociales. Observa cómo se distribuyen tus
                          capacidades en áreas como liderazgo, trabajo en equipo y creatividad.
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
            </motion.div>
          )}

          {activeTab === "progress" && (
            <motion.div key="progress" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <TabsContent value="progress" forceMount>
                <motion.div variants={cardVariants} custom={0} initial="hidden" animate="visible">
                  <Card className="shadow-md border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Progreso de Habilidades</CardTitle>
                      <CardDescription>Evolución de tus habilidades en los últimos 6 meses</CardDescription>
                    </CardHeader>
                    <CardContent className="h-96 pt-4">
                      <div key={`progress-${chartsKey}`} style={{ width: "100%", height: "100%", minHeight: "350px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={progressData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={colors.gridLines} />
                            <XAxis
                              dataKey="name"
                              stroke={colors.foreground}
                              tick={{
                                fontSize: 12,
                                fontFamily: "inherit",
                              }}
                            />
                            <YAxis
                              domain={[0, 10]}
                              stroke={colors.foreground}
                              tick={{
                                fontSize: 12,
                                fontFamily: "inherit",
                              }}
                            />
                            <Tooltip {...tooltipStyle} />
                            <Legend
                              wrapperStyle={{
                                paddingTop: 20,
                                fontSize: 12,
                                fontFamily: "inherit",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="Comunicación"
                              stroke={colors.line.comunicacion}
                              strokeWidth={2}
                              dot={{ r: 4, fill: colors.line.comunicacion }}
                              activeDot={{ r: 6, fill: colors.line.comunicacion }}
                            />
                            <Line
                              type="monotone"
                              dataKey="Matemática"
                              stroke={colors.line.matematica}
                              strokeWidth={2}
                              dot={{ r: 4, fill: colors.line.matematica }}
                              activeDot={{ r: 6, fill: colors.line.matematica }}
                            />
                            <Line
                              type="monotone"
                              dataKey="Ciencia"
                              stroke={colors.line.ciencia}
                              strokeWidth={2}
                              dot={{ r: 4, fill: colors.line.ciencia }}
                              activeDot={{ r: 6, fill: colors.line.ciencia }}
                            />
                            <Line
                              type="monotone"
                              dataKey="Tecnología"
                              stroke={colors.line.tecnologia}
                              strokeWidth={2}
                              dot={{ r: 4, fill: colors.line.tecnologia }}
                              activeDot={{ r: 6, fill: colors.line.tecnologia }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-6">
                      <p className="text-sm text-muted-foreground">
                        Este gráfico muestra la evolución de tus habilidades principales a lo largo del tiempo. Puedes
                        observar tendencias de mejora e identificar períodos de mayor aprendizaje.
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            </motion.div>
          )}

          {activeTab === "comparison" && (
            <motion.div key="comparison" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <TabsContent value="comparison" forceMount>
                <motion.div variants={cardVariants} custom={0} initial="hidden" animate="visible">
                  <Card className="shadow-md border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Comparación con Promedio de Clase</CardTitle>
                      <CardDescription>Tu nivel vs. el promedio de tus compañeros</CardDescription>
                    </CardHeader>
                    <CardContent className="h-96 pt-4">
                      <div
                        key={`comparison-${chartsKey}`}
                        style={{ width: "100%", height: "100%", minHeight: "350px" }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={colors.gridLines} />
                            <XAxis
                              dataKey="name"
                              stroke={colors.foreground}
                              tick={{
                                fontSize: 12,
                                fontFamily: "inherit",
                              }}
                            />
                            <YAxis
                              domain={[0, 10]}
                              stroke={colors.foreground}
                              tick={{
                                fontSize: 12,
                                fontFamily: "inherit",
                              }}
                            />
                            <Tooltip {...tooltipStyle} />
                            <Legend
                              wrapperStyle={{
                                paddingTop: 20,
                                fontSize: 12,
                                fontFamily: "inherit",
                              }}
                            />
                            <Bar dataKey="Nivel" name="Tu Nivel" fill={colors.bar.nivel} radius={[4, 4, 0, 0]} />
                            <Bar
                              dataKey="Promedio Clase"
                              name="Promedio de Clase"
                              fill={colors.bar.promedio}
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-6">
                      <p className="text-sm text-muted-foreground">
                        Este gráfico compara tu nivel de habilidad con el promedio de tu clase o grupo de referencia. Te
                        permite identificar tus fortalezas relativas y áreas de oportunidad.
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            </motion.div>
          )}

          {activeTab === "distribution" && (
            <motion.div key="distribution" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <TabsContent value="distribution" forceMount>
                <motion.div variants={cardVariants} custom={0} initial="hidden" animate="visible">
                  <Card className="shadow-md border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Distribución de Tiempo por Habilidad</CardTitle>
                      <CardDescription>Horas semanales dedicadas a cada habilidad</CardDescription>
                    </CardHeader>
                    <CardContent className="h-96 pt-4">
                      <div
                        key={`distribution-${chartsKey}`}
                        style={{ width: "100%", height: "100%", minHeight: "350px" }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={timeSpentData}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={150}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {timeSpentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors.palette[index % colors.palette.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} horas`, "Tiempo dedicado"]} {...tooltipStyle} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-6">
                      <p className="text-sm text-muted-foreground">
                        Este gráfico muestra cómo distribuyes tu tiempo de estudio entre diferentes habilidades. Te
                        ayuda a evaluar si estás dedicando suficiente tiempo a las áreas que deseas desarrollar.
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 p-6 bg-card border rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-medium mb-3">Interpretación de Gráficos</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Los gráficos de SkillMap te permiten visualizar tus habilidades desde diferentes perspectivas para ayudarte a
          entender mejor tu desarrollo académico y personal.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background/50 p-3 rounded-md">
            <h4 className="font-medium mb-1 text-primary">Matriz de Habilidades</h4>
            <p className="text-xs text-muted-foreground">
              Muestra la distribución de tus habilidades en forma de radar, permitiéndote identificar áreas fuertes y
              débiles.
            </p>
          </div>
          <div className="bg-background/50 p-3 rounded-md">
            <h4 className="font-medium mb-1 text-primary">Progreso Temporal</h4>
            <p className="text-xs text-muted-foreground">
              Visualiza cómo han evolucionado tus habilidades a lo largo del tiempo, identificando tendencias y
              patrones.
            </p>
          </div>
          <div className="bg-background/50 p-3 rounded-md">
            <h4 className="font-medium mb-1 text-primary">Comparación</h4>
            <p className="text-xs text-muted-foreground">
              Compara tu nivel con el promedio de tu clase o grupo de referencia para identificar fortalezas relativas.
            </p>
          </div>
          <div className="bg-background/50 p-3 rounded-md">
            <h4 className="font-medium mb-1 text-primary">Distribución de Tiempo</h4>
            <p className="text-xs text-muted-foreground">
              Muestra cómo distribuyes tu tiempo entre diferentes habilidades, ayudándote a priorizar tu desarrollo.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
