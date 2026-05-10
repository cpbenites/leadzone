import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link, useParams } from "react-router-dom";
import { Zap, ArrowRight, Clock, ArrowLeft, Tag } from "lucide-react";

const CATEGORIA_LABELS = {
  prospeccion: "Prospección",
  ventas: "Ventas",
  crm: "CRM",
  marketing: "Marketing",
  casos_de_uso: "Casos de Uso",
  herramientas: "Herramientas",
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      setLoading(true);
      const results = await base44.entities.BlogPost.filter({ slug, publicado: true });
      if (results.length > 0) {
        const p = results[0];
        setPost(p);
        // Load related posts (same category, excluding current)
        const rel = await base44.entities.BlogPost.filter({ publicado: true, categoria: p.categoria }, '-created_date', 4);
        setRelated(rel.filter(r => r.id !== p.id).slice(0, 3));
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 text-lg">Artículo no encontrado.</p>
        <Link to="/blog" className="text-indigo-600 font-semibold hover:underline">← Volver al Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">LeadZone</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/blog" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Blog</Link>
            <button
              onClick={() => base44.auth.redirectToLogin("/dashboard")}
              className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Article Hero */}
      <section className="pt-24 pb-8 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-indigo-400 text-sm hover:text-indigo-300 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            {post.categoria && (
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-400/10 px-2.5 py-1 rounded-full border border-indigo-400/20">
                {CATEGORIA_LABELS[post.categoria] || post.categoria}
              </span>
            )}
            {post.tiempo_lectura_min && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" /> {post.tiempo_lectura_min} min de lectura
              </span>
            )}
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">{post.titulo}</h1>
          {post.meta_description && (
            <p className="text-slate-400 text-lg leading-relaxed">{post.meta_description}</p>
          )}
          <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
            <span>{post.autor || "Equipo LeadZone"}</span>
            <span>·</span>
            <span>{new Date(post.created_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.imagen_url && (
        <div className="max-w-3xl mx-auto px-6 -mt-2">
          <img src={post.imagen_url} alt={post.titulo} className="w-full rounded-2xl shadow-xl object-cover max-h-96" />
        </div>
      )}

      {/* Article Content */}
      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div
            className="prose prose-slate prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-slate-900
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
              prose-li:text-slate-600 prose-strong:text-slate-800
              prose-ul:my-4 prose-ul:space-y-1"
            dangerouslySetInnerHTML={{ __html: post.contenido_html }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-slate-400" />
                {post.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* CTA Banner */}
      <section className="py-10 px-6">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center shadow-xl">
          <h3 className="text-xl font-extrabold text-white mb-2">¿Quieres poner esto en práctica ahora mismo?</h3>
          <p className="text-indigo-100 mb-5">LeadZone te ayuda a encontrar clientes B2B en tu ciudad en minutos.</p>
          <button
            onClick={() => base44.auth.redirectToLogin("/dashboard")}
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-7 py-3 rounded-xl hover:bg-indigo-50 transition-all"
          >
            Empezar Gratis <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="py-12 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Artículos relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(r => (
                <Link
                  key={r.id}
                  to={`/blog/${r.slug}`}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all group"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2 block">
                    {CATEGORIA_LABELS[r.categoria] || r.categoria}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-indigo-600 transition-colors line-clamp-3">
                    {r.titulo}
                  </h3>
                  <div className="mt-3 text-xs font-semibold text-indigo-500 flex items-center gap-1">
                    Leer <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="py-6 px-6 bg-slate-950 text-center">
        <p className="text-slate-600 text-xs">© 2026 LeadZone. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}