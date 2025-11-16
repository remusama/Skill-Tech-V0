import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { PageTransition } from "@/components/PageTransition"

export const metadata = {
  title: "SkillTech - Plataforma de aprendizaje",
  description: "Plataforma de aprendizaje y gestión de habilidades",
    generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          <PageTransition>{children}</PageTransition>
        </ThemeProvider>
      </body>
    </html>
  )
}
