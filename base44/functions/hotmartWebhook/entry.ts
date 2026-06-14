import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const PLAN_MAP = {
  "ga1w2f7m": "starter",
  "7plqhfor": "pro",
  "4ziuiskw": "pro_max",
  "5ou2ljz4": "enterprise",
};

Deno.serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));

    const base44 = createClientFromRequest(req);

    const event = body.event || body.data?.event;
    const email = body.data?.buyer?.email || body.buyer?.email || body.data?.subscription?.subscriber?.email;
    const offerId = body.data?.purchase?.offer?.code || body.data?.offer?.code || "";

    if (!email) {
      return Response.json({ received: true, message: "No email found" });
    }

    const newPlan = PLAN_MAP[offerId] || null;

    if ((event === "PURCHASE_APPROVED" || event === "PURCHASE_COMPLETE") && newPlan) {
      const existing = await base44.asServiceRole.entities.UserPlan.filter({ user_email: email });
      if (existing.length > 0) {
        await base44.asServiceRole.entities.UserPlan.update(existing[0].id, { plan: newPlan });
      } else {
        await base44.asServiceRole.entities.UserPlan.create({
          user_email: email,
          plan: newPlan,
          searches_today: 0,
          searches_this_month: 0,
        });
      }
    } else if (event === "PURCHASE_CANCELED" || event === "SUBSCRIPTION_CANCELLATION") {
      const existing = await base44.asServiceRole.entities.UserPlan.filter({ user_email: email });
      if (existing.length > 0) {
        await base44.asServiceRole.entities.UserPlan.update(existing[0].id, { plan: "free" });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});