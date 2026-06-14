import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const me = await base44.auth.me();
    if (me?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { action, userEmail } = body;

    if (!action || !userEmail) {
      return Response.json({ error: 'Missing action or userEmail' }, { status: 400 });
    }

    if (action === 'reset') {
      const plans = await base44.asServiceRole.entities.UserPlan.filter({ user_email: userEmail });
      if (plans.length > 0) {
        await base44.asServiceRole.entities.UserPlan.update(plans[0].id, {
          searches_today: 0,
          searches_this_month: 0,
        });
      }
      return Response.json({ success: true, message: 'Credits reset successfully' });
    }

    if (action === 'delete') {
      // Delete user plan
      const plans = await base44.asServiceRole.entities.UserPlan.filter({ user_email: userEmail });
      for (const plan of plans) {
        await base44.asServiceRole.entities.UserPlan.delete(plan.id);
      }

      // Delete saved leads
      const leads = await base44.asServiceRole.entities.SavedLead.filter({ user_email: userEmail });
      for (const lead of leads) {
        await base44.asServiceRole.entities.SavedLead.delete(lead.id);
      }

      return Response.json({ success: true, message: 'User data deleted successfully' });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});