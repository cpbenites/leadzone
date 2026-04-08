import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const [users, plans] = await Promise.all([
      base44.asServiceRole.entities.User.list(),
      base44.asServiceRole.entities.UserPlan.list(),
    ]);

    const plansMap = {};
    plans.forEach(p => { plansMap[p.user_email] = p; });

    const result = users.map(u => ({
      id: u.id,
      full_name: u.full_name,
      email: u.email,
      role: u.role,
      plan: plansMap[u.email] || null,
    }));

    return Response.json({ users: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});