"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Clock,
  MapPin,
  Users,
  Trash2,
  Download,
  Share2,
  Bell,
  X,
  MessageSquare,
  CalendarDays,
  CalendarClock,
  CalendarRange,
  CalendarCheck,
  Sparkles,
  Move,
} from "lucide-react"

// Tipos para los eventos
interface CalendarEvent {
  id: number
  title: string
  startTime: string
  endTime: string
  color: string
  day: number
  description: string
  location: string
  attendees: string[]
  organizer: string
  category: string
  isRecurring?: boolean
  reminder?: number // minutos antes
}

// Añadamos estilos CSS para los elementos del calendario
const calendarStyles = `
  .calendar-time-slot {
    height: 60px;
    border-bottom: 1px solid hsl(var(--border) / 0.1);
  }
  
  .calendar-day-column {
    border-left: 1px solid hsl(var(--border) / 0.2);
    position: relative;
  }
  
  .calendar-event {
    transition: all 0.2s ease-in-out;
  }
  
  .calendar-event:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .calendar-mini-day {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    cursor: pointer;
  }
  
  .calendar-mini-day:hover {
    background-color: hsl(var(--muted) / 0.5);
  }
  
  .calendar-mini-day.active {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }
  
  .calendar-popup {
    max-height: 90vh;
    overflow-y: auto;
  }
`

