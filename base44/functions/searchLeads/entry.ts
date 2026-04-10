import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const PLAN_LIMITS = {
  free:       { daily: 3,    monthly: null },
  starter:    { daily: null, monthly: 120 },
  pro:        { daily: null, monthly: 300 },
  pro_max:    { daily: null, monthly: 800 },
  enterprise: { daily: null, monthly: 1500 },
};

function todayStr() { return new Date().toISOString().slice(0, 10); }
function thisMonthStr() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; }

function getQueryVariations(nicho, ciudad, estado, pais) {
  const base = `${ciudad}, ${estado}, ${pais}`;
  return [`${nicho} en ${base}`, `${nicho} cerca de ${base}`, `mejor ${nicho} en ${base}`, `${nicho} popular en ${base}`];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'No autorizado' }, { status: 401 });

    const body = await req.json();
    const { nicho, ciudad, estado, pais, pageToken, variationIndex = 0, deviceId } = body;

    if (!nicho || !ciudad || !estado || !pais) return Response.json({ error: 'Faltan parámetros' }, { status: 400 });

    const today = todayStr();
    const thisMonth = thisMonthStr();
    const plans = await base44.asServiceRole.entities.UserPlan.filter({ user_email: user.email });
    let userPlan = plans[0];

    if (!userPlan) {
      userPlan = await base44.asServiceRole.entities.UserPlan.create({
        user_email: user.email, plan: 'free', searches_today: 0, searches_this_month: 0, last_search_date: today, month_start_date: thisMonth, device_id: deviceId || 'unknown'
      });
    } else if (deviceId && userPlan.device_id !== deviceId) {
      await base44.asServiceRole.entities.UserPlan.update(userPlan.id, { device_id: deviceId });
      userPlan.device_id = deviceId;
    }

    if (userPlan.last_search_date !== today) userPlan.searches_today = 0;
    if (userPlan.month_start_date !== thisMonth) userPlan.searches_this_month = 0;

    const plan = userPlan.plan || 'free';
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    if (!pageToken) {
      if (plan === 'free') {
        if (userPlan.searches_today >= limits.daily) {
          return Response.json({ error: `Límite de ${limits.daily} búsquedas diarias alcanzado.`, requiresUpgrade: true }, { status: 403 });
        }

        if (deviceId && deviceId !== 'unknown') {
          const devicePlans = await base44.asServiceRole.entities.UserPlan.filter({ device_id: deviceId, last_search_date: today });
          let deviceSearchesToday = 0;
          for (const p of devicePlans) {
            if (p.plan === 'free') deviceSearchesToday += (p.searches_today || 0);
          }
          
          if (deviceSearchesToday >= limits.daily) {
            return Response.json({ error: `Límite de dispositivo alcanzado. Has usado tus búsquedas gratuitas en otra cuenta desde este mismo equipo.`, requiresUpgrade: true }, { status: 403 });
          }
        }
      }
      
      if (plan !== 'free' && limits.monthly && userPlan.searches_this_month >= limits.monthly) {
        return Response.json({ error: `Límite mensual alcanzado.`, requiresUpgrade: true }, { status: 403 });
      }
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    const variations = getQueryVariations(nicho, ciudad, estado, pais);
    const currentVariation = variationIndex < variations.length ? variationIndex : variations.length - 1;
    
    if (pageToken) await new Promise(r => setTimeout(r, 2000));
    const requestBody = { textQuery: variations[currentVariation], maxResultCount: 20, languageCode: 'es' };
    if (pageToken) requestBody.pageToken = pageToken;

    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.internationalPhoneNumber,places.nationalPhoneNumber,places.rating,places.id,nextPageToken' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    if (!response.ok) return Response.json({ error: data.error?.message || 'Error API' }, { status: 500 });

    if (!pageToken) {
      await base44.asServiceRole.entities.UserPlan.update(userPlan.id, {
        searches_today: (userPlan.searches_today || 0) + 1,
        searches_this_month: (userPlan.searches_this_month || 0) + 1,
        last_search_date: today, month_start_date: thisMonth
      });
    }

    const places = data.places || [];
    const leads = places.map(p => ({
      nombre_empresa: p.displayName?.text || 'Sin nombre',
      direccion: p.formattedAddress || 'Sin dirección',
      telefono: p.internationalPhoneNumber || p.nationalPhoneNumber || '',
      rating: p.rating || null,
      place_id: p.id || '',
      ciudad, estado, pais, segmento: nicho
    }));

    let nextPageToken = data.nextPageToken || null;
    let nextVariationIndex = currentVariation;
    if (!nextPageToken && currentVariation < variations.length - 1) {
      nextVariationIndex = currentVariation + 1;
      nextPageToken = '__next_variation__';
    }

    return Response.json({
      leads, total: leads.length,
      nextPageToken: nextPageToken === '__next_variation__' ? null : nextPageToken,
      nextVariationIndex: nextPageToken || nextPageToken === '__next_variation__' ? nextVariationIndex : null,
      hasMore: !!nextPageToken,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});