export interface Cliente {
  id: string;
  nombre: string;
  instagram: string;
  nicho: string;
  profesion: string;
  negocio: string;
  aQuienAyuda: string;
  testimonio: string;
  estado: string;
  email: string;
  noFue: boolean;
}

export interface LeadMagnet {
  id: string;
  palabraClave: string;
  tema: string;
  descripcion: string;
  link: string;
  cuandoEnviar: string;
  dirigidoA: string;
  tipo: 'Video' | 'Entregable';
}

export type Nicho =
  | 'Idiomas'
  | 'Educación & Docencia'
  | 'Psicología'
  | 'Coaching'
  | 'Salud & Nutrición'
  | 'Fitness & Deporte'
  | 'Estética & Belleza'
  | 'Marketing & Agencia'
  | 'Consultoría & Negocios'
  | 'Arquitectura & Construcción'
  | 'Finanzas & Contable'
  | 'Legal'
  | 'Arte & Creatividad'
  | 'Desarrollo & Espiritualidad'
  | 'Otros';

export const NICHOS: Nicho[] = [
  'Idiomas',
  'Educación & Docencia',
  'Psicología',
  'Coaching',
  'Salud & Nutrición',
  'Fitness & Deporte',
  'Estética & Belleza',
  'Marketing & Agencia',
  'Consultoría & Negocios',
  'Arquitectura & Construcción',
  'Finanzas & Contable',
  'Legal',
  'Arte & Creatividad',
  'Desarrollo & Espiritualidad',
  'Otros',
];
