import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PIXEL_ID = '1314491603881923';
const ACCESS_TOKEN = Deno.env.get('FB_PIXEL_ACCESS_TOKEN');

function hashData(value) {
  if (!value) return null;
  // SHA-256 hash using Web Crypto API
  const encoder = new TextEncoder();
  return crypto.subtle.digest('SHA-256', encoder.encode(value.trim().toLowerCase()))
    .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    const body = await req.json();
    const { event_name, custom_data = {} } = body;

    if (!event_name) {
      return Response.json({ error: 'event_name is required' }, { status: 400 });
    }

    // Hash user data for privacy-safe matching
    const hashedEmail = user?.email ? await hashData(user.email) : null;
    const hashedName = user?.full_name ? await hashData(user.full_name) : null;

    // Get client IP from request headers
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
    const userAgent = req.headers.get('user-agent') || null;

    const userData = {
      ...(hashedEmail && { em: [hashedEmail] }),
      ...(hashedName && { fn: [hashedName] }),
      ...(clientIp && { client_ip_address: clientIp }),
      ...(userAgent && { client_user_agent: userAgent }),
    };

    const eventData = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          user_data: userData,
          ...(Object.keys(custom_data).length > 0 && { custom_data }),
        }
      ]
    };

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('FB CAPI error:', JSON.stringify(result));
      return Response.json({ error: result }, { status: 500 });
    }

    console.log(`FB CAPI event "${event_name}" sent for ${user?.email || 'anonymous'}`);
    return Response.json({ success: true, result });

  } catch (error) {
    console.error('fbEvent error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});