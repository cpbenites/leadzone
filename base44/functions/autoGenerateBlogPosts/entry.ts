import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const TOPICS = [
  { topic: "estrategias de prospeccion B2B", categoria: "prospeccion" },
  { topic: "tecnicas de cierre de ventas", categoria: "ventas" },
  { topic: "gestion de pipeline CRM", categoria: "crm" },
  { topic: "marketing de contenidos B2B", categoria: "marketing" },
  { topic: "automatizacion de prospeccion", categoria: "herramientas" },
  { topic: "casos de uso de generacion de leads", categoria: "casos_de_uso" },
  { topic: "personalizacion en ventas B2B", categoria: "ventas" },
  { topic: "inteligencia artificial en prospeccion", categoria: "herramientas" },
];

function slugify(text, suffix) {
  const base = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 50);
  return `${base}-${suffix}`;
}

function randomSuffix() {
  return Math.random().toString(36).substring(2, 8);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow admin or service-role invocation
    let isAdmin = false;
    try {
      const user = await base44.auth.me();
      isAdmin = user?.role === 'admin';
    } catch (e) {
      // If auth fails, check if it's a service-role call (automation)
    }

    const topicData = TOPICS[Math.floor(Math.random() * TOPICS.length)];

    const results = [];

    // --- Generate Spanish article ---
    try {
      const esResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Escribe un artículo de blog profesional para una plataforma B2B de prospección de leads llamada LeadZone. El tema es: "${topicData.topic}".

Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:
{
  "titulo": "título atractivo y optimizado para SEO",
  "meta_description": "descripción de 150-160 caracteres para SEO",
  "contenido_html": "<h2>subtítulo</h2><p>contenido...</p>...<h2>Conclusión</h2><p>contenido...</p>",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "tiempo_lectura_min": 5
}

El artículo debe tener al menos 800 palabras, 3-4 secciones con subtítulos H2, párrafos en etiquetas <p>. Usa HTML válido.`,
        response_json_schema: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            meta_description: { type: "string" },
            contenido_html: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            tiempo_lectura_min: { type: "number" }
          }
        }
      });

      const slug = slugify(esResult.titulo, randomSuffix());
      await base44.asServiceRole.entities.BlogPost.create({
        titulo: esResult.titulo,
        slug: slug,
        meta_description: esResult.meta_description,
        categoria: topicData.categoria,
        contenido_html: esResult.contenido_html,
        imagen_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        autor: "Equipo LeadZone",
        tags: esResult.tags,
        tiempo_lectura_min: esResult.tiempo_lectura_min,
        publicado: true,
        idioma: "es"
      });
      results.push({ lang: "es", success: true, titulo: esResult.titulo });
    } catch (e) {
      results.push({ lang: "es", success: false, error: e.message });
    }

    // --- Generate Portuguese article ---
    try {
      const ptResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Escreva um artigo de blog profissional para uma plataforma B2B de prospecção de leads chamada LeadZone. O tema é: "${topicData.topic}".

Devolve APENAS um JSON válido com esta estrutura exata:
{
  "titulo": "título atraente e otimizado para SEO",
  "meta_description": "descrição de 150-160 caracteres para SEO",
  "contenido_html": "<h2>subtítulo</h2><p>conteúdo...</p>...<h2>Conclusão</h2><p>conteúdo...</p>",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "tiempo_lectura_min": 5
}

O artigo deve ter pelo menos 800 palavras, 3-4 seções com subtítulos H2, parágrafos em tags <p>. Use HTML válido em português.`,
        response_json_schema: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            meta_description: { type: "string" },
            contenido_html: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            tiempo_lectura_min: { type: "number" }
          }
        }
      });

      const slug = slugify(ptResult.titulo, randomSuffix());
      await base44.asServiceRole.entities.BlogPost.create({
        titulo: ptResult.titulo,
        slug: slug,
        meta_description: ptResult.meta_description,
        categoria: topicData.categoria,
        contenido_html: ptResult.contenido_html,
        imagen_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        autor: "Equipe LeadZone",
        tags: ptResult.tags,
        tiempo_lectura_min: ptResult.tiempo_lectura_min,
        publicado: true,
        idioma: "pt"
      });
      results.push({ lang: "pt", success: true, titulo: ptResult.titulo });
    } catch (e) {
      results.push({ lang: "pt", success: false, error: e.message });
    }

    return Response.json({ success: true, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});