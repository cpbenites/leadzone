import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");

const NICHE_VARIATIONS = [
  "{nicho} em {cidade}",
  "{nicho} {cidade}",
  "{nicho} perto de {cidade}",
  "melhores {nicho} em {cidade}",
];

const PLAN_LIMITS = {
  free: 3,
  starter: 120,
  pro: 300,
  pro_max: 800,
  enterprise: 1500,
};

async function searchPlacesNew(query, pageToken = null) {
  const body = {
    textQuery: query,
    languageCode: "pt",
    maxResultCount: 20,
  };

  if (pageToken) {
    body.pageToken = pageToken;
  }

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_API_KEY,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,nextPageToken",
    },
    body: JSON.stringify(body),
  });

  return await res.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { nicho, cidade, estado, pais, pageToken, variationIndex = 0, ratingFilter = "all" } = body;

    if (!cidade || !estado || !pais) {
      return Response.json({ error: 'cidade, estado e pais são obrigatórios' }, { status: 400 });
    }

    // --- Inline search tracking ---
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const monthStr = now.toISOString().slice(0, 7);

    let plans = await base44.asServiceRole.entities.UserPlan.filter({ user_email: user.email });
    let planRecord = plans[0] || null;

    if (!planRecord) {
      planRecord = await base44.asServiceRole.entities.UserPlan.create({
        user_email: user.email,
        plan: 'free',
        searches_today: 0,
        searches_this_month: 0,
        last_search_date: todayStr,
        last_reset_month: monthStr,
      });
    }

    // Reset daily counter if new day
    if (planRecord.last_search_date !== todayStr) {
      planRecord = await base44.asServiceRole.entities.UserPlan.update(planRecord.id, {
        searches_today: 0,
        last_search_date: todayStr,
      });
    }

    // Reset monthly counter if new month
    if (planRecord.last_reset_month !== monthStr) {
      planRecord = await base44.asServiceRole.entities.UserPlan.update(planRecord.id, {
        searches_this_month: 0,
        last_reset_month: monthStr,
      });
    }

    const currentPlan = planRecord.plan || 'free';
    const isFree = currentPlan === 'free';
    const monthlyLimit = PLAN_LIMITS[currentPlan] || 3;

    // Check limits
    if (isFree) {
      if ((planRecord.searches_today || 0) >= 3) {
        return Response.json({ error: 'Límite diario alcanzado para el plan gratuito.' }, { status: 403 });
      }
    } else {
      if ((planRecord.searches_this_month || 0) >= monthlyLimit) {
        return Response.json({ error: `Límite mensual de ${monthlyLimit} búsquedas alcanzado.` }, { status: 403 });
      }
    }

    // Increment counters
    planRecord = await base44.asServiceRole.entities.UserPlan.update(planRecord.id, {
      searches_today: (planRecord.searches_today || 0) + 1,
      searches_this_month: (planRecord.searches_this_month || 0) + 1,
    });

    // --- Build Google Places query ---
    let query;
    if (nicho) {
      const variation = NICHE_VARIATIONS[variationIndex % NICHE_VARIATIONS.length];
      query = variation.replace("{nicho}", nicho).replace("{cidade}", cidade);
    } else {
      query = `empresas em ${cidade}, ${estado}`;
    }

    const placesData = await searchPlacesNew(query, pageToken || null);
    const places = placesData.places || [];
    const nextPageToken = placesData.nextPageToken || null;
    const nextVariationIndex = (variationIndex + 1) % NICHE_VARIATIONS.length;

    // Filter by rating
    let filtered = places;
    if (ratingFilter === "help") {
      filtered = places.filter(p => !p.rating || p.rating < 3.5);
    } else if (ratingFilter === "growth") {
      filtered = places.filter(p => p.rating >= 3.5 && p.rating < 4.3);
    } else if (ratingFilter === "elite") {
      filtered = places.filter(p => p.rating >= 4.3);
    }

    const leads = filtered.map(place => {
      const addrParts = (place.formattedAddress || "").split(",");
      return {
        place_id: place.id,
        nombre_empresa: place.displayName?.text || place.displayName || "",
        segmento: nicho || "Empresa",
        direccion: addrParts[0]?.trim() || place.formattedAddress,
        ciudad: cidade,
        estado: estado,
        pais: pais,
        rating: place.rating || null,
        telefono: place.nationalPhoneNumber || null,
        website: place.websiteUri || null,
        instagram: null,
      };
    });

    return Response.json({
      leads,
      nextPageToken,
      nextVariationIndex,
      hasMore: !!nextPageToken,
      plan: {
        plan: currentPlan,
        searches_today: planRecord.searches_today,
        searches_this_month: planRecord.searches_this_month,
        monthly_limit: monthlyLimit,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});