// Datos de preguntas para los exámenes
// Estos datos se utilizarán para cargar las preguntas en el componente QuizInterface

// Tipo para las opciones de respuesta
type Option = {
  id: string
  text: string
  image?: string // Opcional, para preguntas con imágenes
}

// Tipo para las preguntas
export type Question = {
  id: number
  text: string
  options: Option[]
  correctAnswer: string
  skill: string // Habilidad que evalúa la pregunta (ej: "razonamiento-logico", "memoria-corto-plazo")
  type?: "multiple-choice" | "image-matrix" | "input-text" | "yes-no" // Para UI interactiva
  stimulus?: string | string[] // Para mostrar estímulos (imágenes, secuencias)
  formula?: string // Para mostrar fórmulas LaTeX
}

// Tipo para los exámenes
export type ExamData = {
  area: string
  subtopic: string
  questions: Question[]
}

// Función para convertir el texto de las preguntas en objetos estructurados
const parseQuestions = (questionsText: string): Question[] => {
  const questions: Question[] = []
  const lines = questionsText.split("\n")

  let currentQuestion: Partial<Question> = {}
  let currentOptions: Option[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Saltar líneas vacías
    if (!line) continue

    // Detectar nueva pregunta (comienza con número seguido de punto)
    if (/^\d+\./.test(line)) {
      // Guardar pregunta anterior si existe
      if (currentQuestion.text && currentOptions.length > 0 && currentQuestion.correctAnswer) {
        questions.push({
          id: questions.length + 1,
          text: currentQuestion.text,
          options: [...currentOptions],
          correctAnswer: currentQuestion.correctAnswer,
        })
      }

      // Iniciar nueva pregunta
      currentQuestion = {
        text: line.replace(/^\d+\.\s*/, ""),
      }
      currentOptions = []
    }
    // Detectar opciones (comienzan con A), B), C), D))
    else if (/^[A-D]\)/.test(line)) {
      const optionId = line[0]
      const optionText = line.replace(/^[A-D]\)\s*/, "")
      currentOptions.push({ id: optionId, text: optionText })
    }
    // Detectar respuesta correcta
    else if (line.startsWith("Respuesta:")) {
      currentQuestion.correctAnswer = line.replace("Respuesta:", "").trim()
    }
  }

  // Añadir la última pregunta
  if (currentQuestion.text && currentOptions.length > 0 && currentQuestion.correctAnswer) {
    questions.push({
      id: questions.length + 1,
      text: currentQuestion.text,
      options: [...currentOptions],
      correctAnswer: currentQuestion.correctAnswer,
    })
  }

  return questions
}

