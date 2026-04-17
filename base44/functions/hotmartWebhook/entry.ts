import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Mapeamento de offer codes da Hotmart → planos internos
const OFFER_CODE_TO_PLAN = {
  'ga1w2f7m': 'starter',
  '7plqhfor': 'pro',
  '4ziuiskw': 'pro_max',
  '5ou2ljz4': 'enterprise',
};

const PLAN_MONTHLY_LIMITS = {
  starter:    120,
  pro:        300,
  pro_max:    800,
  enterprise: 1500,
};

function todayStr() { return new Date().toISOString().slice(0, 10); }
function thisMonthStr() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; }

Deno.serve(async (req) => {
  // A Hotmart só envia POST
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ received: true }, { status: 200 });
  }

  // Só processa compras aprovadas
  const event = body?.event;
  if (event !== 'PURCHASE_APPROVED') {
    return Response.json({ received: true }, { status: 200 });
  }

  const userEmail = body?.data?.buyer?.email;
  const offerCode = body?.data?.offer?.code;
  const newPlan   = OFFER_CODE_TO_PLAN[offerCode];

  if (!userEmail || !newPlan) {
    console.warn('hotmartWebhook: email ou offer code não mapeado', { userEmail, offerCode });
    return Response.json({ received: true }, { status: 200 });
  }

  try {
    // Usamos service role porque este endpoint não tem utilizador autenticado
    const base44 = createClientFromRequest(req);
    const today = todayStr();
    const thisMonth = thisMonthStr();

    const plans = await base44.asServiceRole.entities.UserPlan.filter({ user_email: userEmail });

    if (plans.length > 0) {
      // Atualiza plano existente
      await base44.asServiceRole.entities.UserPlan.update(plans[0].id, {
        plan: newPlan,
        searches_today: 0,
        searches_this_month: 0,
        last_search_date: today,
        month_start_date: thisMonth,
      });
    } else {
      // Cria registo de plano para utilizadores que ainda não têm
      await base44.asServiceRole.entities.UserPlan.create({
        user_email: userEmail,
        plan: newPlan,
        searches_today: 0,
        searches_this_month: 0,
        last_search_date: today,
        month_start_date: thisMonth,
      });
    }

    console.log(`hotmartWebhook: plano de ${userEmail} atualizado para ${newPlan}`);
  } catch (err) {
    // Logamos o erro mas sempre respondemos 200 para a Hotmart não reenviar
    console.error('hotmartWebhook: erro ao atualizar plano', err.message);
  }

  return Response.json({ received: true }, { status: 200 });
});