export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { fetchLeadMagnets, fetchClientes } from '@/lib/notion';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nicho,
      modeloNegocio,
      situacion,
    }: { nicho: string; modeloNegocio: string; situacion: string } = body;

    if (!nicho || !modeloNegocio || !situacion) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nicho, modeloNegocio, situacion' },
        { status: 400 }
      );
    }

    // Fetch data from Notion
    const [leadMagnets, clientes] = await Promise.all([
      fetchLeadMagnets(),
      fetchClientes(),
    ]);

    // Filter clients with testimonios
    const casosDeExito = clientes.filter((c) => c.testimonio);
    const casosRelevantes = casosDeExito.filter(
      (c) => c.nicho.toLowerCase() === nicho.toLowerCase()
    );
    // If no exact match, include all casos de éxito
    const casosParaUsar =
      casosRelevantes.length > 0 ? casosRelevantes : casosDeExito.slice(0, 5);

    const catalogoLeadMagnets = JSON.stringify(
      leadMagnets.map((lm) => ({
        palabraClave: lm.palabraClave,
        tema: lm.tema,
        descripcion: lm.descripcion,
        tipo: lm.tipo,
        cuandoEnviar: lm.cuandoEnviar,
        dirigidoA: lm.dirigidoA,
        link: lm.link,
      })),
      null,
      2
    );

    const casosTexto = casosParaUsar
      .map(
        (c) =>
          `- ${c.nombre} (${c.nicho}): ${c.profesion}. ${c.negocio}. ${
            c.testimonio ? `Testimonio: ${c.testimonio}` : 'Sin testimonio directo.'
          }`
      )
      .join('\n');

    const userMessage = `
Lead a analizar:
- Nicho: ${nicho}
- Modelo de negocio: ${modeloNegocio}
- Situación / objeción: ${situacion}

---
CATÁLOGO COMPLETO DE LEAD MAGNETS:
\`\`\`json
${catalogoLeadMagnets}
\`\`\`

---
CASOS DE ÉXITO DISPONIBLES (${casosParaUsar.length} en total, filtrados por relevancia):
${casosTexto || 'No hay casos de éxito disponibles aún.'}

---
Por favor, recomendá:
1. Qué lead magnets enviar a este lead (con el link y una razón breve para cada uno)
2. Qué casos de éxito usar como prueba social (con el nombre y por qué aplica)
3. Un mensaje sugerido de seguimiento para enviarle al lead
`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system:
        'Sos el asistente comercial de Founders BS. Según el nicho, el modelo de negocio y la situación del lead, recomendá qué lead magnets enviar y qué casos de éxito usar como prueba social. Respondé en español rioplatense, conciso y accionable.',
      messages: [{ role: 'user', content: userMessage }],
    });

    const resultado =
      message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ resultado });
  } catch (error) {
    console.error('Error in /api/sugerir:', error);
    return NextResponse.json(
      { error: 'Error al procesar la sugerencia. Revisá los logs del servidor.' },
      { status: 500 }
    );
  }
}
