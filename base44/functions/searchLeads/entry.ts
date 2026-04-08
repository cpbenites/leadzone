import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Query variations to get beyond the 60-result API limit
function getQueryVariations(nicho, ciudad, estado, pais) {
  const base = `${ciudad}, ${estado}, ${pais}`;
  return [
    `${nicho} en ${base}`,
    `${nicho} cerca de ${base}`,
    `mejor ${nicho} en ${base}`,
    `${nicho} popular en ${base}`,
    `${nicho} recomendado en ${base}`,
  ];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { nicho, ciudad, estado, pais, pageToken, variationIndex = 0 } = body;

    if (!nicho || !ciudad || !estado || !pais) {
      return Response.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'API Key no configurada' }, { status: 500 });
    }

    const variations = getQueryVariations(nicho, ciudad, estado, pais);
    const currentVariation = variationIndex < variations.length ? variationIndex : variations.length - 1;
    const textQuery = variations[currentVariation];

    // If we have a pageToken, add delay as Google requires
    if (pageToken) {
      await new Promise(r => setTimeout(r, 2000));
    }

    const requestBody = { textQuery, maxResultCount: 20, languageCode: 'es' };
    if (pageToken) requestBody.pageToken = pageToken;

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
      return Response.json({ error: data.error?.message || 'Error en Google Places API' }, { status: 500 });
    }

    const places = data.places || [];
    const leads = places.map(place => ({
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

    // Determine next pagination state
    let nextPageToken = data.nextPageToken || null;
    let nextVariationIndex = currentVariation;

    // If no more pages in this variation, try the next variation
    if (!nextPageToken && currentVariation < variations.length - 1) {
      nextVariationIndex = currentVariation + 1;
      // Signal frontend to use next variation (no pageToken needed)
      nextPageToken = '__next_variation__';
    }

    const hasMore = !!nextPageToken;

    return Response.json({
      leads,
      total: leads.length,
      nextPageToken: nextPageToken === '__next_variation__' ? null : nextPageToken,
      nextVariationIndex: hasMore ? nextVariationIndex : null,
      hasMore,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});