// Datos de exámenes por área y subtema
export const examData: Record<string, Record<string, Question[]>> = {
  ciencias: {
    "Física I: Mecánica Clásica": [
      {
        id: 1,
        text: "Un bloque de 2 kg es empujado sobre una superficie sin fricción con una fuerza constante de 10 N. ¿Cuál es su aceleración?",
        options: [
          { id: "A", text: "2 m/s²" },
          { id: "B", text: "3 m/s²" },
          { id: "C", text: "5 m/s²" },
          { id: "D", text: "10 m/s²" },
        ],
        correctAnswer: "C",
      },
      {
        id: 2,
        text: "Una partícula parte del reposo con aceleración constante de 5 m/s². ¿Qué distancia recorre en 4 s?",
        options: [
          { id: "A", text: "20 m" },
          { id: "B", text: "32 m" },
          { id: "C", text: "40 m" },
          { id: "D", text: "48 m" },
        ],
        correctAnswer: "C",
      },
      {
        id: 3,
        text: "Un proyectil lanzado verticalmente con velocidad inicial de 20 m/s alcanza su altura máxima. ¿Cuánto tiempo tarda en llegar a esa altura?",
        options: [
          { id: "A", text: "1 s" },
          { id: "B", text: "2 s" },
          { id: "C", text: "3 s" },
          { id: "D", text: "4 s" },
        ],
        correctAnswer: "B",
      },
      {
        id: 4,
        text: "Calcule la energía cinética de un objeto de 3 kg que se mueve a 10 m/s.",
        options: [
          { id: "A", text: "50 J" },
          { id: "B", text: "100 J" },
          { id: "C", text: "150 J" },
          { id: "D", text: "200 J" },
        ],
        correctAnswer: "C",
      },
      {
        id: 5,
        text: "Un cuerpo de 5 kg se encuentra a una altura de 10 m. ¿Cuál es su energía potencial gravitacional? (Usando g = 10 m/s²)",
        options: [
          { id: "A", text: "300 J" },
          { id: "B", text: "400 J" },
          { id: "C", text: "500 J" },
          { id: "D", text: "600 J" },
        ],
        correctAnswer: "C",
      },
      {
        id: 6,
        text: "Dos bloques de 4 kg y 6 kg, conectados por una cuerda inextensible, se mueven sobre una superficie sin fricción. Si se aplica una fuerza de 20 N al bloque de 4 kg, ¿cuál es la aceleración común del sistema?",
        options: [
          { id: "A", text: "1 m/s²" },
          { id: "B", text: "1.5 m/s²" },
          { id: "C", text: "2 m/s²" },
          { id: "D", text: "2.5 m/s²" },
        ],
        correctAnswer: "C",
      },
      {
        id: 7,
        text: "Un resorte con constante k = 200 N/m se comprime 0.1 m. ¿Cuánta energía potencial almacena?",
        options: [
          { id: "A", text: "0.5 J" },
          { id: "B", text: "1 J" },
          { id: "C", text: "1.5 J" },
          { id: "D", text: "2 J" },
        ],
        correctAnswer: "B",
      },
      {
        id: 8,
        text: "Un objeto describe un movimiento circular con velocidad angular de 5 rad/s en una trayectoria de radio 2 m. ¿Cuál es su velocidad lineal?",
        options: [
          { id: "A", text: "8 m/s" },
          { id: "B", text: "10 m/s" },
          { id: "C", text: "12 m/s" },
          { id: "D", text: "14 m/s" },
        ],
        correctAnswer: "B",
      },
      {
        id: 9,
        text: "Una polea ideal levanta una carga de 50 N; si el trabajo realizado es de 100 J, ¿a qué altura se ha levantado la carga?",
        options: [
          { id: "A", text: "1 m" },
          { id: "B", text: "2 m" },
          { id: "C", text: "3 m" },
          { id: "D", text: "4 m" },
        ],
        correctAnswer: "B",
      },
      {
        id: 10,
        text: "La ley de conservación del momentum establece que, en ausencia de fuerzas externas, el momentum total se conserva. ¿Verdadero o falso?",
        options: [
          { id: "A", text: "Verdadero" },
          { id: "B", text: "Falso" },
        ],
        correctAnswer: "A",
      },
      {
        id: 11,
        text: "En un choque elástico entre dos bolas de igual masa, ¿qué ocurre con sus velocidades?",
        options: [
          { id: "A", text: "Se anulan" },
          { id: "B", text: "Se intercambian" },
          { id: "C", text: "Se suman" },
          { id: "D", text: "Permanecen iguales" },
        ],
        correctAnswer: "B",
      },
      {
        id: 12,
        text: "Un coche acelera uniformemente de 0 a 20 m/s en 5 s. ¿Cuál es su aceleración media?",
        options: [
          { id: "A", text: "3 m/s²" },
          { id: "B", text: "4 m/s²" },
          { id: "C", text: "5 m/s²" },
          { id: "D", text: "6 m/s²" },
        ],
        correctAnswer: "B",
      },
      {
        id: 13,
        text: "La tercera ley de Newton indica que a toda acción corresponde una reacción de igual magnitud y sentido opuesto. ¿Qué implica esto en un choque?",
        options: [
          { id: "A", text: "La fuerza neta es cero" },
          { id: "B", text: "La masa de los objetos se reduce" },
          { id: "C", text: "Se conserva la energía, pero no el momentum" },
          { id: "D", text: "Se pierden calor y sonido" },
        ],
        correctAnswer: "A",
      },
      {
        id: 14,
        text: "Si un objeto en movimiento circular tiene aceleración centrípeta de 8 m/s² y se mueve a 10 m/s, ¿cuál es el radio de la trayectoria?",
        options: [
          { id: "A", text: "10 m" },
          { id: "B", text: "12.5 m" },
          { id: "C", text: "15 m" },
          { id: "D", text: "20 m" },
        ],
        correctAnswer: "B",
      },
      {
        id: 15,
        text: "En una colisión inelástica, ¿qué cantidad se conserva?",
        options: [
          { id: "A", text: "La energía cinética" },
          { id: "B", text: "El momentum" },
          { id: "C", text: "La energía potencial" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "B",
      },
      {
        id: 16,
        text: "Un objeto de 2 kg se mueve hacia el este a 4 m/s. Si se le aplica un impulso de 8 Ns hacia el norte, ¿cuál es su velocidad resultante?",
        options: [
          { id: "A", text: "4 m/s" },
          { id: "B", text: "5.66 m/s" },
          { id: "C", text: "6 m/s" },
          { id: "D", text: "7 m/s" },
        ],
        correctAnswer: "B",
      },
      {
        id: 17,
        text: "El trabajo realizado por una fuerza se define como el producto de la fuerza y el desplazamiento en la misma dirección. ¿Verdadero o falso?",
        options: [
          { id: "A", text: "Verdadero" },
          { id: "B", text: "Falso" },
        ],
        correctAnswer: "A",
      },
      {
        id: 18,
        text: "Si la velocidad de un objeto aumenta de 15 m/s a 25 m/s en 2 s, ¿cuál es su aceleración media?",
        options: [
          { id: "A", text: "3 m/s²" },
          { id: "B", text: "4 m/s²" },
          { id: "C", text: "5 m/s²" },
          { id: "D", text: "6 m/s²" },
        ],
        correctAnswer: "C",
      },
      {
        id: 19,
        text: "En un sistema sin fricción, ¿qué sucede con la energía mecánica total?",
        options: [
          { id: "A", text: "Aumenta" },
          { id: "B", text: "Disminuye" },
          { id: "C", text: "Se conserva" },
          { id: "D", text: "Se transforma en calor" },
        ],
        correctAnswer: "C",
      },
      {
        id: 20,
        text: "La inercia es la tendencia de un objeto a mantener su estado de movimiento. ¿Verdadero o falso?",
        options: [
          { id: "A", text: "Verdadero" },
          { id: "B", text: "Falso" },
        ],
        correctAnswer: "A",
      },
    ],
    "Química Orgánica": [
      {
        id: 1,
        text: "¿Qué tipo de isomería presentan el butano y el isobutano?",
        options: [
          { id: "A", text: "Isomería estructural" },
          { id: "B", text: "Isomería geométrica" },
          { id: "C", text: "Isomería óptica" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 2,
        text: "Asigne el nombre IUPAC a la molécula CH₃–CH₂–CH=CH₂.",
        options: [
          { id: "A", text: "1-buteno" },
          { id: "B", text: "2-buteno" },
          { id: "C", text: "1,3-butadieno" },
          { id: "D", text: "2-methylpropene" },
        ],
        correctAnswer: "A",
      },
      {
        id: 3,
        text: "La reacción de halogenación del metano se clasifica como:",
        options: [
          { id: "A", text: "Sustitución radicalaria" },
          { id: "B", text: "Sustitución nucleofílica" },
          { id: "C", text: "Adición" },
          { id: "D", text: "Eliminación" },
        ],
        correctAnswer: "A",
      },
      {
        id: 4,
        text: "¿Qué producto se obtiene al hidrogenar un alqueno?",
        options: [
          { id: "A", text: "Alcano" },
          { id: "B", text: "Alqueno" },
          { id: "C", text: "Alquino" },
          { id: "D", text: "Alcohol" },
        ],
        correctAnswer: "A",
      },
      {
        id: 5,
        text: "¿Qué grupo funcional caracteriza a las cetonas?",
        options: [
          { id: "A", text: "-COOH" },
          { id: "B", text: "-CHO" },
          { id: "C", text: "-CO-" },
          { id: "D", text: "-OH" },
        ],
        correctAnswer: "C",
      },
      {
        id: 6,
        text: "El ácido CH₃–COOH se nombra como:",
        options: [
          { id: "A", text: "Ácido acético" },
          { id: "B", text: "Ácido propanoico" },
          { id: "C", text: "Ácido butírico" },
          { id: "D", text: "Ácido fórmico" },
        ],
        correctAnswer: "A",
      },
      {
        id: 7,
        text: "¿Cuál de los siguientes compuestos es un isómero óptico?",
        options: [
          { id: "A", text: "2-butanol" },
          { id: "B", text: "2-chloropropane" },
          { id: "C", text: "2-bromobutano" },
          { id: "D", text: "2,3-dibromobutano" },
        ],
        correctAnswer: "D",
      },
      {
        id: 8,
        text: "El mecanismo de la reacción SN1 se caracteriza por:",
        options: [
          { id: "A", text: "Ser unimolecular y pasar por un carbocatión" },
          { id: "B", text: "Ser bimolecular en el paso determinante" },
          { id: "C", text: "Involucrar radicales libres" },
          { id: "D", text: "No formar intermediarios" },
        ],
        correctAnswer: "A",
      },
      {
        id: 9,
        text: "El benceno posee:",
        options: [
          { id: "A", text: "Una estructura lineal" },
          { id: "B", text: "Una estructura cíclica con resonancia" },
          { id: "C", text: "Dobles enlaces aislados" },
          { id: "D", text: "Una cadena ramificada" },
        ],
        correctAnswer: "B",
      },
      {
        id: 10,
        text: "La oxidación de un alcohol secundario produce principalmente:",
        options: [
          { id: "A", text: "Ácido carboxílico" },
          { id: "B", text: "Cetona" },
          { id: "C", text: "Aldehído" },
          { id: "D", text: "Alcohol primario" },
        ],
        correctAnswer: "B",
      },
      {
        id: 11,
        text: "La diferencia entre un éter y un alcohol es que:",
        options: [
          {
            id: "A",
            text: "Los éteres tienen un oxígeno unido a dos grupos alquilo; los alcoholes tienen un grupo hidroxilo.",
          },
          { id: "B", text: "Los éteres contienen un grupo -OH; los alcoholes no." },
          { id: "C", text: "Son lo mismo." },
          { id: "D", text: "Ninguna." },
        ],
        correctAnswer: "A",
      },
      {
        id: 12,
        text: "El compuesto CH₃–CH₂–NH₂ es clasificado como:",
        options: [
          { id: "A", text: "Amina" },
          { id: "B", text: "Amida" },
          { id: "C", text: "Nitrilo" },
          { id: "D", text: "Alcohol" },
        ],
        correctAnswer: "A",
      },
      {
        id: 13,
        text: "Una reacción de eliminación suele producir:",
        options: [
          { id: "A", text: "Un alqueno" },
          { id: "B", text: "Un alcohol" },
          { id: "C", text: "Un ácido carboxílico" },
          { id: "D", text: "Un éster" },
        ],
        correctAnswer: "A",
      },
      {
        id: 14,
        text: "En la hidrólisis de un éster se rompe principalmente el:",
        options: [
          { id: "A", text: "Enlace peptídico" },
          { id: "B", text: "Enlace éster" },
          { id: "C", text: "Enlace glucosídico" },
          { id: "D", text: "Enlace fosfodiéster" },
        ],
        correctAnswer: "B",
      },
      {
        id: 15,
        text: "Un compuesto con fórmula general CₙH₂ₙ₊₂ pertenece a la familia de:",
        options: [
          { id: "A", text: "Alquenos" },
          { id: "B", text: "Alcanos" },
          { id: "C", text: "Alquinos" },
          { id: "D", text: "Cicloalcanos" },
        ],
        correctAnswer: "B",
      },
      {
        id: 16,
        text: "La adición de HBr a un alqueno sigue la regla de:",
        options: [
          { id: "A", text: "Markovnikov" },
          { id: "B", text: "Anti-Markovnikov" },
          { id: "C", text: "Zaitsev" },
          { id: "D", text: "Hofmann" },
        ],
        correctAnswer: "A",
      },
      {
        id: 17,
        text: "El producto principal de la reducción de un aldehído con NaBH₄ es:",
        options: [
          { id: "A", text: "Ácido" },
          { id: "B", text: "Alcohol primario" },
          { id: "C", text: "Cetona" },
          { id: "D", text: "Éster" },
        ],
        correctAnswer: "B",
      },
      {
        id: 18,
        text: "El grupo funcional presente en CH₃–CH₂–OH es:",
        options: [
          { id: "A", text: "Aldehído" },
          { id: "B", text: "Cetona" },
          { id: "C", text: "Alcohol" },
          { id: "D", text: "Éter" },
        ],
        correctAnswer: "C",
      },
      {
        id: 19,
        text: "La sustitución nucleofílica aromática se caracteriza por:",
        options: [
          { id: "A", text: "La dificultad para sustituir un grupo en un anillo aromático sin un grupo activador." },
          { id: "B", text: "La adición de grupos a un anillo saturado." },
          { id: "C", text: "La eliminación de átomos de hidrógeno." },
          { id: "D", text: "Ninguna." },
        ],
        correctAnswer: "A",
      },
      {
        id: 20,
        text: "El compuesto CH₃–CH₂–CH₂–CH₃ pertenece a:",
        options: [
          { id: "A", text: "Alcanos" },
          { id: "B", text: "Alquenos" },
          { id: "C", text: "Alquinos" },
          { id: "D", text: "Cicloalcanos" },
        ],
        correctAnswer: "A",
      },
    ],
    "Biología Celular": [
      {
        id: 1,
        text: "¿Cuál es la función principal del retículo endoplasmático rugoso?",
        options: [
          { id: "A", text: "Síntesis de proteínas" },
          { id: "B", text: "Lipogénesis" },
          { id: "C", text: "Detoxificación" },
          { id: "D", text: "Almacenamiento de calcio" },
        ],
        correctAnswer: "A",
      },
      {
        id: 2,
        text: "La principal diferencia entre una célula animal y una vegetal es:",
        options: [
          { id: "A", text: "Presencia de pared celular en la vegetal" },
          { id: "B", text: "Presencia de núcleo en la animal" },
          { id: "C", text: "Tamaño" },
          { id: "D", text: "Número de ribosomas" },
        ],
        correctAnswer: "A",
      },
      {
        id: 3,
        text: "La mitocondria es conocida como:",
        options: [
          { id: "A", text: "La central de energía" },
          { id: "B", text: "El centro de síntesis proteica" },
          { id: "C", text: "El almacén de lípidos" },
          { id: "D", text: "El centro de control celular" },
        ],
        correctAnswer: "A",
      },
      {
        id: 4,
        text: "El aparato de Golgi se encarga principalmente de:",
        options: [
          { id: "A", text: "Modificar y empaquetar proteínas" },
          { id: "B", text: "Sintetizar proteínas" },
          { id: "C", text: "Producir ATP" },
          { id: "D", text: "Regular la mitosis" },
        ],
        correctAnswer: "A",
      },
      {
        id: 5,
        text: "La membrana plasmática permite el transporte:",
        options: [
          { id: "A", text: "Tanto activo como pasivo" },
          { id: "B", text: "Solo activo" },
          { id: "C", text: "Solo pasivo" },
          { id: "D", text: "No permite ningún transporte" },
        ],
        correctAnswer: "A",
      },
      {
        id: 6,
        text: "La difusión facilitada requiere:",
        options: [
          { id: "A", text: "Transportadores de membrana" },
          { id: "B", text: "Energía en forma de ATP" },
          { id: "C", text: "Vacuolas" },
          { id: "D", text: "Receptores hormonales" },
        ],
        correctAnswer: "A",
      },
      {
        id: 7,
        text: "Los ribosomas se asocian al retículo endoplasmático rugoso para:",
        options: [
          { id: "A", text: "Síntesis de proteínas" },
          { id: "B", text: "Almacenamiento de lípidos" },
          { id: "C", text: "Producción de ATP" },
          { id: "D", text: "Procesos de señalización" },
        ],
        correctAnswer: "A",
      },
      {
        id: 8,
        text: "El material genético (ADN) se encuentra principalmente en:",
        options: [
          { id: "A", text: "Núcleo" },
          { id: "B", text: "Citoplasma" },
          { id: "C", text: "Mitocondrias exclusivamente" },
          { id: "D", text: "Ribosomas" },
        ],
        correctAnswer: "A",
      },
      {
        id: 9,
        text: "El ciclo celular se divide en:",
        options: [
          { id: "A", text: "G1, S, G2 y M" },
          { id: "B", text: "Solo Mitosis" },
          { id: "C", text: "Interfase y Mitosis" },
          { id: "D", text: "G0 y M" },
        ],
        correctAnswer: "A",
      },
      {
        id: 10,
        text: "La mitosis es crucial porque:",
        options: [
          { id: "A", text: "Permite la división celular sin pérdida de material genético" },
          { id: "B", text: "Incrementa el tamaño celular" },
          { id: "C", text: "Es exclusiva de las células animales" },
          { id: "D", text: "Disminuye la masa celular" },
        ],
        correctAnswer: "A",
      },
      {
        id: 11,
        text: "La diferencia principal entre mitosis y meiosis es que:",
        options: [
          { id: "A", text: "La meiosis produce células hijas con la mitad del número de cromosomas" },
          { id: "B", text: "La mitosis reduce el número de cromosomas a la mitad" },
          { id: "C", text: "Ambas son idénticas" },
          { id: "D", text: "La mitosis ocurre solo en células sexuales" },
        ],
        correctAnswer: "A",
      },
      {
        id: 12,
        text: "El citoesqueleto está compuesto principalmente de:",
        options: [
          { id: "A", text: "Microtúbulos, microfilamentos y filamentos intermedios" },
          { id: "B", text: "Proteínas de membrana" },
          { id: "C", text: "Carbohidratos" },
          { id: "D", text: "Ácidos nucleicos" },
        ],
        correctAnswer: "A",
      },
      {
        id: 13,
        text: "Los ribosomas libres en el citoplasma son responsables de:",
        options: [
          { id: "A", text: "Síntesis de proteínas" },
          { id: "B", text: "Sintetizar lípidos" },
          { id: "C", text: "Regular el ciclo celular" },
          { id: "D", text: "Almacenar información genética" },
        ],
        correctAnswer: "A",
      },
      {
        id: 14,
        text: "Los lisosomas contienen enzimas que:",
        options: [
          { id: "A", text: "Realizan la digestión celular" },
          { id: "B", text: "Sintetizan proteínas" },
          { id: "C", text: "Producen energía" },
          { id: "D", text: "Transmiten señales eléctricas" },
        ],
        correctAnswer: "A",
      },
      {
        id: 15,
        text: "Los cloroplastos se encuentran únicamente en:",
        options: [
          { id: "A", text: "Células vegetales" },
          { id: "B", text: "Células animales" },
          { id: "C", text: "Todas las células" },
          { id: "D", text: "Bacterias" },
        ],
        correctAnswer: "A",
      },
      {
        id: 16,
        text: "El núcleo celular es fundamental porque contiene:",
        options: [
          { id: "A", text: "El ADN y regula la función celular" },
          { id: "B", text: "Exclusivamente ribosomas" },
          { id: "C", text: "Principalmente lípidos" },
          { id: "D", text: "Únicamente agua" },
        ],
        correctAnswer: "A",
      },
      {
        id: 17,
        text: "La apoptosis es:",
        options: [
          { id: "A", text: "Muerte celular programada" },
          { id: "B", text: "Divisiones celulares incontroladas" },
          { id: "C", text: "Un proceso de crecimiento" },
          { id: "D", text: "Una infección" },
        ],
        correctAnswer: "A",
      },
      {
        id: 18,
        text: "El transporte activo se diferencia de la difusión simple en que:",
        options: [
          { id: "A", text: "Requiere gasto de energía (ATP)" },
          { id: "B", text: "No requiere proteínas transportadoras" },
          { id: "C", text: "Siempre es más rápido" },
          { id: "D", text: "Solo ocurre en células vegetales" },
        ],
        correctAnswer: "A",
      },
      {
        id: 19,
        text: "La diferencia esencial entre células procariotas y eucariotas es:",
        options: [
          { id: "A", text: "La presencia de un núcleo definido en las eucariotas" },
          { id: "B", text: "El tamaño de la célula" },
          { id: "C", text: "La cantidad de ribosomas" },
          { id: "D", text: "La presencia de pared celular únicamente en procariotas" },
        ],
        correctAnswer: "A",
      },
      {
        id: 20,
        text: "La actividad enzimática depende del pH porque:",
        options: [
          { id: "A", text: "Cada enzima tiene un pH óptimo para funcionar" },
          { id: "B", text: "El pH no afecta a las enzimas" },
          { id: "C", text: "Solo influye en la síntesis de proteínas" },
          { id: "D", text: "Cambia únicamente la temperatura" },
        ],
        correctAnswer: "A",
      },
    ],
  },
  matematicas: {
    "Cálculo Diferencial": [
      {
        id: 1,
        text: "Determine el dominio de la función $$ f(x)=\\frac{1}{\\sqrt{x-2}} $$.",
        options: [
          { id: "A", text: "x ≥ 2" },
          { id: "B", text: "x > 2" },
          { id: "C", text: "x < 2" },
          { id: "D", text: "x ≤ 2" },
        ],
        correctAnswer: "B",
      },
      {
        id: 2,
        text: "Calcule la derivada de $$ f(x)=x^3 \\sin x $$.",
        options: [
          { id: "A", text: "3x² sin x + x³ cos x" },
          { id: "B", text: "3x² cos x + x³ sin x" },
          { id: "C", text: " x" },
          { id: "D", text: "3x² sin x" },
        ],
        correctAnswer: "A",
      },
      {
        id: 3,
        text: "La derivada de una función en un punto representa:",
        options: [
          { id: "A", text: "La pendiente de la tangente" },
          { id: "B", text: "La aceleración" },
          { id: "C", text: "El área bajo la curva" },
          { id: "D", text: "La integral" },
        ],
        correctAnswer: "A",
      },
      {
        id: 4,
        text: "Calcule $$ \\lim_{x \\to 0} \\frac{\\sin x}{x} $$.",
        options: [
          { id: "A", text: "0" },
          { id: "B", text: "1" },
          { id: "C", text: "∞" },
          { id: "D", text: "-1" },
        ],
        correctAnswer: "B",
      },
      {
        id: 5,
        text: "Sea $$ f(x)=\\ln(x²+1) $$; encuentre $$ f'(x) $$.",
        options: [
          { id: "A", text: "$$ \\frac{x}{x²+1} $$" },
          { id: "B", text: "$$ \\frac{2x}{x²+1} $$" },
          { id: "C", text: "$$ \\frac{1}{x²+1} $$" },
          { id: "D", text: "$$ \\frac{2}{x²+1} $$" },
        ],
        correctAnswer: "B",
      },
      {
        id: 6,
        text: "Para que una función sea derivable en un punto es necesario que sea:",
        options: [
          { id: "A", text: "Continua" },
          { id: "B", text: "Discontinua" },
          { id: "C", text: "Con saltos" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 7,
        text: "Aplique la regla de la cadena para derivar $$ f(x)=\\sqrt{\\cos x} $$.",
        options: [
          { id: "A", text: "$$ \\frac{\\sin x}{2\\sqrt{\\cos x}} $$" },
          { id: "B", text: "$$ -\\frac{\\sin x}{2\\sqrt{\\cos x}} $$" },
          { id: "C", text: "$$ \\frac{\\cos x}{2\\sqrt{\\cos x}} $$" },
          { id: "D", text: "$$ -\\frac{\\cos x}{2\\sqrt{\\cos x}} $$" },
        ],
        correctAnswer: "B",
      },
      {
        id: 8,
        text: "Halle la ecuación de la recta tangente a $$ f(x)=e^x $$ en $$ x=0 $$.",
        options: [
          { id: "A", text: "y=1" },
          { id: "B", text: "y=x" },
          { id: "C", text: "y=1+x" },
          { id: "D", text: "y=e^x" },
        ],
        correctAnswer: "C",
      },
      {
        id: 9,
        text: "Determine los puntos críticos de $$ f(x)=x^3-6x^2+9x $$.",
        options: [
          { id: "A", text: "x=1 y x=3" },
          { id: "B", text: "x=0 y x=3" },
          { id: "C", text: "x=1 y x=2" },
          { id: "D", text: "x=2 y x=3" },
        ],
        correctAnswer: "A",
      },
      {
        id: 10,
        text: "Determine los intervalos de crecimiento de $$ f(x)=x^4-4x^2 $$.",
        options: [
          { id: "A", text: "Crece en $$(-\\infty, -\\sqrt{2}) \\cup (\\sqrt{2}, \\infty)$$" },
          { id: "B", text: "Crece en $$(-\\infty, -\\sqrt{2}) \\cup (0, \\sqrt{2}) \\cup (\\sqrt{2}, \\infty)$$" },
          { id: "C", text: "Crece en $$(-\\sqrt{2}, \\sqrt{2})$$" },
          { id: "D", text: "Ninguna de las anteriores" },
        ],
        correctAnswer: "A",
      },
      {
        id: 11,
        text: "¿Qué indica un punto de inflexión?",
        options: [
          { id: "A", text: "Cambio de concavidad" },
          { id: "B", text: "Un máximo" },
          { id: "C", text: "Un mínimo" },
          { id: "D", text: "Un punto de discontinuidad" },
        ],
        correctAnswer: "A",
      },
      {
        id: 12,
        text: "Calcule la segunda derivada de $$ f(x)=\\frac{x^2}{x+1} $$.",
        options: [
          { id: "A", text: "$$ \\frac{2}{(x+1)^3} $$" },
          { id: "B", text: "$$ -\\frac{2}{(x+1)^3} $$" },
          { id: "C", text: "$$ \\frac{2x}{(x+1)^3} $$" },
          { id: "D", text: "$$ -\\frac{2x}{(x+1)^3} $$" },
        ],
        correctAnswer: "B",
      },
      {
        id: 13,
        text: "Determine la concavidad de $$ f(x)=\\ln x $$ en su dominio.",
        options: [
          { id: "A", text: "Cóncava hacia arriba" },
          { id: "B", text: "Cóncava hacia abajo" },
          { id: "C", text: "No presenta concavidad" },
          { id: "D", text: "Cambia de concavidad" },
        ],
        correctAnswer: "B",
      },
      {
        id: 14,
        text: "Calcule la derivada de $$ f(x)=\\arctan x $$.",
        options: [
          { id: "A", text: "$$ \\frac{1}{1+x^2} $$" },
          { id: "B", text: "$$ -\\frac{1}{1+x^2} $$" },
          { id: "C", text: "$$ \\frac{1}{x^2-1} $$" },
          { id: "D", text: "$$ \\frac{x}{1+x^2} $$" },
        ],
        correctAnswer: "A",
      },
      {
        id: 15,
        text: "Un objeto se mueve según $$ s(t)=t^3-6t^2+9t $$. Halle la velocidad en $$ t=2 $$.",
        options: [
          { id: "A", text: "3 m/s" },
          { id: "B", text: "-3 m/s" },
          { id: "C", text: "0 m/s" },
          { id: "D", text: "6 m/s" },
        ],
        correctAnswer: "B",
      },
      {
        id: 16,
        text: "Aplique la regla del cociente a $$ f(x)=\\frac{x^2}{\\sin x} $$; la derivada es:",
        options: [
          { id: "A", text: "$$ \\frac{2x \\sin x - x^2 \\cos x}{\\sin^2 x} $$" },
          { id: "B", text: "$$ \\frac{2x \\cos x - x^2 \\sin x}{\\sin^2 x} $$" },
          { id: "C", text: "$$ \\frac{2x \\sin x + x^2 \\cos x}{\\sin^2 x} $$" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 17,
        text: "Demuestre que $$ f(x)=|x| $$ no es derivable en $$ x=0 $$ porque:",
        options: [
          { id: "A", text: "Es continua" },
          { id: "B", text: "Las derivadas laterales son diferentes" },
          { id: "C", text: "Es derivable en todos los puntos" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "B",
      },
      {
        id: 18,
        text: "Calcule $$ \\lim_{x \\to \\infty} \\frac{x^2+3x}{x^2-5x} $$.",
        options: [
          { id: "A", text: "0" },
          { id: "B", text: "1" },
          { id: "C", text: "∞" },
          { id: "D", text: "3" },
        ],
        correctAnswer: "B",
      },
      {
        id: 19,
        text: "Encuentre la derivada de $$ f(x)=\\tan x $$.",
        options: [
          { id: "A", text: "$$ \\sec^2 x $$" },
          { id: "B", text: "$$ \\tan x $$" },
          { id: "C", text: "$$ 1+\\tan x $$" },
          { id: "D", text: "$$ \\cos^2 x $$" },
        ],
        correctAnswer: "A",
      },
      {
        id: 20,
        text: "Use derivadas para encontrar el valor mínimo de $$ f(x)=x^2-6x+8 $$.",
        options: [
          { id: "A", text: "(3, -1)" },
          { id: "B", text: "(2, 0)" },
          { id: "C", text: "(4, 0)" },
          { id: "D", text: "(0, 8)" },
        ],
        correctAnswer: "A",
      },
    ],
    "Álgebra Lineal": [
      {
        id: 1,
        text: "Dos vectores son linealmente dependientes si:",
        options: [
          { id: "A", text: "Uno es múltiplo del otro" },
          { id: "B", text: "Tienen la misma magnitud" },
          { id: "C", text: "Son ortogonales" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 2,
        text: "La dimensión de $$ \\mathbb{R}^3 $$ es:",
        options: [
          { id: "A", text: "1" },
          { id: "B", text: "2" },
          { id: "C", text: "3" },
          { id: "D", text: "4" },
        ],
        correctAnswer: "C",
      },
      {
        id: 3,
        text: "Los vectores (1,2,3), (2,4,6), (3,6,9) son:",
        options: [
          { id: "A", text: "Linealmente independientes" },
          { id: "B", text: "Linealmente dependientes" },
          { id: "C", text: "Ortogonales" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "B",
      },
      {
        id: 4,
        text: "El rango de una matriz es:",
        options: [
          { id: "A", text: "El número de filas" },
          { id: "B", text: "El número máximo de columnas linealmente independientes" },
          { id: "C", text: "La suma de sus elementos" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "B",
      },
      {
        id: 5,
        text: "Calcule el determinante de $$ \\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 4 & 5 \\\\ 1 & 0 & 6 \\end{pmatrix} $$.",
        options: [
          { id: "A", text: "22" },
          { id: "B", text: "20" },
          { id: "C", text: "18" },
          { id: "D", text: "24" },
        ],
        correctAnswer: "A",
      },
      {
        id: 6,
        text: "Una matriz invertible debe tener:",
        options: [
          { id: "A", text: "Determinante igual a 0" },
          { id: "B", text: "Determinante no nulo" },
          { id: "C", text: "Todas sus entradas iguales" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "B",
      },
      {
        id: 7,
        text: "La matriz $$ A=\\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix} $$ tiene inversa porque:",
        options: [
          { id: "A", text: "Su determinante es -2 (≠ 0)" },
          { id: "B", text: "Es simétrica" },
          { id: "C", text: "Todas las matrices 2x2 son invertibles" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 8,
        text: "Dos vectores son ortogonales si su producto escalar es:",
        options: [
          { id: "A", text: "0" },
          { id: "B", text: "1" },
          { id: "C", text: "-1" },
          { id: "D", text: "∞" },
        ],
        correctAnswer: "A",
      },
      {
        id: 9,
        text: "El producto escalar entre $$ \\vec{a}=(1,2) $$ y $$ \\vec{b}=(3,4) $$ es:",
        options: [
          { id: "A", text: "7" },
          { id: "B", text: "8" },
          { id: "C", text: "10" },
          { id: "D", text: "11" },
        ],
        correctAnswer: "D",
      },
      {
        id: 10,
        text: "Un sistema lineal compatible determinado es aquel que:",
        options: [
          { id: "A", text: "Tiene solución única" },
          { id: "B", text: "Tiene infinitas soluciones" },
          { id: "C", text: "No tiene solución" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 11,
        text: "Resuelva el sistema: \\begin{cases} x+y+z=6\\\\ x-y+z=2\\\\ 2x+y+3z=12 \\end{cases}",
        options: [
          { id: "A", text: "(2,2,2)" },
          { id: "B", text: "(1,2,3)" },
          { id: "C", text: "(2,3,1)" },
          { id: "D", text: "(3,2,1)" },
        ],
        correctAnswer: "A",
      },
      {
        id: 12,
        text: "Un autovalor de una matriz es:",
        options: [
          { id: "A", text: "Una constante λ que satisface $$ Av=\\lambda v $$" },
          { id: "B", text: "La inversa de la matriz" },
          { id: "C", text: "Su determinante" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 13,
        text: "La traza de $$ \\begin{pmatrix} 2 & -1 \\\\ 0 & 3 \\end{pmatrix} $$ es:",
        options: [
          { id: "A", text: "2" },
          { id: "B", text: "3" },
          { id: "C", text: "5" },
          { id: "D", text: "-1" },
        ],
        correctAnswer: "C",
      },
      {
        id: 14,
        text: "El método de Gauss-Jordan se utiliza para:",
        options: [
          { id: "A", text: "Resolver sistemas lineales" },
          { id: "B", text: "Calcular determinantes" },
          { id: "C", text: "Encontrar autovalores" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 15,
        text: "Una matriz es simétrica si:",
        options: [
          { id: "A", text: "$$ A = A^T $$" },
          { id: "B", text: "Todas sus entradas son iguales" },
          { id: "C", text: "Es diagonal" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 16,
        text: "La norma de $$ \\vec{v}=(3,4) $$ es:",
        options: [
          { id: "A", text: "3" },
          { id: "B", text: "4" },
          { id: "C", text: "5" },
          { id: "D", text: "7" },
        ],
        correctAnswer: "C",
      },
      {
        id: 17,
        text: "El espacio nulo de una matriz es:",
        options: [
          { id: "A", text: "El conjunto de soluciones de $$ Ax=0 $$" },
          { id: "B", text: "Su rango" },
          { id: "C", text: "El complemento ortogonal" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 18,
        text: "Un conjunto de vectores genera un subespacio si:",
        options: [
          { id: "A", text: "Pueden combinarse linealmente para formar cualquier vector del subespacio" },
          { id: "B", text: "Son linealmente independientes" },
          { id: "C", text: "Son ortogonales" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 19,
        text: "Una base del subespacio generado por $$ \\{(1,0,1), (2,1,3)\\} $$ es:",
        options: [
          { id: "A", text: "\\{(1,0,1), (2,1,3)\\}" },
          { id: "B", text: "\\{(1,0,1)\\}" },
          { id: "C", text: "\\{(2,1,3)\\}" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 20,
        text: "Una transformación lineal es:",
        options: [
          { id: "A", text: "Una función que preserva la suma y el producto por escalar" },
          { id: "B", text: "Una función arbitraria" },
          { id: "C", text: "Una función no lineal" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
    ],
    "Estadística y Probabilidad": [
      {
        id: 1,
        text: "Una variable aleatoria es:",
        options: [
          { id: "A", text: "Un número fijo" },
          { id: "B", text: "Una función que asigna valores numéricos a los resultados de un experimento" },
          { id: "C", text: "Una constante" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "B",
      },
      {
        id: 2,
        text: "Calcule la media de los datos: 4, 6, 8, 10.",
        options: [
          { id: "A", text: "6" },
          { id: "B", text: "7" },
          { id: "C", text: "8" },
          { id: "D", text: "9" },
        ],
        correctAnswer: "B",
      },
      {
        id: 3,
        text: "La mediana es:",
        options: [
          { id: "A", text: "El promedio de todos los datos" },
          { id: "B", text: "El valor central" },
          { id: "C", text: "El valor más frecuente" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "B",
      },
      {
        id: 4,
        text: "Calcule la moda en el conjunto: 2, 3, 3, 4, 5.",
        options: [
          { id: "A", text: "2" },
          { id: "B", text: "3" },
          { id: "C", text: "4" },
          { id: "D", text: "5" },
        ],
        correctAnswer: "B",
      },
      {
        id: 5,
        text: "La desviación estándar mide:",
        options: [
          { id: "A", text: "La dispersión de los datos" },
          { id: "B", text: "La media" },
          { id: "C", text: "La mediana" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 6,
        text: "Halle la varianza de los datos: 2, 4, 6.",
        options: [
          { id: "A", text: "2" },
          { id: "B", text: "2.67" },
          { id: "C", text: "3" },
          { id: "D", text: "4" },
        ],
        correctAnswer: "B",
      },
      {
        id: 7,
        text: "Dos eventos son mutuamente excluyentes si:",
        options: [
          { id: "A", text: "No pueden ocurrir simultáneamente" },
          { id: "B", text: "Siempre ocurren juntos" },
          { id: "C", text: "Son independientes" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 8,
        text: "En una urna con 3 bolas rojas y 2 azules, la probabilidad de extraer una roja es:",
        options: [
          { id: "A", text: "0.4" },
          { id: "B", text: "0.5" },
          { id: "C", text: "0.6" },
          { id: "D", text: "0.7" },
        ],
        correctAnswer: "C",
      },
      {
        id: 9,
        text: "La ley de los grandes números establece que:",
        options: [
          { id: "A", text: "Con pocas repeticiones se obtiene la media poblacional" },
          { id: "B", text: "Con muchas repeticiones, la media muestral se aproxima a la poblacional" },
          { id: "C", text: "No se cumple en la práctica" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "B",
      },
      {
        id: 10,
        text: "Dos eventos son independientes si:",
        options: [
          { id: "A", text: "$$ P(A \\cap B) = P(A)P(B) $$" },
          { id: "B", text: "$$ P(A \\cap B)=0 $$" },
          { id: "C", text: "$$ P(A \\cap B)=P(A)+P(B) $$" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 11,
        text: "Si $$ P(A)=0.4 $$, $$ P(B)=0.5 $$ y $$ P(A \\cap B)=0.2 $$, entonces $$ P(A \\cup B)= $$?",
        options: [
          { id: "A", text: "0.6" },
          { id: "B", text: "0.7" },
          { id: "C", text: "0.8" },
          { id: "D", text: "0.9" },
        ],
        correctAnswer: "B",
      },
      {
        id: 12,
        text: "Una distribución binomial se aplica cuando:",
        options: [
          { id: "A", text: "Se realizan ensayos independientes con dos posibles resultados" },
          { id: "B", text: "La variable es continua" },
          { id: "C", text: "La distribución es simétrica" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 13,
        text: "Al lanzar un dado, la probabilidad de obtener un número par es:",
        options: [
          { id: "A", text: "1/2" },
          { id: "B", text: "1/3" },
          { id: "C", text: "2/3" },
          { id: "D", text: "1/4" },
        ],
        correctAnswer: "A",
      },
      {
        id: 14,
        text: "Un histograma se utiliza para representar:",
        options: [
          { id: "A", text: "Datos discretos" },
          { id: "B", text: "La distribución de datos continuos" },
          { id: "C", text: "Gráficos de líneas" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "B",
      },
      {
        id: 15,
        text: "El teorema de Bayes se relaciona con:",
        options: [
          { id: "A", text: "La probabilidad condicional" },
          { id: "B", text: "La media" },
          { id: "C", text: "La varianza" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 16,
        text: "La probabilidad condicional $$ P(A|B) $$ se define como:",
        options: [
          { id: "A", text: "$$ \\frac{P(A\\cap B)}{P(B)} $$" },
          { id: "B", text: "$$ P(A)+P(B) $$" },
          { id: "C", text: "$$ P(B|A) $$" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 17,
        text: "En dos lanzamientos de una moneda, la probabilidad de obtener al menos una cara es:",
        options: [
          { id: "A", text: "1/2" },
          { id: "B", text: "3/4" },
          { id: "C", text: "1/4" },
          { id: "D", text: "1" },
        ],
        correctAnswer: "B",
      },
      {
        id: 18,
        text: "Un experimento aleatorio es aquel cuya salida:",
        options: [
          { id: "A", text: "No se puede prever con certeza" },
          { id: "B", text: "Siempre es la misma" },
          { id: "C", text: "Es controlado completamente" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
      {
        id: 19,
        text: "La distribución normal es:",
        options: [
          { id: "A", text: "Simétrica y en forma de campana" },
          { id: "B", text: "Asimétrica" },
          { id: "C", text: "Bimodal" },
          { id: "D", text: "Uniforme" },
        ],
        correctAnswer: "A",
      },
      {
        id: 20,
        text: "La diferencia entre población y muestra es:",
        options: [
          { id: "A", text: "La población es el conjunto completo y la muestra es un subconjunto" },
          { id: "B", text: "Son lo mismo" },
          { id: "C", text: "La muestra es más grande" },
          { id: "D", text: "Ninguna" },
        ],
        correctAnswer: "A",
      },
    ],
  },
  // Continúa con más áreas y subtemas...
}

// Añadir las preguntas de Humanidades/Sociales al objeto examData
examData.humanidades = {
  "Historia Universal Contemporánea": [
    {
      id: 1,
      text: "La Primera Guerra Mundial fue provocada principalmente por:",
      options: [
        { id: "A", text: "El imperialismo y complejas alianzas" },
        { id: "B", text: "La revolución industrial" },
        { id: "C", text: "El descubrimiento de América" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 2,
      text: "El Tratado de Versalles impuso sanciones a:",
      options: [
        { id: "A", text: "Alemania" },
        { id: "B", text: "Francia" },
        { id: "C", text: "Reino Unido" },
        { id: "D", text: "Italia" },
      ],
      correctAnswer: "A",
    },
    {
      id: 3,
      text: "Durante la Segunda Guerra Mundial, los países del Eje fueron:",
      options: [
        { id: "A", text: "Alemania, Italia y Japón" },
        { id: "B", text: "Alemania, Francia y Reino Unido" },
        { id: "C", text: "Japón, China y Rusia" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 4,
      text: "La Guerra Fría se caracterizó por:",
      options: [
        { id: "A", text: "Una confrontación ideológica entre EE. UU. y la URSS" },
        { id: "B", text: "Combates armados directos" },
        { id: "C", text: "Una guerra civil en Europa" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 5,
      text: "Winston Churchill fue:",
      options: [
        { id: "A", text: "Primer Ministro del Reino Unido" },
        { id: "B", text: "Presidente de EE. UU." },
        { id: "C", text: "Líder de la URSS" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 6,
      text: 'El término "Telón de Acero" se refería a:',
      options: [
        { id: "A", text: "La división entre Europa Occidental y Oriental" },
        { id: "B", text: "Una barrera física inviolable" },
        { id: "C", text: "Una política de libre comercio" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 7,
      text: "El Plan Marshall fue una iniciativa para:",
      options: [
        { id: "A", text: "Reconstruir Europa tras la Segunda Guerra Mundial" },
        { id: "B", text: "Financiar la Guerra Fría" },
        { id: "C", text: "Dividir Alemania" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 8,
      text: "El bloque comunista en Europa incluía países como:",
      options: [
        { id: "A", text: "Polonia, Hungría y Checoslovaquia" },
        { id: "B", text: "Francia, Italia y España" },
        { id: "C", text: "Reino Unido y Alemania" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 9,
      text: "La OTAN es:",
      options: [
        { id: "A", text: "Una alianza militar" },
        { id: "B", text: "Una organización económica" },
        { id: "C", text: "Un bloque comunista" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 10,
      text: "El fascismo se caracteriza por:",
      options: [
        { id: "A", text: "Autoritarismo y nacionalismo extremo" },
        { id: "B", text: "Democracia plena" },
        { id: "C", text: "Liberalismo económico" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 11,
      text: "La ONU se creó para:",
      options: [
        { id: "A", text: "Mantener la paz mundial tras la Segunda Guerra Mundial" },
        { id: "B", text: "Financiar empresas transnacionales" },
        { id: "C", text: "Dividir territorios coloniales" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 12,
      text: "La caída del Muro de Berlín en 1989 simbolizó:",
      options: [
        { id: "A", text: "El fin de la Guerra Fría" },
        { id: "B", text: "El inicio de la Segunda Guerra Mundial" },
        { id: "C", text: "La consolidación del comunismo" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 13,
      text: "La Crisis de los Misiles en 1962 involucró a:",
      options: [
        { id: "A", text: "EE. UU. y la URSS" },
        { id: "B", text: "Alemania y Francia" },
        { id: "C", text: "Reino Unido y Japón" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 14,
      text: "Nelson Mandela es reconocido por:",
      options: [
        { id: "A", text: "Luchar contra el apartheid en Sudáfrica" },
        { id: "B", text: "Ser un dictador" },
        { id: "C", text: "Liderar la Revolución Rusa" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 15,
      text: "El 11 de septiembre de 2001 fue un acontecimiento relacionado con:",
      options: [
        { id: "A", text: "Ataques terroristas en EE. UU." },
        { id: "B", text: "Una elección presidencial" },
        { id: "C", text: "Un desastre natural" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 16,
      text: "La Primavera Árabe se refiere a:",
      options: [
        { id: "A", text: "Un levantamiento popular en varios países árabes" },
        { id: "B", text: "Una festividad primaveral" },
        { id: "C", text: "Un proceso industrial" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 17,
      text: "La Revolución Cubana llevó al poder a:",
      options: [
        { id: "A", text: "Fidel Castro" },
        { id: "B", text: "Che Guevara" },
        { id: "C", text: "Fulgencio Batista" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 18,
      text: "Margaret Thatcher fue conocida como:",
      options: [
        { id: "A", text: 'La "Dama de Hierro" en el Reino Unido' },
        { id: "B", text: "Primera ministra de EE. UU." },
        { id: "C", text: "Presidenta de Francia" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 19,
      text: "La influencia de la URSS en América Latina se manifestó a través de:",
      options: [
        { id: "A", text: "Apoyos políticos y militares en algunos países" },
        { id: "B", text: "Colonización directa" },
        { id: "C", text: "Exclusivo intercambio comercial" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 20,
      text: "El internet transformó la sociedad en el siglo XXI al:",
      options: [
        { id: "A", text: "Facilitar la comunicación global" },
        { id: "B", text: "Restringir el flujo de información" },
        { id: "C", text: "Incrementar la desinformación únicamente" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
  ],
  "Filosofía Moderna": [
    {
      id: 1,
      text: "René Descartes es famoso por la frase:",
      options: [
        { id: "A", text: '"Cogito, ergo sum"' },
        { id: "B", text: '"La razón es ciega"' },
        { id: "C", text: '"Dios es amor"' },
        { id: "D", text: '"El hombre es la medida de todas las cosas"' },
      ],
      correctAnswer: "A",
    },
    {
      id: 2,
      text: "El racionalismo enfatiza:",
      options: [
        { id: "A", text: "El uso de la razón como fuente principal del conocimiento" },
        { id: "B", text: "La experiencia sensorial" },
        { id: "C", text: "La intuición sin evidencia" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 3,
      text: '¿Quién dijo "Pienso, luego existo"?',
      options: [
        { id: "A", text: "René Descartes" },
        { id: "B", text: "David Hume" },
        { id: "C", text: "Immanuel Kant" },
        { id: "D", text: "Friedrich Nietzsche" },
      ],
      correctAnswer: "A",
    },
    {
      id: 4,
      text: "David Hume criticó principalmente:",
      options: [
        { id: "A", text: "La noción de causalidad sin evidencia empírica" },
        { id: "B", text: "La teoría de la evolución" },
        { id: "C", text: "La existencia de Dios" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 5,
      text: "El núcleo del pensamiento de Kant es:",
      options: [
        { id: "A", text: 'La síntesis de la experiencia y la razón (conocida como "crítica de la razón pura")' },
        { id: "B", text: "El empirismo absoluto" },
        { id: "C", text: "El irracionalismo" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 6,
      text: "El empirismo sostiene que el conocimiento proviene principalmente de:",
      options: [
        { id: "A", text: "La experiencia sensorial" },
        { id: "B", text: "La razón innata" },
        { id: "C", text: "La revelación divina" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 7,
      text: "Friedrich Nietzsche introdujo el concepto de:",
      options: [
        { id: "A", text: "Superhombre" },
        { id: "B", text: "Tabula rasa" },
        { id: "C", text: "Contrato social" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 8,
      text: "El nihilismo es la creencia de que:",
      options: [
        { id: "A", text: "La vida no tiene un significado inherente" },
        { id: "B", text: "Todo tiene un significado predeterminado" },
        { id: "C", text: "Solo la ciencia puede dar significado" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 9,
      text: "El fundador de la fenomenología es:",
      options: [
        { id: "A", text: "Edmund Husserl" },
        { id: "B", text: "Jean-Paul Sartre" },
        { id: "C", text: "Albert Camus" },
        { id: "D", text: "Martin Heidegger" },
      ],
      correctAnswer: "A",
    },
    {
      id: 10,
      text: "El cogito cartesiano se refiere a:",
      options: [
        { id: "A", text: "La certeza de la existencia a través del pensamiento" },
        { id: "B", text: "La duda metódica sin conclusión" },
        { id: "C", text: "La fe ciega" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 11,
      text: "Karl Marx critica la sociedad capitalista principalmente por:",
      options: [
        { id: "A", text: "La explotación laboral" },
        { id: "B", text: "La igualdad absoluta" },
        { id: "C", text: "El exceso de libertad" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 12,
      text: "La dialéctica hegeliana se basa en:",
      options: [
        { id: "A", text: "Tesis, antítesis y síntesis" },
        { id: "B", text: "Solo la tesis y la antítesis" },
        { id: "C", text: "Un proceso no dialéctico" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 13,
      text: "La Ilustración promovió:",
      options: [
        { id: "A", text: "El uso de la razón y el método científico" },
        { id: "B", text: "La fe en la tradición sin cuestionarla" },
        { id: "C", text: "El autoritarismo" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 14,
      text: "Según Rousseau, el contrato social es:",
      options: [
        { id: "A", text: "Un acuerdo entre individuos para vivir en sociedad" },
        { id: "B", text: "Una imposición arbitraria del Estado" },
        { id: "C", text: "Un concepto sin relevancia práctica" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 15,
      text: "John Locke defendía que el conocimiento se basa en:",
      options: [
        { id: "A", text: "La experiencia sensorial" },
        { id: "B", text: "La revelación divina" },
        { id: "C", text: "La intuición sin evidencia" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 16,
      text: 'El concepto de "voluntad de poder" está asociado a:',
      options: [
        { id: "A", text: "Friedrich Nietzsche" },
        { id: "B", text: "Immanuel Kant" },
        { id: "C", text: "René Descartes" },
        { id: "D", text: "John Locke" },
      ],
      correctAnswer: "A",
    },
    {
      id: 17,
      text: "Jean-Paul Sartre es conocido por sus contribuciones al:",
      options: [
        { id: "A", text: "Existencialismo" },
        { id: "B", text: "Empirismo" },
        { id: "C", text: "Racionalismo" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 18,
      text: "El existencialismo se centra en:",
      options: [
        { id: "A", text: "La libertad y responsabilidad individual" },
        { id: "B", text: "La determinación social absoluta" },
        { id: "C", text: "La lógica matemática" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 19,
      text: "Martin Heidegger reflexionó sobre:",
      options: [
        { id: "A", text: "El ser y la existencia" },
        { id: "B", text: "Las matemáticas puras" },
        { id: "C", text: "La física cuántica" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 20,
      text: 'La expresión "ser-en-el-mundo" pertenece a:',
      options: [
        { id: "A", text: "Martin Heidegger" },
        { id: "B", text: "Jean-Paul Sartre" },
        { id: "C", text: "Albert Camus" },
        { id: "D", text: "David Hume" },
      ],
      correctAnswer: "A",
    },
  ],
  "Literatura Latinoamericana": [
    {
      id: 1,
      text: "¿Quién escribió *Cien años de soledad*?",
      options: [
        { id: "A", text: "Gabriel García Márquez" },
        { id: "B", text: "Julio Cortázar" },
        { id: "C", text: "Mario Vargas Llosa" },
        { id: "D", text: "Isabel Allende" },
      ],
      correctAnswer: "A",
    },
    {
      id: 2,
      text: "El realismo mágico se caracteriza por:",
      options: [
        { id: "A", text: "La fusión de elementos reales y fantásticos" },
        { id: "B", text: "Una narrativa completamente realista" },
        { id: "C", text: "Exclusivos elementos de ciencia ficción" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 3,
      text: "Julio Cortázar es conocido principalmente por:",
      options: [
        { id: "A", text: "*Rayuela*" },
        { id: "B", text: "*El túnel*" },
        { id: "C", text: "*La casa de los espíritus*" },
        { id: "D", text: "*Pedro Páramo*" },
      ],
      correctAnswer: "A",
    },
    {
      id: 4,
      text: "El poeta peruano César Vallejo es reconocido por su:",
      options: [
        { id: "A", text: "Poesía modernista y temática de exilio" },
        { id: "B", text: "Narrativa histórica" },
        { id: "C", text: "Teatro experimental" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 5,
      text: 'El "Boom Latinoamericano" se refiere al auge de la narrativa hispanoamericana en:',
      options: [
        { id: "A", text: "Los años 60 y 70" },
        { id: "B", text: "El siglo XIX" },
        { id: "C", text: "La década de 2000" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 6,
      text: "¿Quién es el autor de *Pedro Páramo*?",
      options: [
        { id: "A", text: "Juan Rulfo" },
        { id: "B", text: "Gabriel García Márquez" },
        { id: "C", text: "Julio Cortázar" },
        { id: "D", text: "Mario Vargas Llosa" },
      ],
      correctAnswer: "A",
    },
    {
      id: 7,
      text: "La obra de Pablo Neruda se distingue por:",
      options: [
        { id: "A", text: "Su lírica amorosa y compromiso político" },
        { id: "B", text: "Narraciones históricas únicamente" },
        { id: "C", text: "Prosa narrativa sin poesía" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 8,
      text: "*Ficciones* es una obra de:",
      options: [
        { id: "A", text: "Jorge Luis Borges" },
        { id: "B", text: "Julio Cortázar" },
        { id: "C", text: "Mario Vargas Llosa" },
        { id: "D", text: "Isabel Allende" },
      ],
      correctAnswer: "A",
    },
    {
      id: 9,
      text: "La literatura indigenista aborda principalmente:",
      options: [
        { id: "A", text: "La realidad y cultura de los pueblos indígenas" },
        { id: "B", text: "Temas de ciencia ficción" },
        { id: "C", text: "La modernidad urbana" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 10,
      text: "En *El túnel* se explora:",
      options: [
        { id: "A", text: "La obsesión y alienación del protagonista" },
        { id: "B", text: "La historia política" },
        { id: "C", text: "La aventura épica" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 11,
      text: "*La ciudad y los perros* es una obra de:",
      options: [
        { id: "A", text: "Mario Vargas Llosa" },
        { id: "B", text: "Gabriel García Márquez" },
        { id: "C", text: "Julio Cortázar" },
        { id: "D", text: "Isabel Allende" },
      ],
      correctAnswer: "A",
    },
    {
      id: 12,
      text: "El modernismo literario se caracteriza por:",
      options: [
        { id: "A", text: "La búsqueda de belleza y simbolismo en el lenguaje" },
        { id: "B", text: "Una narrativa estrictamente objetiva" },
        { id: "C", text: "El uso exclusivo de lenguaje técnico" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 13,
      text: "Jorge Luis Borges es reconocido por:",
      options: [
        { id: "A", text: "Sus cuentos fantásticos y laberínticos" },
        { id: "B", text: "Su poesía épica" },
        { id: "C", text: "Su prosa histórica" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 14,
      text: "La obra de Isabel Allende se caracteriza por:",
      options: [
        { id: "A", text: "Mezclar elementos históricos con lo fantástico" },
        { id: "B", text: "Un estilo realista sin toques mágicos" },
        { id: "C", text: "Narraciones de ciencia ficción" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 15,
      text: "*Cien años de soledad* es representativa del:",
      options: [
        { id: "A", text: "Realismo mágico" },
        { id: "B", text: "Naturalismo" },
        { id: "C", text: "Romanticismo" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 16,
      text: "La narrativa de José María Arguedas se centra en:",
      options: [
        { id: "A", text: "La cosmovisión andina" },
        { id: "B", text: "Temas urbanos modernos" },
        { id: "C", text: "La tecnología contemporánea" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 17,
      text: "La obra de Juan Rulfo se destaca por:",
      options: [
        { id: "A", text: "Su estilo lacónico y atmósfera melancólica" },
        { id: "B", text: "Narraciones extensas y detalladas" },
        { id: "C", text: "Temas futuristas" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 18,
      text: "El folklore es una influencia relevante en:",
      options: [
        { id: "A", text: "La obra de Horacio Quiroga" },
        { id: "B", text: "La literatura europea clásica" },
        { id: "C", text: "La ciencia ficción moderna" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 19,
      text: "El uso del lenguaje popular es característico en:",
      options: [
        { id: "A", text: "La prosa de José Donoso" },
        { id: "B", text: "La poesía barroca" },
        { id: "C", text: "Los ensayos técnicos" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 20,
      text: "La experimentación narrativa es una marca del:",
      options: [
        { id: "A", text: "Boom Latinoamericano" },
        { id: "B", text: "Realismo tradicional" },
        { id: "C", text: "Modernismo europeo" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
  ],
}

// Añadir las preguntas de Ingeniería al objeto examData
examData.ingenieria = {
  "Programación Orientada a Objetos": [
    {
      id: 1,
      text: "En POO, una clase es:",
      options: [
        { id: "A", text: "Un plano o molde para objetos" },
        { id: "B", text: "Una instancia de un objeto" },
        { id: "C", text: "Una función" },
        { id: "D", text: "Una variable global" },
      ],
      correctAnswer: "A",
    },
    {
      id: 2,
      text: "La diferencia fundamental entre una clase y un objeto es:",
      options: [
        { id: "A", text: "La clase es la definición y el objeto es una instancia" },
        { id: "B", text: "No hay diferencia" },
        { id: "C", text: "El objeto es la definición y la clase es la instancia" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 3,
      text: "La encapsulación se utiliza para:",
      options: [
        { id: "A", text: "Proteger los datos internos de una clase" },
        { id: "B", text: "Permitir el acceso libre a todas las variables" },
        { id: "C", text: "Evitar el uso de métodos" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 4,
      text: "La herencia permite:",
      options: [
        { id: "A", text: "Que una clase herede atributos y métodos de otra" },
        { id: "B", text: "Copiar el código de una función en otra sin relación" },
        { id: "C", text: "Ejecutar el mismo método sin modificaciones" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 5,
      text: "El polimorfismo en POO significa:",
      options: [
        { id: "A", text: "La capacidad de un objeto de tomar múltiples formas" },
        { id: "B", text: "La encapsulación de datos" },
        { id: "C", text: "La herencia múltiple" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 6,
      text: "El constructor en una clase se utiliza para:",
      options: [
        { id: "A", text: "Inicializar los atributos de un objeto" },
        { id: "B", text: "Destruir un objeto" },
        { id: "C", text: "Llamar a métodos privados" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 7,
      text: "Los atributos privados generalmente se denotan con:",
      options: [
        { id: "A", text: "Un guion bajo al inicio del nombre" },
        { id: "B", text: "Letras mayúsculas" },
        { id: "C", text: "Sin ningún símbolo" },
        { id: "D", text: "Un asterisco al final" },
      ],
      correctAnswer: "A",
    },
    {
      id: 8,
      text: "Una interfaz en Java se define como:",
      options: [
        { id: "A", text: "Una declaración de métodos sin implementación" },
        { id: "B", text: "Una clase con métodos abstractos y variables" },
        { id: "C", text: "Una clase normal" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 9,
      text: "La sobrecarga de métodos permite:",
      options: [
        { id: "A", text: "Definir múltiples métodos con el mismo nombre pero diferentes parámetros" },
        { id: "B", text: "Cambiar el tipo de retorno del mismo método" },
        { id: "C", text: "Utilizar métodos estáticos en lugar de instancias" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 10,
      text: "La sobreescritura de métodos ocurre cuando:",
      options: [
        { id: "A", text: "Una subclase redefine un método heredado de la superclase" },
        { id: "B", text: "Dos métodos en la misma clase tienen el mismo nombre" },
        { id: "C", text: "Se implementa un método en una interfaz" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 11,
      text: "Una instancia es:",
      options: [
        { id: "A", text: "Un objeto creado a partir de una clase" },
        { id: "B", text: "La definición de una clase" },
        { id: "C", text: "Una variable global" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 12,
      text: "Un método estático:",
      options: [
        { id: "A", text: "Pertenece a la clase en lugar de a la instancia" },
        { id: "B", text: "Pertenece a la instancia de la clase" },
        { id: "C", text: "No se puede invocar sin crear un objeto" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 13,
      text: "En Python, el método `__init__` es:",
      options: [
        { id: "A", text: "El constructor de la clase" },
        { id: "B", text: "El destructor de la clase" },
        { id: "C", text: "Un método estático" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 14,
      text: "El principio de responsabilidad única (SRP) establece que:",
      options: [
        { id: "A", text: "Una clase debe tener una única razón para cambiar" },
        { id: "B", text: "Una clase puede tener múltiples responsabilidades" },
        { id: "C", text: "Los métodos deben tener más de una función" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 15,
      text: "La programación orientada a objetos mejora la mantenibilidad porque:",
      options: [
        { id: "A", text: "Permite modularizar y reutilizar el código" },
        { id: "B", text: "Hace el código más largo y complejo" },
        { id: "C", text: "Evita el uso de estructuras de datos" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 16,
      text: "Una clase abstracta:",
      options: [
        { id: "A", text: "No puede ser instanciada directamente" },
        { id: "B", text: "Se puede instanciar normalmente" },
        { id: "C", text: "No puede tener métodos" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 17,
      text: "La composición en POO se refiere a:",
      options: [
        { id: "A", text: 'Una relación "tiene un", donde una clase contiene objetos de otras' },
        { id: "B", text: "La herencia múltiple" },
        { id: "C", text: "La sobrecarga de métodos" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 18,
      text: "El acoplamiento bajo significa que:",
      options: [
        { id: "A", text: "Las clases tienen pocas dependencias entre sí" },
        { id: "B", text: "Las clases dependen fuertemente unas de otras" },
        { id: "C", text: "Todo el código está en una sola clase" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 19,
      text: "El patrón Builder se utiliza para:",
      options: [
        { id: "A", text: "Construir objetos complejos paso a paso" },
        { id: "B", text: "Unir varias clases en una" },
        { id: "C", text: "Simplificar la herencia" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 20,
      text: "La programación orientada a objetos mejora la mantenibilidad al:",
      options: [
        { id: "A", text: "Hacer el código modular y reutilizable" },
        { id: "B", text: "Aumentar la cantidad de código repetido" },
        { id: "C", text: "Reducir la modularidad del sistema" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
  ],
  "Análisis de Estructuras": [
    {
      id: 1,
      text: "Una estructura isostática es aquella que:",
      options: [
        { id: "A", text: "Tiene tantas ecuaciones de equilibrio como incógnitas" },
        { id: "B", text: "Presenta redundancias en soportes" },
        { id: "C", text: "Es inestable" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 2,
      text: "La diferencia entre una carga puntual y una carga distribuida es que:",
      options: [
        { id: "A", text: "La carga puntual actúa en un solo punto, la distribuida a lo largo de una longitud" },
        { id: "B", text: "Son iguales en efecto" },
        { id: "C", text: "La carga puntual es mayor siempre" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 3,
      text: "Un sistema en equilibrio debe cumplir:",
      options: [
        { id: "A", text: "Que la suma de fuerzas y momentos sea cero" },
        { id: "B", text: "Que solo la suma de fuerzas sea cero" },
        { id: "C", text: "Que solo la suma de momentos sea cero" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 4,
      text: "El momento flector en una viga se calcula multiplicando la fuerza por:",
      options: [
        { id: "A", text: "La distancia al punto de aplicación" },
        { id: "B", text: "La masa" },
        { id: "C", text: "La aceleración" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 5,
      text: "Una armadura se analiza mediante:",
      options: [
        { id: "A", text: "El método de los nodos o secciones" },
        { id: "B", text: "Ecuaciones diferenciales únicamente" },
        { id: "C", text: "Métodos numéricos solo" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 6,
      text: "El método de análisis de una armadura simple es:",
      options: [
        { id: "A", text: "El método de las fuerzas" },
        { id: "B", text: "El método de la energía" },
        { id: "C", text: "El método dinámico" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 7,
      text: "Una viga biempotrada es aquella que:",
      options: [
        { id: "A", text: "Está fijamente apoyada en ambos extremos" },
        { id: "B", text: "Tiene un apoyo móvil" },
        { id: "C", text: "Solo tiene un extremo fijo" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 8,
      text: "Una estructura hiperestática es:",
      options: [
        { id: "A", text: "Aquella con redundancias en los apoyos" },
        { id: "B", text: "Una estructura isostática" },
        { id: "C", text: "Una estructura inestable" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 9,
      text: "El diagrama de cortante muestra:",
      options: [
        { id: "A", text: "La distribución de fuerzas internas que tienden a cortar la sección" },
        { id: "B", text: "La distribución de momentos únicamente" },
        { id: "C", text: "La deformación acumulada" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 10,
      text: "El diagrama de momento flector representa:",
      options: [
        { id: "A", text: "La distribución de los momentos a lo largo de la estructura" },
        { id: "B", text: "Las fuerzas resultantes" },
        { id: "C", text: "La energía potencial" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 11,
      text: "La línea elástica indica:",
      options: [
        { id: "A", text: "La deflexión vertical de una viga bajo carga" },
        { id: "B", text: "La distribución de esfuerzos" },
        { id: "C", text: "La tensión interna" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 12,
      text: "Las ecuaciones de compatibilidad aseguran:",
      options: [
        { id: "A", text: "Que las deformaciones sean coherentes en todo el sistema" },
        { id: "B", text: "Solo el equilibrio de fuerzas" },
        { id: "C", text: "El cálculo del área" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 13,
      text: "El principio de superposición se utiliza para:",
      options: [
        { id: "A", text: "Sumar los efectos individuales de cargas sobre una estructura" },
        { id: "B", text: "Restar efectos de diferentes cargas" },
        { id: "C", text: "Multiplicar las cargas" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 14,
      text: "Una carga axial actúa:",
      options: [
        { id: "A", text: "A lo largo del eje principal del elemento estructural" },
        { id: "B", text: "Perpendicular al eje" },
        { id: "C", text: "En ángulo recto respecto al eje" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 15,
      text: "El esfuerzo normal en una sección se calcula como:",
      options: [
        { id: "A", text: "La fuerza aplicada dividida por el área" },
        { id: "B", text: "La fuerza por la longitud" },
        { id: "C", text: "El momento dividido por la sección" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 16,
      text: "La rigidez estructural se refiere a:",
      options: [
        { id: "A", text: "La capacidad de una estructura para resistir deformaciones" },
        { id: "B", text: "La masa total de la estructura" },
        { id: "C", text: "La densidad del material" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 17,
      text: "Una columna es un elemento estructural que principalmente resiste:",
      options: [
        { id: "A", text: "Cargas axiales compresivas" },
        { id: "B", text: "Solo cargas laterales" },
        { id: "C", text: "Tensiones de tracción exclusivamente" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 18,
      text: "El pandeo ocurre cuando:",
      options: [
        { id: "A", text: "Una columna pierde estabilidad bajo carga compresiva" },
        { id: "B", text: "Una viga se rompe por fatiga" },
        { id: "C", text: "Un material se deforma por tracción" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 19,
      text: "Para calcular desplazamientos en estructuras se pueden utilizar:",
      options: [
        { id: "A", text: "Métodos matriciales" },
        { id: "B", text: "Solamente diagramas" },
        { id: "C", text: "Cálculos aproximados sin métodos formales" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 20,
      text: "La seguridad estructural se evalúa comparando:",
      options: [
        { id: "A", text: "La capacidad resistente de la estructura con la carga aplicada" },
        { id: "B", text: "Solo el peso de la estructura" },
        { id: "C", text: "La longitud con el ancho del elemento" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
  ],
  "Circuitos Eléctricos": [
    {
      id: 1,
      text: "Un circuito eléctrico es:",
      options: [
        { id: "A", text: "Un camino cerrado para el flujo de corriente" },
        { id: "B", text: "Una red de cables abiertos" },
        { id: "C", text: "Un sistema sin conexión" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 2,
      text: "La ley de Ohm establece que:",
      options: [
        { id: "A", text: "V = IR" },
        { id: "B", text: "V = I/R" },
        { id: "C", text: "I = VR" },
        { id: "D", text: "R = VI" },
      ],
      correctAnswer: "A",
    },
    {
      id: 3,
      text: "Un resistor se utiliza para:",
      options: [
        { id: "A", text: "Limitar la corriente" },
        { id: "B", text: "Aumentar la corriente" },
        { id: "C", text: "Almacenar energía" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 4,
      text: "La resistencia se mide en:",
      options: [
        { id: "A", text: "Ohmios (Ω)" },
        { id: "B", text: "Voltios (V)" },
        { id: "C", text: "Amperios (A)" },
        { id: "D", text: "Vatios (W)" },
      ],
      correctAnswer: "A",
    },
    {
      id: 5,
      text: "Una fuente de voltaje ideal mantiene un voltaje constante independientemente de la corriente. ¿Verdadero o falso?",
      options: [
        { id: "A", text: "Verdadero" },
        { id: "B", text: "Falso" },
      ],
      correctAnswer: "A",
    },
    {
      id: 6,
      text: "En un circuito en serie, la resistencia equivalente es:",
      options: [
        { id: "A", text: "La suma de las resistencias individuales" },
        { id: "B", text: "El producto de las resistencias" },
        { id: "C", text: "El cociente entre la mayor y la menor" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 7,
      text: "En resistencias en paralelo, la resistencia equivalente se calcula mediante:",
      options: [
        { id: "A", text: "$$ \\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\ldots $$" },
        { id: "B", text: "La suma directa de las resistencias" },
        { id: "C", text: "La multiplicación de las resistencias" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 8,
      text: "La ley de Kirchhoff de tensiones dice que:",
      options: [
        { id: "A", text: "La suma de todas las caídas de voltaje en un lazo cerrado es cero" },
        { id: "B", text: "La suma de las corrientes en un nodo es cero" },
        { id: "C", text: "La potencia total es constante" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 9,
      text: "La ley de Kirchhoff de corrientes establece que:",
      options: [
        { id: "A", text: "La suma de las corrientes que entran a un nodo es igual a la que salen" },
        { id: "B", text: "La suma de voltajes en un circuito es cero" },
        { id: "C", text: "La corriente es constante en todo el circuito" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 10,
      text: "El método de mallas se utiliza para:",
      options: [
        { id: "A", text: "Resolver circuitos mediante ecuaciones basadas en voltajes" },
        { id: "B", text: "Calcular la resistencia equivalente" },
        { id: "C", text: "Diseñar placas de circuito impreso (PCB)" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 11,
      text: "El método de nodos se utiliza para:",
      options: [
        { id: "A", text: "Resolver circuitos mediante el análisis de corrientes en nodos" },
        { id: "B", text: "Calcular la potencia total" },
        { id: "C", text: "Determinar la impedancia solamente" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 12,
      text: "Un capacitor almacena:",
      options: [
        { id: "A", text: "Energía en forma de campo eléctrico" },
        { id: "B", text: "Energía en forma de campo magnético" },
        { id: "C", text: "Energía mecánica" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 13,
      text: "Un inductor almacena energía en:",
      options: [
        { id: "A", text: "Un campo magnético" },
        { id: "B", text: "Un campo eléctrico" },
        { id: "C", text: "Forma de calor" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 14,
      text: "La energía almacenada en un capacitor se calcula como:",
      options: [
        { id: "A", text: "$$ \\frac{1}{2}CV^2 $$" },
        { id: "B", text: "$$ CV $$" },
        { id: "C", text: "$$ \\frac{1}{2}C^2V $$" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 15,
      text: "En un circuito RC, la constante de tiempo es:",
      options: [
        { id: "A", text: "$$ \\tau = RC $$" },
        { id: "B", text: "$$ \\tau = R/C $$" },
        { id: "C", text: "$$ \\tau = C/R $$" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 16,
      text: "En un circuito RLC, la impedancia depende de:",
      options: [
        { id: "A", text: "La resistencia, la inductancia y la capacitancia" },
        { id: "B", text: "Solo la resistencia" },
        { id: "C", text: "Solo la inductancia" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 17,
      text: "Un circuito en régimen transitorio es:",
      options: [
        { id: "A", text: "Aquél en el que las corrientes y voltajes varían en el tiempo" },
        { id: "B", text: "Un circuito con valores constantes" },
        { id: "C", text: "Un circuito sin capacitores" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 18,
      text: "En corriente alterna, la impedancia es:",
      options: [
        { id: "A", text: "Una generalización de la resistencia que incluye efectos reactivos" },
        { id: "B", text: "Solo la resistencia del circuito" },
        { id: "C", text: "La corriente en el circuito" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 19,
      text: "La potencia activa en un circuito de AC es:",
      options: [
        { id: "A", text: "La potencia efectivamente convertida en trabajo" },
        { id: "B", text: "La suma de todas las potencias" },
        { id: "C", text: "La energía almacenada" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 20,
      text: "La potencia reactiva en un circuito de AC se relaciona con:",
      options: [
        { id: "A", text: "La energía que oscila entre el campo eléctrico y el magnético" },
        { id: "B", text: "El trabajo realizado" },
        { id: "C", text: "La potencia perdida" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
  ],
}

// Añadir las preguntas de Medicina al objeto examData
examData.medicina = {
  "Anatomía Humana": [
    {
      id: 1,
      text: "El sistema respiratorio incluye:",
      options: [
        { id: "A", text: "Nariz, faringe, laringe, tráquea, bronquios y pulmones" },
        { id: "B", text: "Corazón, vasos y riñones" },
        { id: "C", text: "Hígado y vesícula biliar" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 2,
      text: "El corazón se encuentra ubicado en:",
      options: [
        { id: "A", text: "La cavidad torácica" },
        { id: "B", text: "La cavidad abdominal" },
        { id: "C", text: "La cavidad craneal" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 3,
      text: "El hueso más largo del cuerpo humano es:",
      options: [
        { id: "A", text: "El fémur" },
        { id: "B", text: "El húmero" },
        { id: "C", text: "La tibia" },
        { id: "D", text: "El radio" },
      ],
      correctAnswer: "A",
    },
    {
      id: 4,
      text: "La columna vertebral humana consta generalmente de:",
      options: [
        { id: "A", text: "33 vértebras" },
        { id: "B", text: "26 vértebras" },
        { id: "C", text: "24 vértebras" },
        { id: "D", text: "20 vértebras" },
      ],
      correctAnswer: "A",
    },
    {
      id: 5,
      text: "El diafragma es:",
      options: [
        { id: "A", text: "El principal músculo de la respiración" },
        { id: "B", text: "Un hueso del tórax" },
        { id: "C", text: "Una glándula" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 6,
      text: "Los músculos esqueléticos son:",
      options: [
        { id: "A", text: "Voluntarios" },
        { id: "B", text: "Involuntarios" },
        { id: "C", text: "Cardíacos" },
        { id: "D", text: "Lisos" },
      ],
      correctAnswer: "A",
    },
    {
      id: 7,
      text: "El sistema urinario está formado por:",
      options: [
        { id: "A", text: "Riñones, uréteres, vejiga y uretra" },
        { id: "B", text: "Corazón y pulmones" },
        { id: "C", text: "Intestino y estómago" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 8,
      text: "El hígado tiene como función principal:",
      options: [
        { id: "A", text: "Metabolizar sustancias y detoxificar" },
        { id: "B", text: "Bombear sangre" },
        { id: "C", text: "Conducir impulsos nerviosos" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 9,
      text: "La conexión entre el feto y la placenta se llama:",
      options: [
        { id: "A", text: "Cordón umbilical" },
        { id: "B", text: "Nervio central" },
        { id: "C", text: "Arteria umbilical" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 10,
      text: "El pulmón derecho posee:",
      options: [
        { id: "A", text: "3 lóbulos" },
        { id: "B", text: "2 lóbulos" },
        { id: "C", text: "4 lóbulos" },
        { id: "D", text: "1 lóbulo" },
      ],
      correctAnswer: "A",
    },
    {
      id: 11,
      text: "El nervio facial controla:",
      options: [
        { id: "A", text: "Los movimientos faciales" },
        { id: "B", text: "La audición" },
        { id: "C", text: "La visión" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 12,
      text: "El bazo participa en:",
      options: [
        { id: "A", text: "El sistema inmunológico y la filtración de la sangre" },
        { id: "B", text: "La digestión de grasas" },
        { id: "C", text: "La producción de hormonas" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 13,
      text: "El apéndice se ubica en:",
      options: [
        { id: "A", text: "En el flanco derecho del abdomen (área cecal)" },
        { id: "B", text: "En el lado izquierdo del abdomen" },
        { id: "C", text: "En el tórax" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 14,
      text: "La pelvis está compuesta por:",
      options: [
        { id: "A", text: "Huesos ilíacos, isquion y pubis" },
        { id: "B", text: "Solo el sacro" },
        { id: "C", text: "El fémur" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 15,
      text: "La trompa de Eustaquio conecta:",
      options: [
        { id: "A", text: "El oído medio con la faringe" },
        { id: "B", text: "El oído interno con el oído externo" },
        { id: "C", text: "La nariz con el estómago" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 16,
      text: "Los componentes de la sangre incluyen:",
      options: [
        { id: "A", text: "Glóbulos rojos, glóbulos blancos, plaquetas y plasma" },
        { id: "B", text: "Solo glóbulos rojos" },
        { id: "C", text: "Solo plaquetas" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 17,
      text: "La arteria carótida irriga:",
      options: [
        { id: "A", text: "El cerebro" },
        { id: "B", text: "Los pulmones" },
        { id: "C", text: "El hígado" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 18,
      text: "La glándula tiroides se encuentra en:",
      options: [
        { id: "A", text: "En el cuello" },
        { id: "B", text: "En el tórax" },
        { id: "C", text: "En el abdomen" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 19,
      text: "La cavidad craneal contiene:",
      options: [
        { id: "A", text: "El encéfalo" },
        { id: "B", text: "El corazón" },
        { id: "C", text: "El estómago" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 20,
      text: "El peritoneo es:",
      options: [
        { id: "A", text: "La membrana que recubre la cavidad abdominal y los órganos internos" },
        { id: "B", text: "Un músculo abdominal" },
        { id: "C", text: "Un hueso del abdomen" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
  ],
  "Fisiología Médica": [
    {
      id: 1,
      text: "La homeostasis es:",
      options: [
        { id: "A", text: "La capacidad del organismo para mantener un ambiente interno estable" },
        { id: "B", text: "Un desequilibrio permanente" },
        { id: "C", text: "Una enfermedad" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 2,
      text: "El sistema endocrino regula las funciones del cuerpo mediante:",
      options: [
        { id: "A", text: "La liberación de hormonas" },
        { id: "B", text: "La transmisión de impulsos eléctricos" },
        { id: "C", text: "La contracción muscular" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 3,
      text: "Un potencial de acción es:",
      options: [
        { id: "A", text: "Una señal eléctrica que se propaga a lo largo de una neurona" },
        { id: "B", text: "Una unión química en la sinapsis" },
        { id: "C", text: "Un proceso hormonal" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 4,
      text: "El ATP es conocido como:",
      options: [
        { id: "A", text: "La moneda de energía de la célula" },
        { id: "B", text: "Un ácido nucleico" },
        { id: "C", text: "Una proteína estructural" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 5,
      text: "La insulina regula principalmente:",
      options: [
        { id: "A", text: "Los niveles de glucosa en sangre" },
        { id: "B", text: "La presión arterial" },
        { id: "C", text: "La temperatura corporal" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 6,
      text: "La presión arterial es la fuerza que ejerce la sangre sobre:",
      options: [
        { id: "A", text: "Las paredes de las arterias" },
        { id: "B", text: "Los músculos" },
        { id: "C", text: "Las células nerviosas" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 7,
      text: "El gasto cardíaco se define como:",
      options: [
        { id: "A", text: "El volumen de sangre bombeado por el corazón por minuto" },
        { id: "B", text: "La frecuencia respiratoria" },
        { id: "C", text: "La cantidad de células sanguíneas" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 8,
      text: "La frecuencia respiratoria se refiere a:",
      options: [
        { id: "A", text: "El número de respiraciones por minuto" },
        { id: "B", text: "El volumen de aire inhalado" },
        { id: "C", text: "La fuerza del impulso respiratorio" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 9,
      text: "La hemoglobina tiene la función principal de:",
      options: [
        { id: "A", text: "Transportar oxígeno a los tejidos" },
        { id: "B", text: "Defender contra infecciones" },
        { id: "C", text: "Almacenar energía" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 10,
      text: "Las glándulas tiroideas regulan:",
      options: [
        { id: "A", text: "El metabolismo" },
        { id: "B", text: "La digestión" },
        { id: "C", text: "La circulación" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 11,
      text: "Durante la contracción muscular, el ATP se utiliza para:",
      options: [
        { id: "A", text: "Permitir el deslizamiento de los filamentos de actina y miosina" },
        { id: "B", text: "Proteger el músculo del daño" },
        { id: "C", text: "Almacenar glucógeno" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 12,
      text: "Las neuronas transmiten información mediante:",
      options: [
        { id: "A", text: "Potenciales de acción" },
        { id: "B", text: "Mensajes químicos exclusivamente" },
        { id: "C", text: "Hormonas" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 13,
      text: "El sistema nervioso simpático activa la respuesta de:",
      options: [
        { id: "A", text: "Lucha o huida" },
        { id: "B", text: "Descanso y digestión" },
        { id: "C", text: "Inhibición muscular" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 14,
      text: "La sinapsis es:",
      options: [
        { id: "A", text: "El punto de comunicación entre dos neuronas" },
        { id: "B", text: "La membrana de la neurona" },
        { id: "C", text: "El axón de la neurona" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 15,
      text: "La diuresis se refiere a:",
      options: [
        { id: "A", text: "La producción y excreción de orina" },
        { id: "B", text: "La contracción del músculo cardíaco" },
        { id: "C", text: "La digestión de los alimentos" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 16,
      text: "La aldosterona actúa principalmente en:",
      options: [
        { id: "A", text: "Los riñones para regular el equilibrio de sodio y agua" },
        { id: "B", text: "El corazón para regular la frecuencia" },
        { id: "C", text: "Los pulmones para la oxigenación" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 17,
      text: "La oxigenación tisular es:",
      options: [
        { id: "A", text: "El suministro de oxígeno a los tejidos" },
        { id: "B", text: "La eliminación de dióxido de carbono" },
        { id: "C", text: "La contracción muscular" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 18,
      text: "El pH influye en la actividad enzimática porque:",
      options: [
        { id: "A", text: "Cada enzima tiene un pH óptimo" },
        { id: "B", text: "Cambia la temperatura del medio" },
        { id: "C", text: "Modifica el volumen celular" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 19,
      text: "La regulación de la temperatura corporal se realiza principalmente a través de:",
      options: [
        { id: "A", text: "Mecanismos termorreguladores en el hipotálamo" },
        { id: "B", text: "La circulación sanguínea únicamente" },
        { id: "C", text: "La actividad muscular" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 20,
      text: "La retroalimentación negativa es un mecanismo que:",
      options: [
        { id: "A", text: "Mantiene la homeostasis al contrarrestar cambios" },
        { id: "B", text: "Aumenta la liberación de hormonas" },
        { id: "C", text: "Conduce a desequilibrios" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
  ],
  "Farmacología Básica": [
    {
      id: 1,
      text: "Un fármaco se define como:",
      options: [
        { id: "A", text: "Una sustancia que produce efectos en el organismo" },
        { id: "B", text: "Un nutriente esencial" },
        { id: "C", text: "Un pigmento inerte" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 2,
      text: "La biodisponibilidad se refiere a:",
      options: [
        { id: "A", text: "La cantidad de fármaco que llega a la circulación sistémica" },
        { id: "B", text: "La pureza del fármaco" },
        { id: "C", text: "Su sabor o aroma" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 3,
      text: "Una vía de administración es:",
      options: [
        { id: "A", text: "El método por el cual se introduce un fármaco en el organismo" },
        { id: "B", text: "El mecanismo de acción del fármaco" },
        { id: "C", text: "Su distribución en el organismo" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 4,
      text: "La farmacocinética estudia:",
      options: [
        { id: "A", text: "La absorción, distribución, metabolismo y excreción de fármacos" },
        { id: "B", text: "Los efectos terapéuticos de los fármacos" },
        { id: "C", text: "La producción industrial de fármacos" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 5,
      text: "La farmacodinamia se refiere a:",
      options: [
        { id: "A", text: "Los efectos que produce un fármaco en el organismo" },
        { id: "B", text: "La absorción del fármaco" },
        { id: "C", text: "Su eliminación" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 6,
      text: "La dosis terapéutica es:",
      options: [
        { id: "A", text: "La cantidad mínima necesaria para producir efecto sin toxicidad" },
        { id: "B", text: "La dosis letal de un fármaco" },
        { id: "C", text: "Una cantidad arbitraria" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 7,
      text: "Una reacción adversa es:",
      options: [
        { id: "A", text: "Un efecto no deseado de la administración de un fármaco" },
        { id: "B", text: "El efecto principal esperado" },
        { id: "C", text: "Una mejora en la salud" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 8,
      text: "El margen de seguridad se define como:",
      options: [
        { id: "A", text: "La diferencia entre la dosis terapéutica y la dosis tóxica" },
        { id: "B", text: "La dosis mínima efectiva" },
        { id: "C", text: "La dosis recomendada" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 9,
      text: "Un agonista es un fármaco que:",
      options: [
        { id: "A", text: "Se une a un receptor y lo activa" },
        { id: "B", text: "Bloquea el receptor" },
        { id: "C", text: "No tiene efecto sobre el receptor" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 10,
      text: "Un antagonista es:",
      options: [
        { id: "A", text: "Un fármaco que bloquea la acción de un receptor" },
        { id: "B", text: "Un estimulante del receptor" },
        { id: "C", text: "Sin efecto sobre la señalización celular" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 11,
      text: "La vida media de un fármaco es:",
      options: [
        { id: "A", text: "El tiempo que tarda en reducirse a la mitad su concentración en el organismo" },
        { id: "B", text: "La duración de su efecto terapéutico" },
        { id: "C", text: "Su fecha de caducidad" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 12,
      text: "Una interacción farmacológica ocurre cuando:",
      options: [
        { id: "A", text: "Dos o más fármacos modifican el efecto del otro" },
        { id: "B", text: "Un fármaco se inactiva completamente" },
        { id: "C", text: "Se combina un fármaco con un alimento inofensivo" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 13,
      text: "La tolerancia a un fármaco se desarrolla cuando:",
      options: [
        { id: "A", text: "Se requiere una dosis mayor para obtener el mismo efecto" },
        { id: "B", text: "La dosis necesaria disminuye con el tiempo" },
        { id: "C", text: "No se producen cambios en la sensibilidad" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 14,
      text: "El metabolismo hepático de un fármaco es:",
      options: [
        { id: "A", text: "La transformación química del fármaco en el hígado" },
        { id: "B", text: "Su absorción en el estómago" },
        { id: "C", text: "Su distribución en tejidos grasos" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 15,
      text: "La eliminación renal de un fármaco implica:",
      options: [
        { id: "A", text: "Su excreción a través de la orina" },
        { id: "B", text: "Su depósito en el hígado" },
        { id: "C", text: "Su conversión en un fármaco inactivo" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 16,
      text: "Un medicamento genérico es:",
      options: [
        { id: "A", text: "Una versión del fármaco con la misma composición y eficacia que el de marca" },
        { id: "B", text: "Un fármaco con diferente composición" },
        { id: "C", text: "Solo un suplemento dietético" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 17,
      text: "La absorción de un medicamento puede verse afectada por:",
      options: [
        { id: "A", text: "La formulación, la vía de administración y el pH del medio" },
        { id: "B", text: "Únicamente su precio" },
        { id: "C", text: "Su color y sabor" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 18,
      text: "El efecto placebo es:",
      options: [
        {
          id: "A",
          text: "Un efecto beneficioso derivado de la creencia en el tratamiento, sin una acción farmacológica real",
        },
        { id: "B", text: "La reacción adversa del fármaco" },
        { id: "C", text: "El efecto tóxico del fármaco" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 19,
      text: "Entre los antiinflamatorios se consideran:",
      options: [
        { id: "A", text: "Los AINEs (antiinflamatorios no esteroideos)" },
        { id: "B", text: "Los antibióticos" },
        { id: "C", text: "Los sedantes" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
    {
      id: 20,
      text: "Un antibiótico actúa generalmente:",
      options: [
        { id: "A", text: "Inhibiendo el crecimiento o matando bacterias" },
        { id: "B", text: "Estimulando el crecimiento bacteriano" },
        { id: "C", text: "Aumentando la cantidad de virus" },
        { id: "D", text: "Ninguna" },
      ],
      correctAnswer: "A",
    },
  ],
}

// Añadir las preguntas del Examen Diagnóstico Cognitivo-Académico
examData["cognitivo-academico"] = {
  "Diagnóstico Avanzado": [
    // Sección A: Razonamiento lógico y abstracto
    {
      id: 1,
      text: "Completa la siguiente serie numérica: 4, 9, 19, 39, ?",
      options: [
        { id: "A", text: "79" },
        { id: "B", text: "69" },
        { id: "C", text: "89" },
        { id: "D", text: "59" },
      ],
      correctAnswer: "A",
      skill: "razonamiento-logico",
      type: "multiple-choice",
    },
    {
      id: 2,
      text: "Si todos los algoritmos son procesos y algunos procesos son reversibles, ¿qué se puede concluir con certeza?",
      options: [
        { id: "A", text: "Todos los algoritmos son reversibles." },
        { id: "B", text: "Algunos algoritmos son reversibles." },
        { id: "C", text: "Ningún algoritmo es reversible." },
        { id: "D", text: "No se puede concluir nada con certeza." },
      ],
      correctAnswer: "D",
      skill: "razonamiento-logico",
      type: "multiple-choice",
    },
    {
      id: 3,
      text: "Entropía es a Termodinámica como...",
      options: [
        { id: "A", text: "Gravedad es a Mecánica Cuántica" },
        { id: "B", text: "Selección Natural es a Evolución" },
        { id: "C", text: "Variable es a Geometría" },
        { id: "D", text: "Luz es a Acústica" },
      ],
      correctAnswer: "B",
      skill: "razonamiento-abstracto",
      type: "multiple-choice",
    },
    {
      id: 4,
      text: "Selecciona la figura que completa la secuencia en la matriz.",
      stimulus: "/images/raven-matrix.png", // Ruta a la imagen de la matriz 3x3
      options: [
        { id: "A", image: "/images/raven-opt1.png" },
        { id: "B", image: "/images/raven-opt2.png" },
        { id: "C", image: "/images/raven-opt3.png" },
        { id: "D", image: "/images/raven-opt4.png" },
      ],
      correctAnswer: "C",
      skill: "razonamiento-abstracto",
      type: "image-matrix",
    },
    {
      id: 5,
      text: "Cinco investigadores (A, B, C, D, E) están en una fila. B está entre A y E. C está justo a la derecha de A. D no está en ningún extremo. ¿Quién está en el centro de la fila?",
      options: [
        { id: "A", text: "A" },
        { id: "B", text: "B" },
        { id: "C", text: "C" },
        { id: "D", text: "D" },
      ],
      correctAnswer: "A", // La fila es D, A, C, B, E
      skill: "razonamiento-logico",
      type: "multiple-choice",
    },
    {
      id: 6,
      text: "Completa la siguiente serie alfanumérica: AZ, BY, CX, ?",
      options: [
        { id: "A", text: "DW" },
        { id: "B", text: "DU" },
        { id: "C", text: "EV" },
        { id: "D", text: "DV" },
      ],
      correctAnswer: "A",
      skill: "razonamiento-logico",
      type: "multiple-choice",
    },
    {
      id: 7,
      text: "En un grafo completo con 8 nodos, ¿cuántas aristas se necesitan para conectar todos los nodos entre sí sin formar ciclos redundantes?",
      options: [
        { id: "A", text: "7" },
        { id: "B", text: "8" },
        { id: "C", text: "28" },
        { id: "D", text: "56" },
      ],
      correctAnswer: "C", // Fórmula n(n-1)/2
      skill: "razonamiento-abstracto",
      type: "multiple-choice",
    },
    {
      id: 8,
      text: "Una hoja de papel cuadrada se dobla por la mitad verticalmente, luego por la mitad horizontalmente. Se perfora un agujero en la esquina superior derecha. ¿Cómo se verá el papel al desdoblarse?",
      stimulus: "/images/paper-fold.gif", // Animación o imagen de los pliegues
      options: [
        { id: "A", image: "/images/unfold1.png" },
        { id: "B", image: "/images/unfold2.png" },
        { id: "C", image: "/images/unfold3.png" },
        { id: "D", image: "/images/unfold4.png" },
      ],
      correctAnswer: "B",
      skill: "razonamiento-espacial",
      type: "image-matrix",
    },
    // Sección B: Memoria de trabajo y atención
    {
      id: 9,
      text: "Memoriza la siguiente secuencia de dígitos. Luego, escríbela en orden inverso.",
      stimulus: "8 - 3 - 9 - 1 - 6 - 4",
      correctAnswer: "461938",
      skill: "memoria-trabajo",
      type: "input-text",
    },
    {
      id: 10,
      text: "Recuerda el número 73. Ahora, calcula: (15 * 3) + 8. Ingresa ambos resultados.",
      correctAnswer: "53,73", // resultado, número recordado
      skill: "atencion-dividida",
      type: "input-text", // Se necesitará una UI especial para dos inputs
    },
    {
      id: 11,
      text: "Presiona 'Sí' solo si un número primo aparece inmediatamente después de un número par en la siguiente secuencia: 12, 5, 8, 11, 14, 3, 20, 17",
      correctAnswer: "Sí", // 8 (par) -> 11 (primo)
      skill: "atencion-selectiva",
      type: "yes-no",
    },
    {
      id: 12,
      text: "Observa la lista de palabras. Luego, escribe la palabra que se repitió.",
      stimulus: ["Kernel", "Framework", "Middleware", "API", "Kernel", "SDK", "Runtime", "IDE"],
      correctAnswer: "Kernel",
      skill: "memoria-semantica",
      type: "input-text",
    },
    {
      id: 13,
      text: "Observa la secuencia de letras. Marca la casilla si la letra es simétrica verticalmente (ej. A, M, T).",
      stimulus: "W - R - H - O - P - Y",
      correctAnswer: "W,H,O,Y", // La UI debería manejar esto
      skill: "atencion-dividida",
      type: "multiple-choice", // Se puede adaptar
    },
    {
      id: 14,
      text: "¿Qué símbolo se encontraba en el centro del patrón?",
      stimulus: "/images/visual-memory-grid.png", // Grid 3x3 con símbolos
      options: [
        { id: "A", image: "/images/symbol1.png" },
        { id: "B", image: "/images/symbol2.png" },
        { id: "C", image: "/images/symbol3.png" },
        { id: "D", image: "/images/symbol4.png" },
      ],
      correctAnswer: "B",
      skill: "memoria-visual",
      type: "image-matrix",
    },
    // Sección C: Comprensión lectora y pensamiento numérico
    {
      id: 15,
      text: "Lee el siguiente texto sobre superposición cuántica y responde: ¿Qué implica que una partícula esté en superposición?",
      stimulus:
        "La superposición cuántica es un principio fundamental de la mecánica cuántica. Sostiene que, al igual que las ondas en la física clásica, cualquier estado cuántico puede ser descrito como una suma de dos o más estados distintos. Esto significa que una partícula, como un electrón, puede existir en múltiples estados (por ejemplo, en múltiples posiciones) simultáneamente hasta que se realiza una medición.",
      options: [
        { id: "A", text: "Que la partícula se divide en varias partes." },
        { id: "B", text: "Que existe en varios estados a la vez antes de ser medida." },
        { id: "C", text: "Que se mueve más rápido que la luz." },
        { id: "D", text: "Que su estado es siempre predecible." },
      ],
      correctAnswer: "B",
      skill: "comprension-lectora",
      type: "multiple-choice",
    },
    {
      id: 16,
      text: "Una máquina produce 150 piezas en 3 horas. ¿Cuántas piezas producirá en 8 horas si mantiene el mismo ritmo?",
      options: [
        { id: "A", text: "300" },
        { id: "B", text: "350" },
        { id: "C", text: "400" },
        { id: "D", text: "450" },
      ],
      correctAnswer: "C",
      skill: "pensamiento-numerico",
      type: "multiple-choice",
    },
    {
      id: 17,
      text: "Un préstamo de $10,000 se otorga a una tasa de interés compuesto anual del 8%. ¿Cuál será el monto total a pagar después de 2 años?",
      formula: "A = P(1 + r)^t",
      options: [
        { id: "A", text: "$11,600" },
        { id: "B", text: "$11,664" },
        { id: "C", text: "$10,800" },
        { id: "D", text: "$12,000" },
      ],
      correctAnswer: "B",
      skill: "pensamiento-numerico",
      type: "multiple-choice",
    },
  ],
}

// Función para obtener preguntas aleatorias de un examen
export const getRandomQuestions = (area: string, subtopic: string, count = 20): Question[] => {
  if (!examData[area] || !examData[area][subtopic]) {
    return []
  }

  const allQuestions = examData[area][subtopic]
  if (allQuestions.length <= count) {
    return allQuestions
  }

  // Obtener preguntas aleatorias
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
