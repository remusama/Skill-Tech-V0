"use client"

import { useState, useEffect } from "react"
import { SidebarNavigation } from "@/components/SidebarNavigation"
import { Dashboard } from "@/components/Dashboard"
import { Achievements } from "@/components/Achievements"
import { Profile } from "@/components/Profile"
import { VirtualAssistant } from "@/components/VirtualAssistant"
import { SkillMap } from "@/components/SkillMap"
import { Practice } from "@/components/Practice"
import { LoginPage } from "@/components/LoginPage"
import { Settings } from "@/components/Settings"
import { BackgroundAnimation } from "@/components/BackgroundAnimation"
import { TutorialOverlay } from "@/components/TutorialOverlay"

export default function Home() {
  // Estado para controlar si el usuario está logueado
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // Estado para controlar la página actual
  const [currentPage, setCurrentPage] = useState("dashboard")
  // Estado para controlar si se muestra el tutorial
  const [showTutorial, setShowTutorial] = useState(false) // Inicialmente false para evitar renderizado antes de que todo esté listo
  // Estado para controlar si los componentes están cargados
  const [isLoaded, setIsLoaded] = useState(false)

  // Aseguramos que los componentes están cargados antes de mostrar el tutorial
  useEffect(() => {
    setIsLoaded(true)
    // Solo mostramos el tutorial si el usuario está logueado y todo está cargado
    if (isLoggedIn) {
      setShowTutorial(true)
    }
  }, [isLoggedIn])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowTutorial(false)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    setCurrentPage("skillmap") // Cambiamos a "skillmap" al iniciar sesión
    // El tutorial se mostrará gracias al useEffect
  }

  const handleCompleteTutorial = () => {
    setShowTutorial(false)
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-[#000020] text-white relative overflow-hidden">
      <BackgroundAnimation />

      <SidebarNavigation currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />

      <div className="md:ml-0 p-4 md:p-8 relative z-10">
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "skillmap" && <SkillMap />}
        {currentPage === "achievements" && <Achievements />}
        {currentPage === "profile" && <Profile />}
        {currentPage === "assistant" && <VirtualAssistant />}
        {currentPage === "practice" && <Practice />}
        {currentPage === "settings" && <Settings />}
      </div>

      {/* Solo mostramos el tutorial si showTutorial es true Y los componentes están cargados */}
      {isLoaded && showTutorial && <TutorialOverlay onComplete={handleCompleteTutorial} />}
    </div>
  )
}