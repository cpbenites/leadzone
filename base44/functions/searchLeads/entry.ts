import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { nicho, ciudad, estado, pais, pageToken } = body;

    if (!nicho || !ciudad || !estado || !pais) {
      return Response.json({ error: 'Faltan parámetros: nicho, ciudad, estado, pais' }, { status: 400 });
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'API Key de Google no configurada' }, { status: 500 });
    }

    const textQuery = `${nicho} en ${ciudad}, ${estado}, ${pais}`;

    // Fetch up to 3 pages starting from the given pageToken (or from the beginning)
    let allPlaces = [];
    let currentToken = pageToken || null;
    let nextPageToken = null;
    let isFirst = !pageToken;
    let pagesLeft = 3;

    do {
      if (currentToken) {
        await new Promise(r => setTimeout(r, 2000));
      }

      const requestBody = { textQuery, maxResultCount: 20, languageCode: 'es' };
      if (currentToken) requestBody.pageToken = currentToken;

      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.id,nextPageToken'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        if (allPlaces.length > 0) break;
        return Response.json({ error: data.error?.message || 'Error en Google Places API' }, { status: 500 });
      }

      const newPlaces = data.places || [];
      allPlaces = [...allPlaces, ...newPlaces];
      nextPageToken = data.nextPageToken || null;
      currentToken = nextPageToken;
      pagesLeft--;

      if (newPlaces.length === 0) break;

    } while (currentToken && pagesLeft > 0);

    const leads = allPlaces.map(place => ({
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

    return Response.json({ leads, total: leads.length, nextPageToken: nextPageToken || null });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});