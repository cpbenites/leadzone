import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const me = await base44.auth.me();
    if (me?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await base44.asServiceRole.entities.User.list();
    const plans = await base44.asServiceRole.entities.UserPlan.list();

    const plansByEmail = {};
    for (const plan of plans) {
      plansByEmail[plan.user_email] = plan;
    }

    const result = users.map(u => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      role: u.role,
      created_date: u.created_date,
      plan: plansByEmail[u.email] || null,
    }));

    return Response.json({ users: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});