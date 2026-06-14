import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");
    const query = "restaurante em São Paulo";
    
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&language=pt`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    return Response.json({ 
      status: data.status,
      error_message: data.error_message,
      results_count: (data.results || []).length,
      first_result: data.results?.[0] || null,
      key_length: GOOGLE_API_KEY?.length || 0
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});