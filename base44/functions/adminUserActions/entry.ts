import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { action, userEmail } = body;

    if (!action || !userEmail) {
      return Response.json({ error: 'Missing action or userEmail parameter' }, { status: 400 });
    }

    if (action === 'reset') {
      const plans = await base44.asServiceRole.entities.UserPlan.filter({ user_email: userEmail });
      if (plans.length > 0) {
        await base44.asServiceRole.entities.UserPlan.update(plans[0].id, {
          searches_today: 0,
          searches_this_month: 0
        });
      }
      return Response.json({ success: true, message: 'User searches reset successfully.' });
    } 
    
    if (action === 'delete') {
      // 1. Eliminar SavedLeads
      const leads = await base44.asServiceRole.entities.SavedLead.filter({ user_email: userEmail });
      for (const lead of leads) {
        await base44.asServiceRole.entities.SavedLead.delete(lead.id);
      }

      // 2. Eliminar UserPlan
      const plans = await base44.asServiceRole.entities.UserPlan.filter({ user_email: userEmail });
      for (const plan of plans) {
        await base44.asServiceRole.entities.UserPlan.delete(plan.id);
      }

      // 3. Eliminar User
      const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
      for (const u of users) {
        await base44.asServiceRole.entities.User.delete(u.id);
      }

      return Response.json({ success: true, message: 'User and all associated data deleted successfully.' });
    }

    return Response.json({ error: 'Invalid action specified' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});