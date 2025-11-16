"use client"

import { Button } from "@/components/ui/button"
import { Activity, Clock, Users, BarChart2, Calendar, MessageSquare, FileText, Plus } from "lucide-react"

const navItems = [
  { icon: Activity, label: "Dashboard", id: "dashboard" },
  { icon: Clock, label: "Control de Tiempo", id: "timeControl" },
  { icon: Users, label: "Equipo", id: "team" },
  { icon: BarChart2, label: "Proyectos", id: "projects" },
  { icon: Calendar, label: "Calendario", id: "calendar" },
  { icon: MessageSquare, label: "Chat", id: "chat" },
  { icon: FileText, label: "Documentos", id: "documents" },
]

export function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <div className="w-64 bg-[#000020] h-screen p-4 flex flex-col gap-2 border-r border-[#2f2c79]">
      <div className="flex items-center gap-2 p-2 mb-8">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3AT74N7cNNbEl74vef1lBYbgLmryK7.png"
          alt="Logo"
          className="w-8 h-8"
        />
        <span className="text-white font-bold">SkillTech</span>
      </div>

      {navItems.map(({ icon: Icon, label, id }) => (
        <Button
          key={id}
          variant="ghost"
          className={`w-full justify-start gap-2 hover:bg-[#7f00b2]/20 ${
            currentPage === id ? "text-[#7f00b2] bg-[#7f00b2]/10 font-semibold" : "text-gray-400 hover:text-[#7f00b2]"
          }`}
          onClick={() => setCurrentPage(id)}
        >
          <Icon size={20} />
          {label}
        </Button>
      ))}

      <div className="flex-1"></div>

      <Button variant="outline" className="w-full justify-start gap-2 text-gray-400 mt-4">
        <Plus size={20} />
        Nuevo Proyecto
      </Button>
    </div>
  )
}
