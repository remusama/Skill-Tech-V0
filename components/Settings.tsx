"use client"
import {
  User,
  Bell,
  Lock,
  Shield,
  Palette,
  Globe,
  HelpCircle,
  Save,
  Moon,
  Sun,
  ChevronRight,
  BookOpen,
  FileText,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/contexts/theme-context"

export function Settings() {
  // Usar el hook useTheme para acceder al tema actual y la función para cambiarlo
  const { theme, setTheme } = useTheme()

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4c007d] to-[#7f00b2] text-transparent bg-clip-text mb-2">
          Configuración
        </h1>
        <p className="text-gray-400">Personaliza tu experiencia en SkillTech ajustando las siguientes opciones</p>
      </div>

      <Tabs defaultValue="account" className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 flex-shrink-0">
          <TabsList className="flex flex-col h-auto bg-[#171a4a] p-1 rounded-lg w-full">
            <TabsTrigger
              value="account"
              className="justify-start gap-3 h-12 data-[state=active]:bg-[#7f00b2]/20 data-[state=active]:text-[#7f00b2]"
            >
              <User size={18} />
              <span>Cuenta</span>
              {true && <ChevronRight size={16} className="ml-auto" />}
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="justify-start gap-3 h-12 data-[state=active]:bg-[#7f00b2]/20 data-[state=active]:text-[#7f00b2]"
            >
              <Bell size={18} />
              <span>Notificaciones</span>
              <ChevronRight size={16} className="ml-auto" />
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="justify-start gap-3 h-12 data-[state=active]:bg-[#7f00b2]/20 data-[state=active]:text-[#7f00b2]"
            >
              <Lock size={18} />
              <span>Privacidad</span>
              <ChevronRight size={16} className="ml-auto" />
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="justify-start gap-3 h-12 data-[state=active]:bg-[#7f00b2]/20 data-[state=active]:text-[#7f00b2]"
            >
              <Shield size={18} />
              <span>Seguridad</span>
              <ChevronRight size={16} className="ml-auto" />
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="justify-start gap-3 h-12 data-[state=active]:bg-[#7f00b2]/20 data-[state=active]:text-[#7f00b2]"
            >
              <Palette size={18} />
              <span>Apariencia</span>
              <ChevronRight size={16} className="ml-auto" />
            </TabsTrigger>
            <TabsTrigger
              value="language"
              className="justify-start gap-3 h-12 data-[state=active]:bg-[#7f00b2]/20 data-[state=active]:text-[#7f00b2]"
            >
              <Globe size={18} />
              <span>Idioma</span>
              <ChevronRight size={16} className="ml-auto" />
            </TabsTrigger>
            <TabsTrigger
              value="help"
              className="justify-start gap-3 h-12 data-[state=active]:bg-[#7f00b2]/20 data-[state=active]:text-[#7f00b2]"
            >
              <HelpCircle size={18} />
              <span>Ayuda y soporte</span>
              <ChevronRight size={16} className="ml-auto" />
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1">
          <TabsContent value="account" className="mt-0">
            <Card className="bg-[#171a4a] border-[#2f2c79]">
              <CardHeader>
                <CardTitle>Información de perfil</CardTitle>
                <CardDescription>Actualiza tu información personal y cómo te ven otros usuarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback className="bg-[#7f00b2] text-white text-xl">AD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="mt-2">
                      Cambiar foto
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" defaultValue="Usuario" className="bg-[#0c0e29] border-[#2f2c79]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastname">Apellido</Label>
                        <Input id="lastname" defaultValue="Demo" className="bg-[#0c0e29] border-[#2f2c79]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="usuario@demo.com"
                        className="bg-[#0c0e29] border-[#2f2c79]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografía</Label>
                      <textarea
                        id="bio"
                        rows={3}
                        className="w-full rounded-md bg-[#0c0e29] border border-[#2f2c79] p-2 text-sm"
                        placeholder="Cuéntanos sobre ti..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Información profesional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa/Institución</Label>
                      <Input
                        id="company"
                        placeholder="Nombre de tu empresa"
                        className="bg-[#0c0e29] border-[#2f2c79]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Cargo</Label>
                      <Input
                        id="position"
                        placeholder="Tu cargo o posición"
                        className="bg-[#0c0e29] border-[#2f2c79]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Habilidades</Label>
                    <Input
                      id="skills"
                      placeholder="Programación, Diseño, Marketing..."
                      className="bg-[#0c0e29] border-[#2f2c79]"
                    />
                    <p className="text-xs text-gray-400">Separa las habilidades con comas</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#7f00b2] hover:bg-[#6a0096]">
                  <Save size={16} className="mr-2" />
                  Guardar cambios
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <Card className="bg-[#171a4a] border-[#2f2c79]">
              <CardHeader>
                <CardTitle>Preferencias de notificaciones</CardTitle>
                <CardDescription>Configura cómo y cuándo quieres recibir notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notificaciones por correo</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-updates" className="text-base">
                          Actualizaciones de cursos
                        </Label>
                        <p className="text-sm text-gray-400">Recibe notificaciones cuando se actualicen tus cursos</p>
                      </div>
                      <Switch id="email-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-achievements" className="text-base">
                          Nuevos logros
                        </Label>
                        <p className="text-sm text-gray-400">Recibe notificaciones cuando desbloquees nuevos logros</p>
                      </div>
                      <Switch id="email-achievements" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-marketing" className="text-base">
                          Comunicaciones de marketing
                        </Label>
                        <p className="text-sm text-gray-400">Recibe ofertas especiales y novedades</p>
                      </div>
                      <Switch id="email-marketing" />
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notificaciones en la plataforma</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="platform-messages" className="text-base">
                          Mensajes
                        </Label>
                        <p className="text-sm text-gray-400">Notificaciones cuando recibas nuevos mensajes</p>
                      </div>
                      <Switch id="platform-messages" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="platform-reminders" className="text-base">
                          Recordatorios
                        </Label>
                        <p className="text-sm text-gray-400">Recordatorios de tareas y exámenes pendientes</p>
                      </div>
                      <Switch id="platform-reminders" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="platform-team" className="text-base">
                          Actividad del equipo
                        </Label>
                        <p className="text-sm text-gray-400">Notificaciones sobre la actividad de tu equipo</p>
                      </div>
                      <Switch id="platform-team" defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Frecuencia de resúmenes</h3>
                  <div className="space-y-2">
                    <Label htmlFor="digest-frequency">Frecuencia de resúmenes por correo</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger className="bg-[#0c0e29] border-[#2f2c79]">
                        <SelectValue placeholder="Selecciona frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                        <SelectItem value="never">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#7f00b2] hover:bg-[#6a0096]">
                  <Save size={16} className="mr-2" />
                  Guardar preferencias
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-0">
            <Card className="bg-[#171a4a] border-[#2f2c79]">
              <CardHeader>
                <CardTitle>Configuración de privacidad</CardTitle>
                <CardDescription>Controla quién puede ver tu información y cómo se utiliza</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Visibilidad del perfil</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="profile-public" className="text-base">
                          Perfil público
                        </Label>
                        <p className="text-sm text-gray-400">Permite que otros usuarios vean tu perfil</p>
                      </div>
                      <Switch id="profile-public" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-skills" className="text-base">
                          Mostrar habilidades
                        </Label>
                        <p className="text-sm text-gray-400">Permite que otros vean tus habilidades y progreso</p>
                      </div>
                      <Switch id="show-skills" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-achievements" className="text-base">
                          Mostrar logros
                        </Label>
                        <p className="text-sm text-gray-400">Permite que otros vean tus logros</p>
                      </div>
                      <Switch id="show-achievements" defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Actividad y estado</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-online" className="text-base">
                          Mostrar estado en línea
                        </Label>
                        <p className="text-sm text-gray-400">Permite que otros vean cuando estás en línea</p>
                      </div>
                      <Switch id="show-online" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="activity-feed" className="text-base">
                          Actividad en el feed
                        </Label>
                        <p className="text-sm text-gray-400">Muestra tu actividad reciente en el feed de otros</p>
                      </div>
                      <Switch id="activity-feed" />
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Datos y personalización</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="personalized-content" className="text-base">
                          Contenido personalizado
                        </Label>
                        <p className="text-sm text-gray-400">Permite recomendaciones basadas en tu actividad</p>
                      </div>
                      <Switch id="personalized-content" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="data-collection" className="text-base">
                          Recopilación de datos de uso
                        </Label>
                        <p className="text-sm text-gray-400">Ayúdanos a mejorar con datos anónimos de uso</p>
                      </div>
                      <Switch id="data-collection" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#7f00b2] hover:bg-[#6a0096]">
                  <Save size={16} className="mr-2" />
                  Guardar configuración
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <Card className="bg-[#171a4a] border-[#2f2c79]">
              <CardHeader>
                <CardTitle>Seguridad de la cuenta</CardTitle>
                <CardDescription>Gestiona la seguridad de tu cuenta y protege tu información</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Cambiar contraseña</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Contraseña actual</Label>
                      <Input id="current-password" type="password" className="bg-[#0c0e29] border-[#2f2c79]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nueva contraseña</Label>
                      <Input id="new-password" type="password" className="bg-[#0c0e29] border-[#2f2c79]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                      <Input id="confirm-password" type="password" className="bg-[#0c0e29] border-[#2f2c79]" />
                    </div>
                    <Button className="mt-2 bg-[#7f00b2] hover:bg-[#6a0096]">Actualizar contraseña</Button>
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Autenticación de dos factores</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-medium">Estado</p>
                        <p className="text-sm text-gray-400">La autenticación de dos factores está desactivada</p>
                      </div>
                      <Button variant="outline">Activar</Button>
                    </div>
                    <p className="text-sm text-gray-400">
                      La autenticación de dos factores añade una capa adicional de seguridad a tu cuenta al requerir un
                      código además de tu contraseña.
                    </p>
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sesiones activas</h3>
                  <div className="space-y-3">
                    <div className="bg-[#0c0e29] p-3 rounded-md border border-[#2f2c79]">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Chrome en Windows</p>
                          <p className="text-sm text-gray-400">Activa ahora • Madrid, España</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          Cerrar
                        </Button>
                      </div>
                    </div>
                    <div className="bg-[#0c0e29] p-3 rounded-md border border-[#2f2c79]">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Safari en iPhone</p>
                          <p className="text-sm text-gray-400">Hace 2 días • Madrid, España</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          Cerrar
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-2 w-full">
                      Cerrar todas las sesiones
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="mt-0">
            <Card className="bg-[#171a4a] border-[#2f2c79]">
              <CardHeader>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>Personaliza la apariencia visual de la aplicación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        theme === "dark"
                          ? "border-[#7f00b2] bg-[#0c0e29]"
                          : "border-[#2f2c79] bg-[#171a4a] hover:border-[#7f00b2]/50"
                      }`}
                      onClick={() => setTheme("dark")}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Moon size={18} />
                          <span className="font-medium">Oscuro</span>
                        </div>
                        {theme === "dark" && <div className="w-4 h-4 rounded-full bg-[#7f00b2]"></div>}
                      </div>
                      <div className="h-24 rounded bg-[#000020] border border-[#2f2c79] flex items-center justify-center">
                        <div className="w-3/4 h-4 rounded bg-[#171a4a]"></div>
                      </div>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        theme === "light"
                          ? "border-[#7f00b2] bg-[#0c0e29]"
                          : "border-[#2f2c79] bg-[#171a4a] hover:border-[#7f00b2]/50"
                      }`}
                      onClick={() => setTheme("light")}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Sun size={18} />
                          <span className="font-medium">Claro</span>
                        </div>
                        {theme === "light" && <div className="w-4 h-4 rounded-full bg-[#7f00b2]"></div>}
                      </div>
                      <div className="h-24 rounded bg-[#f5f5f5] border border-gray-300 flex items-center justify-center">
                        <div className="w-3/4 h-4 rounded bg-white border border-gray-300"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Densidad de contenido</h3>
                  <div className="space-y-2">
                    <Label htmlFor="content-density">Espaciado de elementos</Label>
                    <Select defaultValue="comfortable">
                      <SelectTrigger className="bg-[#0c0e29] border-[#2f2c79]">
                        <SelectValue placeholder="Selecciona densidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compacto</SelectItem>
                        <SelectItem value="comfortable">Cómodo</SelectItem>
                        <SelectItem value="spacious">Espacioso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Animaciones</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-animations" className="text-base">
                        Activar animaciones
                      </Label>
                      <p className="text-sm text-gray-400">Mostrar animaciones en la interfaz</p>
                    </div>
                    <Switch id="enable-animations" defaultChecked />
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Fuente</h3>
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Tamaño de fuente</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="bg-[#0c0e29] border-[#2f2c79]">
                        <SelectValue placeholder="Selecciona tamaño" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Pequeño</SelectItem>
                        <SelectItem value="medium">Mediano</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#7f00b2] hover:bg-[#6a0096]">
                  <Save size={16} className="mr-2" />
                  Guardar preferencias
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="mt-0">
            <Card className="bg-[#171a4a] border-[#2f2c79]">
              <CardHeader>
                <CardTitle>Idioma y región</CardTitle>
                <CardDescription>Configura tus preferencias de idioma y formato regional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Idioma de la aplicación</h3>
                  <div className="space-y-2">
                    <Label htmlFor="app-language">Idioma</Label>
                    <Select defaultValue="es">
                      <SelectTrigger className="bg-[#0c0e29] border-[#2f2c79]">
                        <SelectValue placeholder="Selecciona idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Formato regional</h3>
                  <div className="space-y-2">
                    <Label htmlFor="region">Región</Label>
                    <Select defaultValue="es-ES">
                      <SelectTrigger className="bg-[#0c0e29] border-[#2f2c79]">
                        <SelectValue placeholder="Selecciona región" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es-ES">España</SelectItem>
                        <SelectItem value="es-MX">México</SelectItem>
                        <SelectItem value="es-AR">Argentina</SelectItem>
                        <SelectItem value="es-CO">Colombia</SelectItem>
                        <SelectItem value="en-US">Estados Unidos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Formato de fecha y hora</h3>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Formato de fecha</Label>
                    <Select defaultValue="dd/mm/yyyy">
                      <SelectTrigger className="bg-[#0c0e29] border-[#2f2c79]">
                        <SelectValue placeholder="Selecciona formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                        <SelectItem value="yyyy/mm/dd">AAAA/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-format">Formato de hora</Label>
                    <Select defaultValue="24h">
                      <SelectTrigger className="bg-[#0c0e29] border-[#2f2c79]">
                        <SelectValue placeholder="Selecciona formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 horas</SelectItem>
                        <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#7f00b2] hover:bg-[#6a0096]">
                  <Save size={16} className="mr-2" />
                  Guardar preferencias
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="mt-0">
            <Card className="bg-[#171a4a] border-[#2f2c79]">
              <CardHeader>
                <CardTitle>Ayuda y soporte</CardTitle>
                <CardDescription>Encuentra respuestas a tus preguntas y obtén ayuda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preguntas frecuentes</h3>
                  <div className="space-y-3">
                    <div className="bg-[#0c0e29] p-4 rounded-md border border-[#2f2c79]">
                      <h4 className="font-medium mb-1">¿Cómo puedo cambiar mi contraseña?</h4>
                      <p className="text-sm text-gray-400">
                        Puedes cambiar tu contraseña en la sección de Seguridad de la configuración de tu cuenta.
                      </p>
                    </div>
                    <div className="bg-[#0c0e29] p-4 rounded-md border border-[#2f2c79]">
                      <h4 className="font-medium mb-1">¿Cómo puedo obtener más logros?</h4>
                      <p className="text-sm text-gray-400">
                        Los logros se desbloquean a medida que completas cursos, exámenes y alcanzas ciertos hitos en la
                        plataforma.
                      </p>
                    </div>
                    <div className="bg-[#0c0e29] p-4 rounded-md border border-[#2f2c79]">
                      <h4 className="font-medium mb-1">¿Cómo funciona el SkillMap?</h4>
                      <p className="text-sm text-gray-400">
                        SkillMap es una representación visual de tus habilidades y progreso. Se actualiza
                        automáticamente a medida que completas cursos y exámenes.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contacto</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="support-subject">Asunto</Label>
                      <Select defaultValue="question">
                        <SelectTrigger className="bg-[#0c0e29] border-[#2f2c79]">
                          <SelectValue placeholder="Selecciona asunto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="question">Pregunta general</SelectItem>
                          <SelectItem value="technical">Problema técnico</SelectItem>
                          <SelectItem value="billing">Facturación</SelectItem>
                          <SelectItem value="feedback">Sugerencia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="support-message">Mensaje</Label>
                      <textarea
                        id="support-message"
                        rows={4}
                        className="w-full rounded-md bg-[#0c0e29] border border-[#2f2c79] p-2 text-sm"
                        placeholder="Describe tu consulta o problema..."
                      ></textarea>
                    </div>
                    <Button className="bg-[#7f00b2] hover:bg-[#6a0096]">Enviar mensaje</Button>
                  </div>
                </div>

                <Separator className="bg-[#2f2c79]" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recursos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start">
                      <HelpCircle size={16} className="mr-2" />
                      Centro de ayuda
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <BookOpen size={16} className="mr-2" />
                      Tutoriales
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Globe size={16} className="mr-2" />
                      Comunidad
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText size={16} className="mr-2" />
                      Documentación
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
