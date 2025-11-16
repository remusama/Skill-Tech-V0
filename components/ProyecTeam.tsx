"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Clock,
  Users,
  BarChart2,
  Calendar,
  MessageSquare,
  FileText,
  Plus,
  Search,
  Bell,
  Settings,
  ChevronRight,
  HelpCircle,
} from "lucide-react"
import { TimeControl } from "./TimeControl"
import { TeamManagement } from "./TeamManagement"
import { ProjectManagement } from "./ProjectManagement"
import { CalendarView } from "./CalendarView"
import { ChatView } from "./ChatView"
import { DocumentView } from "./DocumentView"
import { useTheme } from "@/contexts/theme-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ProyecTeam() {
  const [currentView, setCurrentView] = useState("projects")
  const [isMobile, setIsMobile] = useState(false)
  const { theme } = useTheme()

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const renderView = () => {
    switch (currentView) {
      case "time":
        return <TimeControl />
      case "team":
        return <TeamManagement />
      case "projects":
        return <ProjectManagement />
      case "calendar":
        return <CalendarView />
      case "chat":
        return <ChatView />
      case "documents":
        return <DocumentView />
      default:
        return <ProjectManagement />
    }
  }

  // Colores según el tema
  const getColors = () => {
    return {
      headerBg: theme === "light" ? "bg-[#7D5AA4]" : "bg-[#000030]",
      activeButton: theme === "light" ? "bg-[#C1A9D2] text-[#3E3434]" : "bg-[#7f00b2]/10 text-[#7f00b2]",
      cardBg: theme === "light" ? "bg-[#E5E5E5]" : "bg-[#0a0a20]",
    }
  }

  const colors = getColors()

  const menuItems = [
    { id: "time", icon: <Clock className="w-4 h-4" />, label: "Control de Tiempo" },
    { id: "team", icon: <Users className="w-4 h-4" />, label: "Equipo" },
    { id: "projects", icon: <BarChart2 className="w-4 h-4" />, label: "Proyectos" },
    { id: "calendar", icon: <Calendar className="w-4 h-4" />, label: "Calendario" },
    { id: "chat", icon: <MessageSquare className="w-4 h-4" />, label: "Chat" },
    { id: "documents", icon: <FileText className="w-4 h-4" />, label: "Documentos" },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header con navegación */}
      <header className={`${colors.headerBg} text-white shadow-md`}>
        <div className="container mx-auto">
          {/* Parte superior del header */}
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">ProyecTeam</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar proyectos, tareas o equipos..."
                  className="pl-8 h-9 w-[300px] bg-white/10 text-white border-white/20 placeholder:text-white/50 focus:border-white/30"
                />
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notificaciones</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Configuración</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white p-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="bg-primary/30">JP</AvatarFallback>
                      </Avatar>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mi perfil</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex overflow-x-auto pb-0 px-4">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`rounded-none border-b-2 ${
                  currentView === item.id
                    ? "border-white text-white"
                    : "border-transparent text-white/70 hover:text-white hover:border-white/50"
                } px-4 py-2 flex items-center gap-2`}
                onClick={() => setCurrentView(item.id)}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {/* Barra de acciones rápidas */}
      <div className="bg-background border-b px-4 py-2 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <span className="text-muted-foreground">ProyecTeam</span>
          <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
          <span className="font-medium">{menuItems.find((item) => item.id === currentView)?.label}</span>
        </div>

        <div className="flex items-center gap-2">
          {currentView === "projects" && (
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              Nuevo Proyecto
            </Button>
          )}
          {currentView === "team" && (
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              Añadir Miembro
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-1">
            <HelpCircle className="w-4 h-4" />
            Ayuda
          </Button>
        </div>
      </div>

      {/* Main Content - Ahora ocupa todo el ancho */}
      <div className="flex-1 overflow-auto">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto p-4 md:p-6"
        >
          {renderView()}
        </motion.div>
      </div>

      {/* Barra de estado inferior (opcional) */}
      <div className="bg-muted/20 border-t px-4 py-2 text-xs text-muted-foreground flex justify-between">
        <div>7 proyectos activos • 23 tareas pendientes</div>
        <div>Última actualización: hace 5 minutos</div>
      </div>
    </div>
  )
}
