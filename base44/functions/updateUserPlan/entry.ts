import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const me = await base44.auth.me();
    if (me?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { userEmail, newPlan, planId } = body;

    if (!userEmail || !newPlan) {
      return Response.json({ error: 'Missing userEmail or newPlan' }, { status: 400 });
    }

    let plan;
    if (planId) {
      plan = await base44.asServiceRole.entities.UserPlan.update(planId, { plan: newPlan });
    } else {
      const existing = await base44.asServiceRole.entities.UserPlan.filter({ user_email: userEmail });
      if (existing.length > 0) {
        plan = await base44.asServiceRole.entities.UserPlan.update(existing[0].id, { plan: newPlan });
      } else {
        plan = await base44.asServiceRole.entities.UserPlan.create({
          user_email: userEmail,
          plan: newPlan,
          searches_today: 0,
          searches_this_month: 0,
        });
      }
    }

    return Response.json({ plan });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});