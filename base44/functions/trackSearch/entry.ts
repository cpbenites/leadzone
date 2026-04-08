import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const PLAN_LIMITS = {
  free:       { daily: 3,    monthly: null, pages: 1 },
  starter:    { daily: null, monthly: 120,  pages: null },
  pro:        { daily: null, monthly: 300,  pages: null },
  pro_max:    { daily: null, monthly: 800,  pages: null },
  enterprise: { daily: null, monthly: 1500, pages: null },
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function thisMonthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'No autorizado' }, { status: 401 });

    const body = await req.json();
    const { action } = body; // 'check' or 'increment'

    const today = todayStr();
    const thisMonth = thisMonthStr();

    // Find or create UserPlan
    const plans = await base44.asServiceRole.entities.UserPlan.filter({ user_email: user.email });
    let userPlan = plans[0];

    if (!userPlan) {
      userPlan = await base44.asServiceRole.entities.UserPlan.create({
        user_email: user.email,
        plan: 'free',
        searches_today: 0,
        searches_this_month: 0,
        last_search_date: today,
        month_start_date: thisMonth,
      });
    }

    // Reset daily counter if it's a new day
    if (userPlan.last_search_date !== today) {
      userPlan = await base44.asServiceRole.entities.UserPlan.update(userPlan.id, {
        searches_today: 0,
        last_search_date: today,
      });
    }

    // Reset monthly counter if it's a new month
    if (userPlan.month_start_date !== thisMonth) {
      userPlan = await base44.asServiceRole.entities.UserPlan.update(userPlan.id, {
        searches_this_month: 0,
        month_start_date: thisMonth,
      });
    }

    const plan = userPlan.plan || 'free';
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    // Check limits
    let allowed = true;
    let reason = null;

    if (plan === 'free') {
      if (userPlan.searches_today >= limits.daily) {
        allowed = false;
        reason = `Limite de ${limits.daily} buscas por dia atingido. Faça upgrade para continuar.`;
      }
    } else {
      if (limits.monthly && userPlan.searches_this_month >= limits.monthly) {
        allowed = false;
        reason = `Limite de ${limits.monthly} buscas mensais atingido.`;
      }
    }

    if (action === 'increment' && allowed) {
      await base44.asServiceRole.entities.UserPlan.update(userPlan.id, {
        searches_today: (userPlan.searches_today || 0) + 1,
        searches_this_month: (userPlan.searches_this_month || 0) + 1,
        last_search_date: today,
      });
    }

    return Response.json({
      allowed,
      reason,
      plan,
      pages: limits.pages,
      searches_today: userPlan.searches_today || 0,
      searches_this_month: userPlan.searches_this_month || 0,
      daily_limit: limits.daily,
      monthly_limit: limits.monthly,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});