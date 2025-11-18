export interface Nivel {
  id: string;
  name: string;
  ageRange: string;
  grades: string;
  description: string;
  image?: string;
  features: string[];
}

export const niveles: Nivel[] = [
  {
    id: 'kinder',
    name: 'Kínder',
    ageRange: '3-6 años',
    grades: 'Preescolar',
    description: 'Desarrollo integral en los primeros años, fomentando la creatividad, habilidades sociales y fundamentos académicos en un ambiente seguro y estimulante.',
    features: [
      'Aprendizaje a través del juego',
      'Desarrollo socioemocional',
      'Introducción a la lectoescritura',
      'Actividades artísticas y musicales'
    ]
  },
  {
    id: 'primaria',
    name: 'Primaria',
    ageRange: '6-12 años',
    grades: '1° a 6° grado',
    description: 'Educación primaria que construye bases sólidas en todas las áreas académicas, desarrollando pensamiento crítico y amor por el aprendizaje.',
    features: [
      'Programa académico integral',
      'Desarrollo de habilidades STEM',
      'Actividades extracurriculares',
      'Formación en valores'
    ]
  },
  {
    id: 'secundaria',
    name: 'Secundaria',
    ageRange: '12-15 años',
    grades: '1° a 3° de secundaria',
    description: 'Preparación para el futuro con un programa riguroso que desarrolla liderazgo, pensamiento independiente y excelencia académica.',
    features: [
      'Preparación para preparatoria',
      'Desarrollo de liderazgo',
      'Orientación vocacional',
      'Proyectos de investigación'
    ]
  }
];

export function getNivelById(id: string): Nivel | undefined {
  return niveles.find(nivel => nivel.id === id);
}
