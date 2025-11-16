"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Camera, MapPin, Briefcase, GraduationCap, Clock, Users, ImageIcon, FileText } from "lucide-react"

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

const itemVariants = {
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

export function Profile() {
  const [name, setName] = useState("Juan Pérez")
  const [email, setEmail] = useState("juan.perez@example.com")
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Portada y foto de perfil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-16"
        >
          <div className="h-60 rounded-lg overflow-hidden bg-gradient-to-r from-[#0088FE] to-[#00C49F] relative">
            <img
              src="/placeholder.svg?height=240&width=800"
              alt="Portada"
              className="w-full h-full object-cover opacity-50"
            />
            <Button size="sm" variant="secondary" className="absolute bottom-4 right-4 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span>Cambiar portada</span>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute -bottom-12 left-8 flex items-end"
          >
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-4xl">JP</AvatarFallback>
              </Avatar>
              <Button size="sm" variant="secondary" className="absolute bottom-2 right-2 rounded-full w-8 h-8 p-0">
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="ml-4 mb-4">
              <h1 className="text-3xl font-bold">{name}</h1>
              <p className="text-muted-foreground">Estudiante</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute right-4 -bottom-12"
          >
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 bg-[#FF8042] hover:bg-[#FF8042]/80"
            >
              <Edit className="w-4 h-4" />
              <span>Editar perfil</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Pestañas de navegación */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="bg-[#1a1a1a] mb-6">
            <TabsTrigger value="info" className="data-[state=active]:bg-transparent data-[state=active]:text-[#8884D8]">
              <FileText className="w-4 h-4 mr-2" />
              Información
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="data-[state=active]:bg-transparent data-[state=active]:text-[#8884D8]"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Cursos
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="data-[state=active]:bg-transparent data-[state=active]:text-[#8884D8]"
            >
              <Users className="w-4 h-4 mr-2" />
              Amigos
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="data-[state=active]:bg-transparent data-[state=active]:text-[#8884D8]"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Fotos
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Columna lateral */}
            <motion.div
              variants={cardVariants}
              custom={0}
              initial="hidden"
              animate="visible"
              className="md:col-span-1 space-y-6"
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Información personal</h3>
                  <div className="space-y-3">
                    <motion.div variants={itemVariants} custom={0} className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[#FF8042]" />
                      <span>Lima, Perú</span>
                    </motion.div>
                    <motion.div variants={itemVariants} custom={1} className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-[#0088FE]" />
                      <span>Estudiante en Universidad Nacional</span>
                    </motion.div>
                    <motion.div variants={itemVariants} custom={2} className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-[#00C49F]" />
                      <span>Ingeniería de Software</span>
                    </motion.div>
                    <motion.div variants={itemVariants} custom={3} className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#FFBB28]" />
                      <span>Se unió en Enero 2023</span>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Progreso general</h3>
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Progress value={75} className="w-full mb-2" />
                  </motion.div>
                  <p className="text-sm text-muted-foreground">75% completado</p>

                  <h4 className="font-medium mt-4 mb-2">Habilidades destacadas</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tecnología</span>
                        <span className="text-[#FFBB28]">90%</span>
                      </div>
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "90%" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="bg-[#FFBB28] h-1.5 rounded-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Matemáticas</span>
                        <span className="text-[#0088FE]">80%</span>
                      </div>
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "80%" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="bg-[#0088FE] h-1.5 rounded-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Comunicación</span>
                        <span className="text-[#FF8042]">70%</span>
                      </div>
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "70%" }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="bg-[#FF8042] h-1.5 rounded-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contenido principal */}
            <div className="md:col-span-2">
              <AnimatePresence mode="wait">
                {/* Pestaña de Información */}
                {activeTab === "info" && (
                  <motion.div key="info" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                    <TabsContent value="info" className="mt-0" forceMount>
                      <Card>
                        <CardContent className="p-6">
                          {isEditing ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-4"
                            >
                              <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1">
                                  Nombre
                                </label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                              </div>
                              <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1">
                                  Correo electrónico
                                </label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                  Cancelar
                                </Button>
                                <Button
                                  onClick={() => setIsEditing(false)}
                                  className="bg-[#FF8042] hover:bg-[#FF8042]/80"
                                >
                                  Guardar
                                </Button>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-4"
                            >
                              <h3 className="text-xl font-semibold">Acerca de mí</h3>
                              <p className="text-muted-foreground">
                                Estudiante de Ingeniería de Software apasionado por la tecnología y el aprendizaje
                                continuo. Me interesa el desarrollo web, la inteligencia artificial y la ciencia de
                                datos.
                              </p>

                              <h3 className="text-xl font-semibold mt-6">Información de contacto</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Email</p>
                                  <p>{email}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Teléfono</p>
                                  <p>+51 987 654 321</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Sitio web</p>
                                  <p>juanperez.dev</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Redes sociales</p>
                                  <p>@juanperezdev</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
                )}

                {/* Pestaña de Cursos */}
                {activeTab === "courses" && (
                  <motion.div key="courses" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                    <TabsContent value="courses" className="mt-0" forceMount>
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-4">Cursos en progreso</h3>
                          <div className="space-y-4">
                            {[
                              {
                                title: "Matemáticas Avanzadas",
                                professor: "Prof. Dr. Pablo Sánchez",
                                progress: 85,
                                color: "#0088FE",
                              },
                              {
                                title: "Introducción a la Programación",
                                professor: "Prof. Dra. Laura Gómez",
                                progress: 60,
                                color: "#00C49F",
                              },
                              {
                                title: "Historia del Arte",
                                professor: "Prof. Dr. Eduardo Torres",
                                progress: 40,
                                color: "#FF8042",
                              },
                            ].map((course, index) => (
                              <motion.div
                                key={course.title}
                                variants={itemVariants}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                className="p-4 bg-[#1a1a1a] rounded-lg"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold">{course.title}</h4>
                                    <p className="text-sm text-muted-foreground">{course.professor}</p>
                                  </div>
                                  <span className="text-sm font-medium" style={{ color: course.color }}>
                                    {course.progress}% completado
                                  </span>
                                </div>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${course.progress}%` }}
                                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                                  className="h-2 mt-2 rounded-full"
                                  style={{ backgroundColor: course.color }}
                                />
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
                )}

                {/* Pestaña de Amigos */}
                {activeTab === "friends" && (
                  <motion.div key="friends" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                    <TabsContent value="friends" className="mt-0" forceMount>
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-4">Amigos (24)</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <motion.div
                                key={i}
                                variants={itemVariants}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-col items-center"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Avatar className="w-20 h-20 mb-2">
                                  <AvatarImage src={`/placeholder.svg?height=80&width=80&text=Amigo${i + 1}`} />
                                  <AvatarFallback>A{i + 1}</AvatarFallback>
                                </Avatar>
                                <p className="font-medium text-center">Amigo {i + 1}</p>
                                <p className="text-xs text-muted-foreground text-center">Estudiante</p>
                              </motion.div>
                            ))}
                          </div>
                          <div className="mt-4 text-center">
                            <Button variant="outline">Ver todos los amigos</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
                )}

                {/* Pestaña de Fotos */}
                {activeTab === "photos" && (
                  <motion.div key="photos" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                    <TabsContent value="photos" className="mt-0" forceMount>
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-4">Fotos (12)</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Array.from({ length: 9 }).map((_, i) => (
                              <motion.div
                                key={i}
                                variants={itemVariants}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                className="aspect-square rounded-lg overflow-hidden bg-[#1a1a1a]"
                                whileHover={{ scale: 1.05, rotate: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <img
                                  src={`/placeholder.svg?height=150&width=150&text=Foto${i + 1}`}
                                  alt={`Foto ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </motion.div>
                            ))}
                          </div>
                          <div className="mt-4 text-center">
                            <Button variant="outline">Ver todas las fotos</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
