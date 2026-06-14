import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const action = body.action || 'check';

    const plans = await base44.asServiceRole.entities.UserPlan.filter({ user_email: user.email });
    let planRecord = plans[0] || null;

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const monthStr = now.toISOString().slice(0, 7);

    const PLAN_LIMITS = {
      free: 3,
      starter: 120,
      pro: 300,
      pro_max: 800,
      enterprise: 1500,
    };

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

    // Reset daily counter
    if (planRecord.last_search_date !== todayStr) {
      planRecord = await base44.asServiceRole.entities.UserPlan.update(planRecord.id, {
        searches_today: 0,
        last_search_date: todayStr,
      });
    }

    // Reset monthly counter
    if (planRecord.last_reset_month !== monthStr) {
      planRecord = await base44.asServiceRole.entities.UserPlan.update(planRecord.id, {
        searches_this_month: 0,
        last_reset_month: monthStr,
      });
    }

    const currentPlan = planRecord.plan || 'free';
    const isFree = currentPlan === 'free';
    const monthlyLimit = PLAN_LIMITS[currentPlan] || 3;

    if (action === 'increment') {
      if (isFree) {
        if ((planRecord.searches_today || 0) >= 3) {
          return Response.json({ error: 'Límite diario alcanzado para el plan gratuito.', plan: currentPlan, searches_today: planRecord.searches_today, monthly_limit: monthlyLimit }, { status: 403 });
        }
        planRecord = await base44.asServiceRole.entities.UserPlan.update(planRecord.id, {
          searches_today: (planRecord.searches_today || 0) + 1,
          searches_this_month: (planRecord.searches_this_month || 0) + 1,
        });
      } else {
        if ((planRecord.searches_this_month || 0) >= monthlyLimit) {
          return Response.json({ error: `Límite mensual de ${monthlyLimit} búsquedas alcanzado para el plan ${currentPlan}.`, plan: currentPlan, searches_this_month: planRecord.searches_this_month, monthly_limit: monthlyLimit }, { status: 403 });
        }
        planRecord = await base44.asServiceRole.entities.UserPlan.update(planRecord.id, {
          searches_this_month: (planRecord.searches_this_month || 0) + 1,
        });
      }
    }

    return Response.json({
      plan: currentPlan,
      searches_today: planRecord.searches_today || 0,
      searches_this_month: planRecord.searches_this_month || 0,
      monthly_limit: monthlyLimit,
      allowed: true,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});