"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Search, Sparkles, Trophy, Grid3X3 } from "lucide-react"

// Cursos recomendados por IA
const recommendedCourses = [
  {
    id: 1,
    title: "Inteligencia Artificial para principiantes",
    instructor: "Dr. Alan Turing",
    price: 45,
    image: "/placeholder.svg?height=400&width=600",
    description: "Aprende los fundamentos de la IA y cómo aplicarla en proyectos reales.",
    rating: 4.9,
    aiRecommendation: "Basado en tu interés en tecnología y programación",
  },
  {
    id: 2,
    title: "Composición musical digital",
    instructor: "María Rodríguez",
    price: 38,
    image: "/placeholder.svg?height=400&width=600",
    description: "Crea música profesional utilizando herramientas digitales modernas.",
    rating: 4.7,
    aiRecommendation: "Basado en tu actividad reciente en cursos de música",
  },
  {
    id: 3,
    title: "Análisis de datos con Python",
    instructor: "Carlos Vega",
    price: 55,
    image: "/placeholder.svg?height=400&width=600",
    description: "Domina las técnicas de análisis de datos utilizando Python y sus bibliotecas.",
    rating: 4.8,
    aiRecommendation: "Complementa tus habilidades en matemáticas y programación",
  },
  {
    id: 4,
    title: "Oratoria avanzada",
    instructor: "Laura Gómez",
    price: 35,
    image: "/placeholder.svg?height=400&width=600",
    description: "Mejora tus habilidades de comunicación y presentación en público.",
    rating: 4.6,
    aiRecommendation: "Potenciará tu perfil profesional según tu historial",
  },
]

// Cursos mejor puntuados
const topRatedCourses = [
  {
    id: 5,
    title: "Masterclass de cocina internacional",
    instructor: "Chef Antonio Martínez",
    price: 60,
    image: "/placeholder.svg?height=400&width=600",
    description: "Aprende a preparar platos de diferentes culturas con técnicas profesionales.",
    rating: 5.0,
  },
  {
    id: 6,
    title: "Física cuántica explicada",
    instructor: "Dra. Elena Sánchez",
    price: 50,
    image: "/placeholder.svg?height=400&width=600",
    description: "Comprende los principios fundamentales de la física cuántica de forma accesible.",
    rating: 4.9,
  },
  {
    id: 7,
    title: "Fotografía profesional",
    instructor: "Roberto Díaz",
    price: 42,
    image: "/placeholder.svg?height=400&width=600",
    description: "Domina tu cámara y aprende técnicas de composición y edición fotográfica.",
    rating: 4.9,
  },
  {
    id: 8,
    title: "Desarrollo personal y liderazgo",
    instructor: "Ana Martín",
    price: 48,
    image: "/placeholder.svg?height=400&width=600",
    description: "Potencia tus habilidades de liderazgo y gestión emocional.",
    rating: 4.8,
  },
]

// Categorías de cursos
const courseCategories = [
  {
    category: "Música",
    courses: [
      {
        id: 9,
        title: "Curso de música",
        instructor: "Juanito Perez",
        price: 40,
        image: "/placeholder.svg?height=400&width=600",
        description: "Aprende teoría musical, composición y producción musical desde cero.",
        rating: 4.8,
      },
      {
        id: 10,
        title: "Piano para principiantes",
        instructor: "Sofia Reyes",
        price: 35,
        image: "/placeholder.svg?height=400&width=600",
        description: "Aprende a tocar el piano desde cero con técnicas efectivas.",
        rating: 4.7,
      },
    ],
  },
  {
    category: "Matemáticas",
    courses: [
      {
        id: 11,
        title: "Curso de matemática",
        instructor: "Daniel Carrión",
        price: 50,
        image: "/placeholder.svg?height=400&width=600",
        description: "Domina el álgebra, cálculo y estadística con ejercicios prácticos.",
        rating: 4.9,
      },
      {
        id: 12,
        title: "Estadística aplicada",
        instructor: "Marta Jiménez",
        price: 45,
        image: "/placeholder.svg?height=400&width=600",
        description: "Aprende a analizar datos y tomar decisiones basadas en estadísticas.",
        rating: 4.6,
      },
    ],
  },
  {
    category: "Comunicación",
    courses: [
      {
        id: 13,
        title: "Curso de oratoria",
        instructor: "J.E. Warrior",
        price: 30,
        image: "/placeholder.svg?height=400&width=600",
        description: "Mejora tus habilidades de comunicación y presentación en público.",
        rating: 4.7,
      },
      {
        id: 14,
        title: "Escritura creativa",
        instructor: "Gabriel García",
        price: 32,
        image: "/placeholder.svg?height=400&width=600",
        description: "Desarrolla tu estilo literario y aprende técnicas narrativas.",
        rating: 4.5,
      },
    ],
  },
  {
    category: "Cocina",
    courses: [
      {
        id: 15,
        title: "Curso de gastronomía",
        instructor: "Gordon Ramsay",
        price: 60,
        image: "/placeholder.svg?height=400&width=600",
        description: "Aprende técnicas culinarias profesionales y recetas internacionales.",
        rating: 5.0,
      },
      {
        id: 16,
        title: "Repostería avanzada",
        instructor: "María Luisa Torres",
        price: 55,
        image: "/placeholder.svg?height=400&width=600",
        description: "Domina el arte de la pastelería con técnicas profesionales.",
        rating: 4.9,
      },
    ],
  },
  {
    category: "Arte",
    courses: [
      {
        id: 17,
        title: "Pintura al óleo",
        instructor: "Pablo Mendoza",
        price: 38,
        image: "/placeholder.svg?height=400&width=600",
        description: "Aprende técnicas de pintura al óleo desde lo básico hasta lo avanzado.",
        rating: 4.6,
      },
      {
        id: 18,
        title: "Dibujo digital",
        instructor: "Carla Sánchez",
        price: 42,
        image: "/placeholder.svg?height=400&width=600",
        description: "Crea ilustraciones digitales profesionales con las últimas herramientas.",
        rating: 4.8,
      },
    ],
  },
]

