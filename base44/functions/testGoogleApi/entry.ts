import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");

    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.nationalPhoneNumber,places.rating",
      },
      body: JSON.stringify({ textQuery: "restaurante em São Paulo", languageCode: "pt", maxResultCount: 5 }),
    });

    const data = await res.json();

    return Response.json({
      http_status: res.status,
      places_count: (data.places || []).length,
      first: data.places?.[0] || null,
      error: data.error || null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});