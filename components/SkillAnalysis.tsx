"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Sector,
} from "recharts"
import { Edit2, Save, BarChart2, PieChartIcon, LineChartIcon, Activity } from "lucide-react"

// Tipos para las habilidades
type Skill = {
  name: string
  level: number
  category: "academic" | "personal"
  editing?: boolean
}

// Datos para el gráfico de progreso a lo largo del tiempo
const progressData = [
  { month: "Ene", Comunicación: 3, Matemática: 5, Ciencia: 2, Tecnología: 4, Música: 2, Deporte: 3, Actuación: 1 },
  { month: "Feb", Comunicación: 4, Matemática: 5, Ciencia: 3, Tecnología: 5, Música: 2, Deporte: 3, Actuación: 2 },
  { month: "Mar", Comunicación: 5, Matemática: 6, Ciencia: 4, Tecnología: 6, Música: 3, Deporte: 4, Actuación: 2 },
  { month: "Abr", Comunicación: 5, Matemática: 7, Ciencia: 4, Tecnología: 7, Música: 3, Deporte: 4, Actuación: 3 },
  { month: "May", Comunicación: 6, Matemática: 7, Ciencia: 5, Tecnología: 8, Música: 4, Deporte: 4, Actuación: 3 },
  { month: "Jun", Comunicación: 7, Matemática: 8, Ciencia: 6, Tecnología: 9, Música: 5, Deporte: 4, Actuación: 3 },
]

// Datos para el gráfico de tiempo dedicado
const timeSpentData = [
  { name: "Comunicación", value: 15, color: "#FF8042" },
  { name: "Matemática", value: 25, color: "#0088FE" },
  { name: "Ciencia", value: 18, color: "#00C49F" },
  { name: "Tecnología", value: 30, color: "#FFBB28" },
  { name: "Música", value: 5, color: "#FF00FF" },
  { name: "Deporte", value: 4, color: "#8884D8" },
  { name: "Actuación", value: 3, color: "#82CA9D" },
]

// Datos para el gráfico de comparación con promedio
const comparisonData = [
  { name: "Comunicación", tuNivel: 7, promedioClase: 5.5 },
  { name: "Matemática", tuNivel: 8, promedioClase: 6.2 },
  { name: "Ciencia", tuNivel: 6, promedioClase: 5.8 },
  { name: "Tecnología", tuNivel: 9, promedioClase: 7.1 },
  { name: "Música", tuNivel: 5, promedioClase: 4.3 },
  { name: "Deporte", tuNivel: 4, promedioClase: 6.5 },
  { name: "Actuación", tuNivel: 3, promedioClase: 3.8 },
]

