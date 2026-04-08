import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { userEmail, newPlan, planId } = await req.json();

    if (!userEmail || !newPlan) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let updated;
    if (planId) {
      updated = await base44.asServiceRole.entities.UserPlan.update(planId, { plan: newPlan });
    } else {
      updated = await base44.asServiceRole.entities.UserPlan.create({
        user_email: userEmail,
        plan: newPlan,
        searches_today: 0,
        searches_this_month: 0,
      });
    }

    return Response.json({ success: true, plan: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});