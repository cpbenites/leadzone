import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SITE_URL = "https://leadzone.cloud";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const res = await base44.asServiceRole.entities.BlogPost.filter(
      { publicado: true },
      '-created_date',
      1000
    );
    const posts = Array.isArray(res) ? res : (res?.items || []);

    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "weekly" },
      { loc: "/br", priority: "1.0", changefreq: "weekly" },
      { loc: "/blog", priority: "0.9", changefreq: "daily" },
    ];

    const staticUrls = staticPages.map(
      (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    );

    const postUrls = posts.map((post) => {
      const lastmod = post.updated_date ? post.updated_date.slice(0, 10) : "";
      return `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...postUrls].join("\n")}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});