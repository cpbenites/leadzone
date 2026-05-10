import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Zap, ArrowRight, Clock, Tag, Search } from "lucide-react";

const CATEGORIA_LABELS = {
  prospeccion: "Prospección",
  ventas: "Ventas",
  crm: "CRM",
  marketing: "Marketing",
  casos_de_uso: "Casos de Uso",
  herramientas: "Herramientas",
};

const CATEGORIA_COLORS = {
  prospeccion: "bg-blue-100 text-blue-700",
  ventas: "bg-green-100 text-green-700",
  crm: "bg-purple-100 text-purple-700",
  marketing: "bg-pink-100 text-pink-700",
  casos_de_uso: "bg-amber-100 text-amber-700",
  herramientas: "bg-slate-100 text-slate-700",
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");

  useEffect(() => {
    base44.entities.BlogPost.filter({ publicado: true }, '-created_date', 50)
      .then(data => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p => {
    const matchSearch = !search || p.titulo?.toLowerCase().includes(search.toLowerCase()) || p.meta_description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.categoria === catFilter;
    return matchSearch && matchCat;
  });

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
            <Link to="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Inicio</Link>
            <button
              onClick={() => base44.auth.redirectToLogin("/dashboard")}
              className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-14 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest text-indigo-400 uppercase mb-4 bg-indigo-400/10 px-3 py-1.5 rounded-full border border-indigo-400/20">
            Blog LeadZone
          </span>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Estrategias de Prospección B2B para Latinoamérica
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Guías, casos de uso y tácticas para que tu equipo comercial prospecto más inteligente y cierre más negocios.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-6 border-b border-slate-100 bg-slate-50 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar artículos..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCatFilter("")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${!catFilter ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"}`}
            >
              Todos
            </button>
            {Object.entries(CATEGORIA_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setCatFilter(catFilter === key ? "" : key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${catFilter === key ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg font-medium">No se encontraron artículos</p>
              <p className="text-sm mt-1">Intenta con otra búsqueda o categoría</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-200 flex flex-col"
                >
                  {post.imagen_url ? (
                    <img src={post.imagen_url} alt={post.titulo} className="w-full h-44 object-cover" />
                  ) : (
                    <div className="w-full h-44 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                      <Zap className="w-10 h-10 text-indigo-200" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${CATEGORIA_COLORS[post.categoria] || "bg-slate-100 text-slate-600"}`}>
                        {CATEGORIA_LABELS[post.categoria] || post.categoria}
                      </span>
                      {post.tiempo_lectura_min && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          {post.tiempo_lectura_min} min
                        </span>
                      )}
                    </div>
                    <h2 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 flex-1">
                      {post.titulo}
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
                      {post.meta_description}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 mt-auto">
                      Leer artículo <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-slate-900 text-center">
        <h2 className="text-2xl font-extrabold text-white mb-3">¿Listo para prospectar más inteligente?</h2>
        <p className="text-slate-400 mb-6">Prueba LeadZone gratis, sin tarjeta de crédito.</p>
        <button
          onClick={() => base44.auth.redirectToLogin("/dashboard")}
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg"
        >
          Crear mi cuenta GRATIS <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      <footer className="py-6 px-6 bg-slate-950 text-center">
        <p className="text-slate-600 text-xs">© 2026 LeadZone. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}