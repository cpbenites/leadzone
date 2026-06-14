import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { event_name, custom_data = {} } = body;

    const FB_PIXEL_ID = Deno.env.get("FB_PIXEL_ID") || "";
    const FB_ACCESS_TOKEN = Deno.env.get("FB_PIXEL_ACCESS_TOKEN") || "";

    if (!FB_PIXEL_ID || !FB_ACCESS_TOKEN) {
      return Response.json({ success: false, message: 'FB Pixel not configured' });
    }

    let user_data = {};
    try {
      const user = await base44.auth.me();
      if (user?.email) {
        const encoder = new TextEncoder();
        const data = encoder.encode(user.email.toLowerCase().trim());
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        user_data.em = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (_) {}

    const payload = {
      data: [{
        event_name: event_name || 'PageView',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data,
        custom_data,
      }]
    };

    await fetch(`https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
});