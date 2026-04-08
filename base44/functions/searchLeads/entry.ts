import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { nicho, ciudad, estado, pais } = body;

    if (!nicho || !ciudad || !estado || !pais) {
      return Response.json({ error: 'Faltan parámetros: nicho, ciudad, estado, pais' }, { status: 400 });
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'API Key de Google no configurada' }, { status: 500 });
    }

    const textQuery = `${nicho} en ${ciudad}, ${estado}, ${pais}`;

    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.id'
      },
      body: JSON.stringify({ textQuery, maxResultCount: 20, languageCode: 'es' })
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data.error?.message || 'Error en Google Places API' }, { status: 500 });
    }

    const leads = (data.places || []).map(place => ({
      nombre_empresa: place.displayName?.text || 'Sin nombre',
      direccion: place.formattedAddress || 'Sin dirección',
      telefono: place.nationalPhoneNumber || '',
      rating: place.rating || null,
      place_id: place.id || '',
      ciudad,
      estado,
      pais,
      segmento: nicho
    }));

    return Response.json({ leads, total: leads.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});