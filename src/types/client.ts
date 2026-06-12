export type Nicho =
  | "Arquitectura & Construcción"
  | "Arte & Creatividad"
  | "Coaching"
  | "Consultoría & Negocios"
  | "Desarrollo & Espiritualidad"
  | "Educación & Docencia"
  | "Estética & Belleza"
  | "Finanzas & Contable"
  | "Fitness & Deporte"
  | "Idiomas"
  | "Legal"
  | "Marketing & Agencia"
  | "Otros"
  | "Psicología"
  | "Salud & Nutrición";

export interface Cliente {
  id: string;
  nombre: string;
  email: string | null;
  nicho: Nicho | null;
  profesion: string | null;
  negocio: string | null;
  aQuienAyuda: string | null;
  instagram: string | null;
  testimonio: string | null;
  casoDeExito: boolean;
}
