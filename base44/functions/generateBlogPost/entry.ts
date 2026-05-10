import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function generateSlug(titulo) {
  return titulo
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80);
}

function estimateReadTime(html) {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(w => w.length > 0).length;
  return Math.max(3, Math.ceil(words / 200));
}

const TOPIC_POOLS = [
  // Prospeccion B2B
  "Cómo encontrar clientes B2B en Latinoamérica usando datos de Google Maps en 2025",
  "Prospección de ventas B2B: la guía definitiva para vendedores en LATAM",
  "5 errores fatales al prospectar clientes locales y cómo evitarlos",
  "Por qué las listas de leads compradas destrozan tu tasa de conversión",
  "Cómo mapear tu territorio de ventas y construir rutas de prospección eficientes",
  "Prospección en frío vs prospección con datos: ¿cuál genera más ventas?",
  // CRM y Embudo
  "Cómo organizar tu embudo de ventas para pequeñas empresas sin gastar una fortuna",
  "CRM visual para vendedores independientes: todo lo que necesitas saber",
  "De lead a cliente cerrado: cómo gestionar cada etapa del proceso de ventas",
  "Kanban de ventas: la herramienta que los mejores vendedores usan para cerrar más",
  // Nichos especificos
  "Cómo vender servicios de marketing digital a restaurantes locales en Latam",
  "La guía para prospectar clínicas y consultorios médicos como clientes B2B",
  "Cómo conseguir clientes para una distribuidora: estrategias de prospección local",
  "Prospección para agencias de publicidad: cómo encontrar PyMEs que necesitan marketing",
  "Cómo vender software o servicios tecnológicos a negocios locales",
  // WhatsApp y contacto
  "WhatsApp Business para ventas B2B: cómo prospectar sin ser intrusivo",
  "El primer mensaje de WhatsApp que abre puertas con cualquier negocio local",
  "Cómo construir una lista de WhatsApp con leads calificados sin comprar bases de datos",
  // SEO y Herramientas
  "LeadZone vs búsqueda manual en Google Maps: comparativa honesta para equipos de ventas",
  "Las 7 mejores herramientas de prospección B2B para el mercado latinoamericano",
  "Cómo usar Google Maps para encontrar clientes potenciales (y sus limitaciones)",
  "Automatización de prospección: cuándo usarla y cuándo el toque humano es irreemplazable",
  // Casos de uso por país
  "Prospección B2B en Colombia: dónde encontrar los mejores clientes para tu negocio",
  "Cómo prospectar en México: estrategias para vendedores en el mercado más grande de LATAM",
  "Clientes B2B en Argentina: cómo adaptarse a un mercado en constante cambio",
  "Prospección de ventas en Chile: sectores con mayor potencial en 2025",
  // Ventas y conversión
  "Cómo aumentar tu tasa de cierre de ventas con mejor calificación de leads",
  "El método BANT adaptado para vendedores latinoamericanos",
  "Cómo hacer seguimiento de prospectos sin resultar pesado ni perder la oportunidad",
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow scheduled (no user) or admin users
    let isAuthorized = false;
    try {
      const user = await base44.auth.me();
      if (user?.role === 'admin') isAuthorized = true;
    } catch {
      // No user = called from automation (service role)
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Pick a topic that hasn't been written yet
    const existing = await base44.asServiceRole.entities.BlogPost.list('-created_date', 100);
    const existingTitles = new Set(existing.map(p => p.titulo?.toLowerCase()));
    const available = TOPIC_POOLS.filter(t => !existingTitles.has(t.toLowerCase()));
    const topic = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : TOPIC_POOLS[Math.floor(Math.random() * TOPIC_POOLS.length)];

    console.log(`Generating blog post for topic: "${topic}"`);

    // Generate full article with Claude Sonnet for quality
    let article;
    try {
      article = await base44.integrations.Core.InvokeLLM({
        model: 'gemini_3_1_pro',
      prompt: `Eres un experto en ventas B2B, prospección comercial y marketing digital para Latinoamérica.
Escribe un artículo de blog COMPLETO, profesional y de alto valor sobre el siguiente tema:

"${topic}"

El artículo es para el blog de LeadZone (https://leadzone.app), una plataforma SaaS de prospección B2B que permite a vendedores encontrar clientes locales filtrando por país, estado, ciudad y nicho usando datos en tiempo real de Google Maps, con un CRM integrado y contacto directo por WhatsApp.

REQUISITOS ESTRICTOS:
1. Mínimo 1200 palabras, máximo 2000 palabras.
2. Escribe en español latinoamericano natural, sin tecnicismos innecesarios.
3. Estructura con H2 y H3, listas con <ul>/<li>, párrafos con <p>.
4. El contenido debe ser genuinamente útil, con ejemplos reales, datos contextuales y consejos accionables.
5. Integra LeadZone de forma NATURAL y no forzada, máximo 3-4 menciones como solución práctica.
6. Incluye un párrafo de introducción atractivo que enganche al lector.
7. Incluye una sección de conclusión con CTA sutil hacia LeadZone.
8. Usa únicamente HTML básico: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>. NADA de clases CSS ni atributos extra.
9. NO incluyas el título principal (H1) dentro del contenido, solo desde H2 en adelante.

Devuelve un JSON con exactamente estas claves:
- titulo: el título del artículo (puede variar ligeramente del tema propuesto para sonar más natural)
- meta_description: descripción SEO de 150-160 caracteres
- categoria: una de estas: prospeccion | ventas | crm | marketing | casos_de_uso | herramientas
- tags: array de 6-8 palabras clave SEO relevantes
- contenido_html: el cuerpo completo del artículo en HTML (sin H1, sin DOCTYPE, solo el body content)`,
      response_json_schema: {
        type: "object",
        properties: {
          titulo: { type: "string" },
          meta_description: { type: "string" },
          categoria: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          contenido_html: { type: "string" }
        },
        required: ["titulo", "meta_description", "categoria", "tags", "contenido_html"]
      }
    });
    } catch (llmErr) {
      console.error('InvokeLLM threw:', llmErr.message);
      throw llmErr;
    }



    if (!article.titulo || !article.contenido_html) {
      console.error('Full LLM response:', JSON.stringify(article).substring(0, 500));
      throw new Error('LLM returned incomplete article: missing titulo or contenido_html');
    }

    const slug = generateSlug(article.titulo);
    const readTime = estimateReadTime(article.contenido_html);

    // Check slug uniqueness
    const slugExists = existing.some(p => p.slug === slug);
    const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug;

    const post = await base44.asServiceRole.entities.BlogPost.create({
      titulo: article.titulo,
      slug: finalSlug,
      meta_description: article.meta_description,
      categoria: article.categoria || 'prospeccion',
      contenido_html: article.contenido_html,
      tags: article.tags || [],
      publicado: true,
      tiempo_lectura_min: readTime,
      autor: 'Equipo LeadZone',
    });

    console.log(`Blog post created: "${article.titulo}" (id: ${post.id})`);
    return Response.json({ success: true, post_id: post.id, titulo: article.titulo, slug: finalSlug });

  } catch (error) {
    console.error('generateBlogPost error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});