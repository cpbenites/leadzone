import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const me = await base44.auth.me();
    if (me?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { topic, lang = 'pt' } = body;

    const prompt = lang === 'pt'
      ? `Escreva um artigo de blog profissional sobre "${topic}" para uma plataforma B2B de prospecção de leads. Inclua: título, introdução, 3-4 seções com subtítulos, e conclusão. Formato Markdown.`
      : `Escribe un artículo de blog profesional sobre "${topic}" para una plataforma B2B de prospección de leads. Incluye: título, introducción, 3-4 secciones con subtítulos y conclusión. Formato Markdown.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ content: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});