// Componente principal
export function CalendarView() {
  const { theme } = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentView, setCurrentView] = useState("week")
  const [currentMonth, setCurrentMonth] = useState("Mayo 2025")
  const [currentDate, setCurrentDate] = useState("Mayo 15")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiMessage, setAiMessage] = useState("")
  const [filteredCategories, setFilteredCategories] = useState<string[]>([])
  const [showReminder, setShowReminder] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showMoveEventTooltip, setShowMoveEventTooltip] = useState<number | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Efecto para la animación de carga
  useEffect(() => {
    setIsLoaded(true)

    // Mostrar el asistente de IA después de 3 segundos
    const timer = setTimeout(() => {
      setShowAIAssistant(true)
      typeMessage(
        "Parece que tienes tiempo libre esta tarde. ¿Te gustaría que programe una sesión de práctica para mejorar tus habilidades en JavaScript?",
      )
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Función para simular escritura del asistente
  const typeMessage = (message: string) => {
    let i = 0
    setAiMessage("")
    const interval = setInterval(() => {
      if (i < message.length) {
        setAiMessage((prev) => prev + message.charAt(i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 30)
  }

  // Función para cambiar de mes
  const changeMonth = (direction: "prev" | "next") => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    const currentMonthIndex = months.findIndex((m) => currentMonth.includes(m))
    let newMonthIndex = direction === "prev" ? currentMonthIndex - 1 : currentMonthIndex + 1
    let year = Number.parseInt(currentMonth.split(" ")[1])

    if (newMonthIndex < 0) {
      newMonthIndex = 11
      year--
    } else if (newMonthIndex > 11) {
      newMonthIndex = 0
      year++
    }

    setCurrentMonth(`${months[newMonthIndex]} ${year}`)
  }

  // Función para manejar el clic en un evento
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
  }

  // Función para filtrar eventos por categoría
  const toggleCategoryFilter = (category: string) => {
    if (filteredCategories.includes(category)) {
      setFilteredCategories(filteredCategories.filter((c) => c !== category))
    } else {
      setFilteredCategories([...filteredCategories, category])
    }
  }

  // Función para exportar eventos
  const exportEvents = () => {
    const eventsData = JSON.stringify(events, null, 2)
    const blob = new Blob([eventsData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "calendario-eventos.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Datos de ejemplo para el calendario
  const events: CalendarEvent[] = [
    {
      id: 1,
      title: "Reunión de Equipo",
      startTime: "09:00",
      endTime: "10:00",
      color: "bg-purple-500",
      day: 1,
      description: "Sincronización semanal del equipo",
      location: "Sala de Conferencias A",
      attendees: ["Juan Pérez", "María García", "Carlos López"],
      organizer: "Ana Martínez",
      category: "trabajo",
    },
    {
      id: 2,
      title: "Almuerzo con Sara",
      startTime: "12:30",
      endTime: "13:30",
      color: "bg-green-500",
      day: 1,
      description: "Discutir cronograma del proyecto",
      location: "Cafetería Central",
      attendees: ["Sara Lee"],
      organizer: "Tú",
      category: "personal",
    },
    {
      id: 3,
      title: "Revisión de Proyecto",
      startTime: "14:00",
      endTime: "15:30",
      color: "bg-purple-500",
      day: 3,
      description: "Revisión de progreso del proyecto Q2",
      location: "Sala de Reuniones 3",
      attendees: ["Equipo Alpha", "Stakeholders"],
      organizer: "Gerente de Proyecto",
      category: "trabajo",
    },
    {
      id: 4,
      title: "Llamada con Cliente",
      startTime: "10:00",
      endTime: "11:00",
      color: "bg-yellow-500",
      day: 2,
      description: "Revisión trimestral con cliente principal",
      location: "Reunión Zoom",
      attendees: ["Equipo Cliente", "Equipo Ventas"],
      organizer: "Gerente de Cuenta",
      category: "trabajo",
    },
    {
      id: 5,
      title: "Sesión de Práctica JavaScript",
      startTime: "16:00",
      endTime: "17:30",
      color: "bg-blue-500",
      day: 4,
      description: "Práctica de conceptos avanzados de JavaScript",
      location: "Online",
      attendees: ["Tú"],
      organizer: "SkillTech",
      category: "educación",
      reminder: 15,
    },
    {
      id: 6,
      title: "Curso de React Avanzado",
      startTime: "11:00",
      endTime: "12:30",
      color: "bg-pink-500",
      day: 5,
      description: "Módulo 3: Hooks personalizados",
      location: "Plataforma SkillTech",
      attendees: ["Participantes del curso"],
      organizer: "Instructor SkillTech",
      category: "educación",
      isRecurring: true,
    },
    {
      id: 7,
      title: "Ejercicio",
      startTime: "07:00",
      endTime: "08:00",
      color: "bg-teal-500",
      day: 2,
      description: "Rutina de cardio",
      location: "Gimnasio",
      attendees: ["Tú"],
      organizer: "Tú",
      category: "salud",
      isRecurring: true,
    },
    {
      id: 8,
      title: "Revisión de Código",
      startTime: "15:00",
      endTime: "16:00",
      color: "bg-cyan-500",
      day: 3,
      description: "Revisar pull requests para nueva funcionalidad",
      location: "GitHub",
      attendees: ["Equipo de Desarrollo"],
      organizer: "Desarrollador Senior",
      category: "trabajo",
    },
  ]

  // Filtrar eventos según la búsqueda y categorías
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filteredCategories.length === 0 || filteredCategories.includes(event.category)

    return matchesSearch && matchesCategory
  })

  // Días de la semana para la vista semanal
  const weekDays = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"]
  const weekDates = [11, 12, 13, 14, 15, 16, 17] // Ejemplo para mayo
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 7) // 7 AM a 6 PM

  // Función para calcular la posición y altura de un evento
  const calculateEventStyle = (startTime: string, endTime: string) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    const top = (start - 7) * 60 // 60px por hora
    const height = (end - start) * 60
    return { top: `${top}px`, height: `${height}px` }
  }

  // Datos para el mini calendario
  const daysInMonth = 31
  const firstDayOffset = 3 // Miércoles es el primer día del mes en este ejemplo
  const miniCalendarDays = Array.from({ length: daysInMonth + firstDayOffset }, (_, i) =>
    i < firstDayOffset ? null : i - firstDayOffset + 1,
  )

  // Categorías de calendario
  const categories = [
    { name: "Trabajo", color: "bg-purple-500", key: "trabajo" },
    { name: "Personal", color: "bg-green-500", key: "personal" },
    { name: "Educación", color: "bg-blue-500", key: "educación" },
    { name: "Salud", color: "bg-teal-500", key: "salud" },
  ]

  // Inyectar estilos CSS
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.textContent = calendarStyles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="calendar-header bg-background/80 sticky top-0 z-10 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Calendario
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-full bg-background pl-10 pr-4 py-2 text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => setShowEventForm(true)}>
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 mt-2">
          <Tabs defaultValue="week" className="w-full" onValueChange={(value) => setCurrentView(value)}>
            <div className="flex items-center justify-between px-4 py-2">
              <TabsList>
                <TabsTrigger value="day" className="flex items-center gap-1">
                  <CalendarClock className="h-4 w-4" />
                  <span className="hidden sm:inline">Día</span>
                </TabsTrigger>
                <TabsTrigger value="week" className="flex items-center gap-1">
                  <CalendarRange className="h-4 w-4" />
                  <span className="hidden sm:inline">Semana</span>
                </TabsTrigger>
                <TabsTrigger value="month" className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span className="hidden sm:inline">Mes</span>
                </TabsTrigger>
                <TabsTrigger value="agenda" className="flex items-center gap-1">
                  <CalendarCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Agenda</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentDate("Mayo 15")}>
                  Hoy
                </Button>
                <div className="flex">
                  <Button variant="ghost" size="icon" onClick={() => changeMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => changeMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-lg font-medium">{currentDate}</span>
              </div>
            </div>

            <div className="flex h-[calc(100vh-220px)] mt-2">
              {/* Sidebar */}
              <div className="w-64 calendar-sidebar bg-card/50 p-4 border-r border-border rounded-l-lg hidden md:block">
                <div className="mb-6">
                  <h3 className="text-foreground font-medium mb-4">{currentMonth}</h3>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["D", "L", "M", "X", "J", "V", "S"].map((day, i) => (
                      <div key={i} className="text-xs text-muted-foreground font-medium py-1">
                        {day}
                      </div>
                    ))}

                    {miniCalendarDays.map((day, i) => (
                      <div
                        key={i}
                        className={`calendar-mini-day text-xs ${day === 15 ? "active" : ""} ${!day ? "invisible" : ""}`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-foreground font-medium mb-3">Mis calendarios</h3>
                  <div className="space-y-2">
                    {categories.map((cat, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`cat-${cat.key}`}
                          checked={filteredCategories.length === 0 || filteredCategories.includes(cat.key)}
                          onChange={() => toggleCategoryFilter(cat.key)}
                          className="rounded text-primary"
                        />
                        <div className={`w-3 h-3 rounded-sm ${cat.color}`}></div>
                        <label htmlFor={`cat-${cat.key}`} className="text-foreground text-sm cursor-pointer">
                          {cat.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={exportEvents}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar eventos
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir calendario
                  </Button>
                </div>
              </div>

              {/* Calendar View */}
              <div className="flex-1 overflow-auto" ref={calendarRef}>
                <TabsContent value="week" className="m-0">
                  <div className="bg-card/50 backdrop-blur-sm rounded-r-lg border border-border h-full">
                    {/* Week Header */}
                    <div className="grid grid-cols-8 border-b border-border">
                      <div className="p-2 text-center text-muted-foreground text-xs"></div>
                      {weekDays.map((day, i) => (
                        <div key={i} className="p-2 text-center border-l border-border">
                          <div className="text-xs text-muted-foreground font-medium">{day}</div>
                          <div
                            className={`text-lg font-medium mt-1 ${
                              weekDates[i] === 15
                                ? "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                                : "text-foreground"
                            }`}
                          >
                            {weekDates[i]}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Time Grid */}
                    <div className="grid grid-cols-8">
                      {/* Time Labels */}
                      <div className="text-muted-foreground">
                        {timeSlots.map((time, i) => (
                          <div key={i} className="calendar-time-slot pr-2 text-right text-xs">
                            {time > 12 ? `${time - 12} PM` : `${time} AM`}
                          </div>
                        ))}
                      </div>

                      {/* Days Columns */}
                      {Array.from({ length: 7 }).map((_, dayIndex) => (
                        <div key={dayIndex} className="calendar-day-column">
                          {timeSlots.map((_, timeIndex) => (
                            <div key={timeIndex} className="calendar-time-slot"></div>
                          ))}

                          {/* Events */}
                          {filteredEvents
                            .filter((event) => event.day === dayIndex + 1)
                            .map((event, i) => {
                              const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                              return (
                                <div
                                  key={i}
                                  className={`absolute ${event.color} calendar-event rounded-md p-2 text-white text-xs shadow-md cursor-pointer group`}
                                  style={{
                                    ...eventStyle,
                                    left: "4px",
                                    right: "4px",
                                    zIndex: selectedEvent?.id === event.id ? 10 : 1,
                                  }}
                                  onClick={() => handleEventClick(event)}
                                  onMouseEnter={() => setShowMoveEventTooltip(event.id)}
                                  onMouseLeave={() => setShowMoveEventTooltip(null)}
                                >
                                  <div className="font-medium flex items-center gap-1">
                                    {event.isRecurring && <span>🔄</span>}
                                    {event.reminder && <Bell className="h-3 w-3" />}
                                    {event.title}
                                  </div>
                                  <div className="opacity-80 text-[10px] mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                                  <div className="opacity-80 text-[10px]">{event.location}</div>

                                  {/* Tooltip para mover evento */}
                                  {showMoveEventTooltip === event.id && (
                                    <div className="absolute top-0 right-0 bg-black/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Move className="h-3 w-3" />
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="day" className="m-0">
                  <div className="bg-card/50 backdrop-blur-sm rounded-r-lg border border-border h-full p-4">
                    <h3 className="text-xl font-medium mb-4">Vista diaria</h3>
                    <p className="text-muted-foreground">Mostrando eventos para {currentDate}</p>

                    <div className="mt-4 space-y-3">
                      {filteredEvents
                        .filter((event) => event.day === 5) // Asumiendo que el día actual es el 5
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((event) => (
                          <div
                            key={event.id}
                            className={`${event.color} p-3 rounded-md text-white cursor-pointer hover:shadow-lg transition-shadow`}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{event.title}</h4>
                              <div className="text-sm">{`${event.startTime} - ${event.endTime}`}</div>
                            </div>
                            <div className="mt-2 text-sm">{event.description}</div>
                            <div className="mt-2 text-sm flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="month" className="m-0">
                  <div className="bg-card/50 backdrop-blur-sm rounded-r-lg border border-border h-full p-4">
                    <div className="grid grid-cols-7 gap-1">
                      {["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((day, i) => (
                        <div key={i} className="p-2 text-center border-b border-border font-medium">
                          {day}
                        </div>
                      ))}

                      {Array.from({ length: 35 }).map((_, i) => {
                        const day = i - 2 // Ajustar para que el 1 de mayo caiga en miércoles
                        const isCurrentMonth = day > 0 && day <= 31
                        const dayEvents = filteredEvents.filter((e) => e.day === (day % 7) + 1).slice(0, 2)
                        const hasMoreEvents = filteredEvents.filter((e) => e.day === (day % 7) + 1).length > 2

                        return (
                          <div
                            key={i}
                            className={`border border-border p-1 h-24 overflow-hidden ${
                              isCurrentMonth ? "bg-card/30" : "bg-muted/20 text-muted-foreground"
                            } ${day === 15 ? "ring-2 ring-primary" : ""}`}
                          >
                            <div className="text-right text-xs mb-1">{isCurrentMonth ? day : ""}</div>
                            <div className="space-y-1">
                              {dayEvents.map((event, j) => (
                                <div
                                  key={j}
                                  className={`${event.color} text-white text-xs p-1 rounded truncate cursor-pointer`}
                                  onClick={() => handleEventClick(event)}
                                >
                                  {event.title}
                                </div>
                              ))}
                              {hasMoreEvents && (
                                <div className="text-xs text-muted-foreground text-center">+ más eventos</div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="agenda" className="m-0">
                  <div className="bg-card/50 backdrop-blur-sm rounded-r-lg border border-border h-full p-4">
                    <h3 className="text-xl font-medium mb-4">Agenda</h3>

                    <div className="space-y-6">
                      {Array.from({ length: 7 }).map((_, dayIndex) => {
                        const dayEvents = filteredEvents.filter((event) => event.day === dayIndex + 1)
                        if (dayEvents.length === 0) return null

                        return (
                          <div key={dayIndex}>
                            <h4 className="font-medium border-b border-border pb-2 mb-3">
                              {weekDays[dayIndex]} {weekDates[dayIndex]} {currentMonth.split(" ")[0]}
                            </h4>
                            <div className="space-y-3 pl-4">
                              {dayEvents
                                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                .map((event) => (
                                  <div
                                    key={event.id}
                                    className="flex items-start gap-3 cursor-pointer hover:bg-muted/20 p-2 rounded-md transition-colors"
                                    onClick={() => handleEventClick(event)}
                                  >
                                    <div className="text-sm font-medium w-16">{event.startTime}</div>
                                    <div className={`w-2 h-2 rounded-full mt-1.5 ${event.color}`}></div>
                                    <div className="flex-1">
                                      <div className="font-medium">{event.title}</div>
                                      <div className="text-sm text-muted-foreground">{event.location}</div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className={`${selectedEvent.color} p-6 rounded-lg shadow-xl max-w-md w-full mx-4 calendar-popup`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold mb-4 text-white">{selectedEvent.title}</h3>
                <Button variant="ghost" size="icon" className="text-white" onClick={() => setSelectedEvent(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-3 text-white">
                <p className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  {`${selectedEvent.startTime} - ${selectedEvent.endTime}`}
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {selectedEvent.location}
                </p>
                <p className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  {`${weekDays[selectedEvent.day - 1]}, ${weekDates[selectedEvent.day - 1]} ${currentMonth}`}
                </p>
                <p className="flex items-start">
                  <Users className="mr-2 h-5 w-5 mt-1" />
                  <span>
                    <strong>Asistentes:</strong>
                    <br />
                    {selectedEvent.attendees.join(", ") || "Sin asistentes"}
                  </span>
                </p>
                <p>
                  <strong>Organizador:</strong> {selectedEvent.organizer}
                </p>
                <p>
                  <strong>Descripción:</strong> {selectedEvent.description}
                </p>

                {selectedEvent.reminder && (
                  <p className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Recordatorio {selectedEvent.reminder} minutos antes
                  </p>
                )}

                {selectedEvent.isRecurring && (
                  <p className="flex items-center">
                    <span className="mr-2">🔄</span>
                    Evento recurrente
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-white/20 text-white border-white/40 hover:bg-white/30">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comentar
                  </Button>
                  <Button className="bg-white text-gray-800 hover:bg-gray-100">Editar</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Event Form Modal */}
      <AnimatePresence>
        {showEventForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEventForm(false)}
          >
            <motion.div
              className="bg-card p-6 rounded-lg shadow-xl max-w-md w-full mx-4 calendar-popup"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Nuevo Evento</h3>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-input rounded-md bg-background"
                    placeholder="Añade un título"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha</label>
                    <input type="date" className="w-full p-2 border border-input rounded-md bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Categoría</label>
                    <select className="w-full p-2 border border-input rounded-md bg-background">
                      <option value="trabajo">Trabajo</option>
                      <option value="personal">Personal</option>
                      <option value="educación">Educación</option>
                      <option value="salud">Salud</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hora inicio</label>
                    <input type="time" className="w-full p-2 border border-input rounded-md bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hora fin</label>
                    <input type="time" className="w-full p-2 border border-input rounded-md bg-background" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ubicación</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-input rounded-md bg-background"
                    placeholder="Añade una ubicación"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    className="w-full p-2 border border-input rounded-md bg-background"
                    rows={3}
                    placeholder="Añade una descripción"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="reminder" className="rounded text-primary" />
                  <label htmlFor="reminder" className="text-sm">
                    Añadir recordatorio
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="recurring" className="rounded text-primary" />
                  <label htmlFor="recurring" className="text-sm">
                    Evento recurrente
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setShowEventForm(false)}>
                    Cancelar
                  </Button>
                  <Button>Guardar</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant Popup */}
      <AnimatePresence>
        {showAIAssistant && (
          <motion.div
            className="fixed bottom-8 right-8 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="w-[350px] relative bg-gradient-to-br from-primary/30 via-primary/30 to-primary/30 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-primary/30 text-foreground">
              <button
                onClick={() => setShowAIAssistant(false)}
                className="absolute top-2 right-2 text-foreground/70 hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="min-h-[80px]">
                  <p className="text-base font-light">{aiMessage}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowAIAssistant(false)
                    setShowReminder(true)
                    setTimeout(() => setShowReminder(false), 3000)
                  }}
                >
                  Sí, programa
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowAIAssistant(false)}>
                  No, gracias
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminder Toast */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            className="fixed bottom-8 left-8 z-20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-green-500/90 backdrop-blur-lg p-4 rounded-lg shadow-lg text-white flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <div>
                <p className="font-medium">Evento programado</p>
                <p className="text-sm">Sesión de práctica JavaScript - Hoy a las 16:00</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