export function CourseList() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? "text-[#FF8042] fill-[#FF8042]" : "text-gray-600"}`}
        />
      ))
  }

  // Filtrar cursos por término de búsqueda
  const filterCourses = (courses) => {
    if (!searchTerm) return courses
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Renderizar cursos
  const renderCourseCard = (course) => (
    <Card
      key={course.id}
      className="overflow-hidden border border-[#43E0E0]/20 bg-[#001A1A]/60 backdrop-blur-sm transition-colors hover:border-[#43E0E0]/40"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001A1A] to-transparent opacity-60" />
        {course.aiRecommendation && (
          <div className="absolute top-2 right-2 bg-[#7f00b2] text-white text-xs py-1 px-2 rounded-full flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            Recomendado
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 text-white">{course.title}</h3>
        <p className="text-sm text-[#43E0E0] mb-2">Por: {course.instructor}</p>
        <div className="flex items-center mb-2">
          {renderStars(course.rating)}
          <span className="ml-2 text-sm text-gray-400">{course.rating.toFixed(1)}</span>
        </div>
        <p className="text-sm mb-4 text-gray-400 line-clamp-2">{course.description}</p>
        {course.aiRecommendation && <p className="text-xs text-[#7f00b2] mb-3 italic">{course.aiRecommendation}</p>}
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#4AE54A]">${course.price}</span>
          <Button
            onClick={() => setSelectedCourse(course)}
            className="bg-[#0088FE] text-[#001A1A] hover:bg-[#00C49F] transition-colors duration-300"
          >
            Inscribirse
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="relative p-4 md:p-8">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001A1A] to-[#003333] animate-gradient-slow" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white">Cursos Disponibles</h1>

          {/* Barra de búsqueda */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              type="search"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#171a4a]/60 border-[#2f2c79] text-white placeholder-gray-400 focus:ring-[#7f00b2] focus:ring-2 w-full"
            />
          </div>
        </div>

        {/* Pestañas de navegación */}
        <Tabs defaultValue="recommended" className="w-full mb-6">
          <TabsList className="bg-[#171a4a]/60 border border-[#2f2c79] p-1 mb-6">
            <TabsTrigger
              value="recommended"
              className="data-[state=active]:bg-[#7f00b2] data-[state=active]:text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Recomendados
            </TabsTrigger>
            <TabsTrigger value="topRated" className="data-[state=active]:bg-[#7f00b2] data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" />
              Mejor puntuados
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-[#7f00b2] data-[state=active]:text-white">
              <Grid3X3 className="w-4 h-4 mr-2" />
              Por categorías
            </TabsTrigger>
          </TabsList>

          {/* Contenido de las pestañas */}
          <TabsContent value="recommended">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterCourses(recommendedCourses).map(renderCourseCard)}
            </div>
          </TabsContent>

          <TabsContent value="topRated">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterCourses(topRatedCourses).map(renderCourseCard)}
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "Todas" ? "default" : "outline"}
                  className={selectedCategory === "Todas" ? "bg-[#7f00b2]" : ""}
                  onClick={() => setSelectedCategory("Todas")}
                >
                  Todas
                </Button>
                {courseCategories.map((category) => (
                  <Button
                    key={category.category}
                    variant={selectedCategory === category.category ? "default" : "outline"}
                    className={selectedCategory === category.category ? "bg-[#7f00b2]" : ""}
                    onClick={() => setSelectedCategory(category.category)}
                  >
                    {category.category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {selectedCategory === "Todas"
                ? courseCategories.map((category) => (
                    <div key={category.category}>
                      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                        <span className="w-2 h-6 bg-[#7f00b2] mr-2 rounded-sm"></span>
                        {category.category}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filterCourses(category.courses).map(renderCourseCard)}
                      </div>
                    </div>
                  ))
                : courseCategories
                    .filter((category) => category.category === selectedCategory)
                    .map((category) => (
                      <div key={category.category}>
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                          <span className="w-2 h-6 bg-[#7f00b2] mr-2 rounded-sm"></span>
                          {category.category}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {filterCourses(category.courses).map(renderCourseCard)}
                        </div>
                      </div>
                    ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
