import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");

const NICHE_VARIATIONS = [
  "{nicho} em {cidade}",
  "{nicho} {cidade}",
  "{nicho} perto de {cidade}",
  "melhores {nicho} em {cidade}",
];

async function searchPlaces(query, pageToken = null) {
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&language=pt`;
  if (pageToken) url += `&pagetoken=${pageToken}`;
  const res = await fetch(url);
  return await res.json();
}

async function getPlaceDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,formatted_address,website,rating,user_ratings_total&key=${GOOGLE_API_KEY}&language=pt`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result || {};
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { nicho, cidade, estado, pais, pageToken, variationIndex = 0, deviceId, ratingFilter = "all" } = body;

    if (!cidade || !estado || !pais) {
      return Response.json({ error: 'cidade, estado e pais são obrigatórios' }, { status: 400 });
    }

    // Check & increment search count
    const trackRes = await base44.functions.invoke('trackSearch', { action: 'increment' });
    if (trackRes.data?.error) {
      return Response.json({ error: trackRes.data.error }, { status: 403 });
    }
    const planInfo = trackRes.data;

    // Build query
    let query;
    if (nicho) {
      const variation = NICHE_VARIATIONS[variationIndex % NICHE_VARIATIONS.length];
      query = variation.replace("{nicho}", nicho).replace("{cidade}", cidade);
    } else {
      query = `empresas em ${cidade}, ${estado}`;
    }

    const placesData = await searchPlaces(query, pageToken || null);
    const places = placesData.results || [];
    const nextPageToken = placesData.next_page_token || null;
    const nextVariationIndex = (variationIndex + 1) % NICHE_VARIATIONS.length;

    // Filter by rating if needed
    let filtered = places;
    if (ratingFilter === "help") {
      filtered = places.filter(p => !p.rating || p.rating < 3.5);
    } else if (ratingFilter === "growth") {
      filtered = places.filter(p => p.rating >= 3.5 && p.rating < 4.3);
    } else if (ratingFilter === "elite") {
      filtered = places.filter(p => p.rating >= 4.3);
    }

    // Map results
    const leads = filtered.map(place => {
      const addrParts = (place.formatted_address || "").split(",");
      return {
        place_id: place.place_id,
        nombre_empresa: place.name,
        segmento: nicho || "Empresa",
        direccion: addrParts[0]?.trim() || place.formatted_address,
        ciudad: cidade,
        estado: estado,
        pais: pais,
        rating: place.rating || null,
        telefono: place.formatted_phone_number || null,
        website: place.website || null,
        instagram: place.website ? `https://www.instagram.com/${place.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}` : null,
      };
    });

    const hasMore = !!nextPageToken || nextVariationIndex !== variationIndex % NICHE_VARIATIONS.length;

    return Response.json({
      leads,
      nextPageToken,
      nextVariationIndex,
      hasMore: !!nextPageToken,
      plan: planInfo,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});