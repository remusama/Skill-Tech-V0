"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart,
  Clock,
  Award,
  BarChart2,
  MessageSquare,
  User,
  LogOut,
  BookOpen,
  Search,
  Settings,
  Menu,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

// Modificar el array navItems para eliminar "Practica"
const navItems = [
  { icon: BarChart, label: "SkillMap", page: "skillmap" },
  { icon: Clock, label: "Examenes", page: "practice" },
  { icon: Award, label: "Logros", page: "achievements" },
      { icon: MessageSquare, label: "Eleonor AI", page: "assistant" },  { icon: User, label: "Perfil", page: "profile" },
  { icon: Settings, label: "Configuración", page: "settings" },
]

export function SidebarNavigation({ currentPage, setCurrentPage, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sidebarRef = useRef(null)
  const buttonRef = useRef(null)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Reemplazar completamente el useEffect para el manejo de clics fuera de la barra lateral
  // con una implementación más robusta
  useEffect(() => {
    // Solo agregar el event listener si la barra lateral está abierta
    if (!isOpen) return

    // Función para manejar clics en cualquier parte del documento
    function handleClickOutside(event) {
      // Verificar si el clic fue dentro de la barra lateral o el botón
      const clickedSidebar = sidebarRef.current && sidebarRef.current.contains(event.target)
      const clickedButton = buttonRef.current && buttonRef.current.contains(event.target)

      // Si el clic no fue en la barra lateral ni en el botón, cerrar la barra
      if (!clickedSidebar && !clickedButton) {
        setIsOpen(false)
      }
    }

    // Usar 'mousedown' para capturar el evento lo antes posible
    document.addEventListener("mousedown", handleClickOutside)

    // Limpiar el event listener cuando el componente se desmonte o isOpen cambie
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Cerrar sidebar al cambiar de página en móvil
  const handlePageChange = (page) => {
    setCurrentPage(page)
    if (isMobile) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Botón para abrir/cerrar la barra lateral - se oculta cuando la barra está abierta */}
      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 bg-[#171a4a] p-2 rounded-md border border-[#2f2c79] text-white"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Barra lateral */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full bg-[#000020] border-r border-[#2f2c79] z-40 w-64 overflow-y-auto"
          >
            {/* Botón para cerrar la barra lateral en móvil */}
            <button
              className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="flex flex-col h-full p-4">
              {/* Logo y título */}
              <div className="flex items-center gap-2 p-2 mb-6">
                <div className="relative w-10 h-10">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GLUbQYD2Z5ppPk4EWw6JegiV7IO5C1.png"
                    alt="SkillMeter Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#4c007d] to-[#7f00b2] text-transparent bg-clip-text">
                  SkillTech
                </span>
              </div>

              {/* Perfil del usuario */}
              <div className="flex items-center gap-3 p-3 mb-6 bg-[#171a4a] rounded-lg">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-[#7f00b2] text-white font-semibold">AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">Usuario Demo</p>
                  <p className="text-xs text-gray-400">usuario@demo.com</p>
                </div>
              </div>

              {/* Búsqueda */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    type="search"
                    placeholder="Buscar..."
                    className="pl-10 bg-[#171a4a] border-[#2f2c79] text-white placeholder-gray-400 focus:ring-[#7f00b2] focus:ring-2"
                  />
                </div>
              </div>

              {/* Navegación */}
              <div className="space-y-1 flex-1">
                {navItems.map(({ icon: Icon, label, page }) => (
                  <Button
                    key={page}
                    variant="ghost"
                    className={`w-full justify-start gap-3 ${
                      currentPage === page
                        ? "bg-[#7f00b2]/20 text-[#7f00b2] font-medium"
                        : "text-gray-400 hover:text-[#7f00b2] hover:bg-[#7f00b2]/10"
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                    {currentPage === page && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-full bg-[#7f00b2] rounded-r-md"
                      />
                    )}
                  </Button>
                ))}
              </div>

              {/* Cerrar sesión */}
              <div className="pt-4 border-t border-[#2f2c79] space-y-1 mt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-400 hover:text-[#7f00b2] hover:bg-[#7f00b2]/10"
                  onClick={onLogout}
                >
                  <LogOut size={18} />
                  <span>Cerrar sesión</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
