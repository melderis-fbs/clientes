export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const NICHOS = [
  'Idiomas','Educación & Docencia','Psicología','Coaching','Salud & Nutrición',
  'Fitness & Deporte','Estética & Belleza','Marketing & Agencia','Consultoría & Negocios',
  'Arquitectura & Construcción','Finanzas & Contable','Legal','Arte & Creatividad',
  'Desarrollo & Espiritualidad','Otros',
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: 'Sos un asistente que extrae información de clientes a partir de documentos. Devolvé únicamente un JSON válido, sin texto extra ni markdown.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64,
              },
            } as any,
            {
              type: 'text',
              text: `Extraé la información del cliente de este documento y devolvé un JSON con exactamente estas claves (dejá vacío "" si no encontrás el dato):
{
  "nombre": "nombre completo del cliente",
  "instagram": "handle o URL de instagram",
  "profesion": "profesión o cargo",
  "negocio": "descripción breve de qué hace y cómo monetiza",
  "aQuienAyuda": "a quién ayuda o público objetivo",
  "email": "email",
  "nicho": "uno de estos valores exactos: ${NICHOS.join(', ')}"
}

Devolvé SOLO el JSON, sin texto extra.`,
            },
          ],
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON — strip markdown fences if present
    const clean = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(clean);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error extracting from PDF:', error);
    return NextResponse.json(
      { error: 'No se pudo procesar el PDF', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