export function SkillAnalysis() {
  // Estado inicial de habilidades
  const [skills, setSkills] = useState<Skill[]>([
    { name: "Comunicación", level: 7, category: "academic" },
    { name: "Matemática", level: 8, category: "academic" },
    { name: "Ciencia", level: 6, category: "academic" },
    { name: "Tecnología", level: 9, category: "academic" },
    { name: "Música", level: 5, category: "personal" },
    { name: "Deporte", level: 4, category: "personal" },
    { name: "Actuación", level: 3, category: "personal" },
  ])

  // Función para actualizar el nivel de una habilidad
  const updateSkillLevel = (index: number, newLevel: number) => {
    const updatedSkills = [...skills]
    updatedSkills[index].level = newLevel
    setSkills(updatedSkills)
  }

  // Función para activar/desactivar el modo de edición
  const toggleEditing = (index: number) => {
    const updatedSkills = [...skills]
    updatedSkills[index].editing = !updatedSkills[index].editing
    setSkills(updatedSkills)
  }

  // Preparar datos para los gráficos de radar
  const academicSkillsData = skills
    .filter((skill) => skill.category === "academic")
    .map((skill) => ({
      subject: skill.name,
      A: skill.level,
      fullMark: 10,
    }))

  const personalSkillsData = skills
    .filter((skill) => skill.category === "personal")
    .map((skill) => ({
      subject: skill.name,
      A: skill.level,
      fullMark: 10,
    }))

  // Función para determinar el color según el nivel
  const getLevelColor = (level: number) => {
    if (level <= 3) return "text-red-500"
    if (level <= 7) return "text-yellow-500"
    return "text-green-500"
  }

  const getProgressColor = (level: number) => {
    if (level <= 3) return "bg-red-500"
    if (level <= 7) return "bg-yellow-500"
    return "bg-green-500"
  }

  // Renderizado personalizado para el tooltip del gráfico de radar
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#141414] p-2 border border-[#2a2a2a] rounded-md">
          <p className="text-[#4AE54A] font-bold">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-gray-400 text-xs">Máximo: 10</p>
        </div>
      )
    }
    return null
  }

  // Renderizado personalizado para el tooltip del gráfico de línea
  const LineChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#141414] p-3 border border-[#2a2a2a] rounded-md">
          <p className="text-white font-bold mb-1">{`Mes: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Renderizado personalizado para el sector activo del gráfico de pastel
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? "start" : "end"

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#fff" className="text-sm">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.8}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff" className="text-xs">
          {`${value} horas`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    )
  }

  const [activeIndex, setActiveIndex] = useState(0)
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Análisis de Habilidades</h1>

      <Tabs defaultValue="radar" className="w-full">
        <TabsList className="mb-6 bg-[#1a1a1a] flex flex-wrap">
          <TabsTrigger value="radar" className="data-[state=active]:bg-[#60d4ea]/20 data-[state=active]:text-[#60d4ea]">
            <PieChartIcon className="w-4 h-4 mr-2" />
            Gráficos Radar
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="data-[state=active]:bg-[#60d4ea]/20 data-[state=active]:text-[#60d4ea]"
          >
            <LineChartIcon className="w-4 h-4 mr-2" />
            Progreso
          </TabsTrigger>
          <TabsTrigger
            value="comparison"
            className="data-[state=active]:bg-[#60d4ea]/20 data-[state=active]:text-[#60d4ea]"
          >
            <BarChart2 className="w-4 h-4 mr-2" />
            Comparación
          </TabsTrigger>
          <TabsTrigger value="time" className="data-[state=active]:bg-[#60d4ea]/20 data-[state=active]:text-[#60d4ea]">
            <Activity className="w-4 h-4 mr-2" />
            Tiempo Dedicado
          </TabsTrigger>
          <TabsTrigger value="table" className="data-[state=active]:bg-[#60d4ea]/20 data-[state=active]:text-[#60d4ea]">
            <BarChart2 className="w-4 h-4 mr-2" />
            Tabla de Habilidades
          </TabsTrigger>
        </TabsList>

        {/* Pestaña de Gráficos Radar */}
        <TabsContent value="radar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico de Radar para Habilidades Académicas */}
            <Card>
              <CardHeader>
                <CardTitle>Habilidades Académicas</CardTitle>
                <CardDescription>Comunicación, Matemática, Ciencia, Tecnología</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={academicSkillsData}>
                    <PolarGrid stroke="#444" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#ccc" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: "#ccc" }} />
                    <Radar name="Nivel" dataKey="A" stroke="#4AE54A" fill="#4AE54A" fillOpacity={0.6} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Radar para Habilidades Personales */}
            <Card>
              <CardHeader>
                <CardTitle>Habilidades Personales</CardTitle>
                <CardDescription>Música, Deporte, Actuación</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={personalSkillsData}>
                    <PolarGrid stroke="#444" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#ccc" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: "#ccc" }} />
                    <Radar name="Nivel" dataKey="A" stroke="#43E0E0" fill="#43E0E0" fillOpacity={0.6} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña de Progreso */}
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progreso de Habilidades</CardTitle>
              <CardDescription>Evolución de tus habilidades en los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#ccc" />
                  <YAxis domain={[0, 10]} stroke="#ccc" />
                  <Tooltip content={<LineChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  <Line
                    type="monotone"
                    dataKey="Comunicación"
                    stroke="#FF8042"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Matemática"
                    stroke="#0088FE"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Ciencia"
                    stroke="#00C49F"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Tecnología"
                    stroke="#FFBB28"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Música"
                    stroke="#FF00FF"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Deporte"
                    stroke="#8884D8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Actuación"
                    stroke="#82CA9D"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Comparación */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Comparación con Promedio de Clase</CardTitle>
              <CardDescription>Tu nivel vs. el promedio de tus compañeros</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis domain={[0, 10]} stroke="#ccc" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#141414",
                      border: "1px solid #2a2a2a",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  <Bar dataKey="tuNivel" name="Tu Nivel" fill="#4AE54A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="promedioClase" name="Promedio de Clase" fill="#43E0E0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Tiempo Dedicado */}
        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Tiempo Dedicado por Habilidad</CardTitle>
              <CardDescription>Horas semanales dedicadas a cada habilidad</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={timeSpentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {timeSpentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Tabla de Habilidades */}
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Tabla de Habilidades</CardTitle>
              <CardDescription>Gestiona y actualiza tus niveles de habilidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 py-2 px-4 font-semibold border-b border-[#2a2a2a]">
                  <div className="col-span-5">Habilidad</div>
                  <div className="col-span-3">Categoría</div>
                  <div className="col-span-2">Nivel</div>
                  <div className="col-span-2">Acciones</div>
                </div>

                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-12 gap-4 py-3 px-4 items-center bg-[#1a1a1a] rounded-lg"
                  >
                    <div className="col-span-5">{skill.name}</div>
                    <div className="col-span-3 capitalize">{skill.category}</div>

                    {skill.editing ? (
                      <div className="col-span-2">
                        <Slider
                          value={[skill.level]}
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={(value) => updateSkillLevel(index, value[0])}
                        />
                      </div>
                    ) : (
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div className={`font-bold ${getLevelColor(skill.level)}`}>{skill.level}</div>
                          <div className="w-full bg-[#2a2a2a] h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressColor(skill.level)}`}
                              style={{ width: `${skill.level * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-span-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleEditing(index)}>
                        {skill.editing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sección para añadir nuevas habilidades */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Añadir Nueva Habilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const name = formData.get("name") as string
              const category = formData.get("category") as "academic" | "personal"
              const level = Number.parseInt(formData.get("level") as string)

              if (name && category && level) {
                setSkills([...skills, { name, category, level }])
                ;(e.target as HTMLFormElement).reset()
              }
            }}
          >
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <select
                id="category"
                name="category"
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                required
              >
                <option value="academic">Académica</option>
                <option value="personal">Personal</option>
              </select>
            </div>
            <div>
              <Label htmlFor="level">Nivel (1-10)</Label>
              <Input id="level" name="level" type="number" min="1" max="10" defaultValue="5" required />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Añadir
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
