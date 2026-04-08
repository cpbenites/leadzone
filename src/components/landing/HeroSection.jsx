import { useState, useEffect } from "react";
import { ArrowRight, Play } from "lucide-react";

const STATS = [
  { value: 50000, suffix: "+", label: "Leads gerados" },
  { value: 1200, suffix: "+", label: "Vendedores ativos" },
  { value: 98, suffix: "%", label: "Taxa de satisfação" },
];

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCounter({ value, suffix, label }) {
  const [visible, setVisible] = useState(false);
  const count = useCounter(value, 1800, visible);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center">
      <div className="text-4xl font-black text-white tabular-nums">
        {count.toLocaleString("pt-BR")}{suffix}
      </div>
      <div className="text-sm text-slate-400 mt-1 font-medium">{label}</div>
    </div>
  );
}

export default function HeroSection({ onCTA }) {
  return (
    <section className="relative min-h-screen bg-slate-950 overflow-hidden flex flex-col">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-black text-white text-xl tracking-tight">LeadZone</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#planos" className="text-sm text-slate-400 hover:text-white transition-colors font-medium hidden md:block">Planos</a>
          <button onClick={onCTA} className="text-sm font-semibold bg-white text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all">
            Entrar
          </button>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex items-center px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full py-16">
          <div>
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">Prospección B2B Inteligente</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Seu próximo cliente
              <br />
              está a{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">3 cliques</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M0 6 Q100 0 200 6" stroke="url(#grad)" strokeWidth="2.5" strokeLinecap="round"/>
                  <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient></defs>
                </svg>
              </span>
              {" "}de você.
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
              Filtre por cidade, segmento e extraia telefones reais de negócios prontos para comprar. Sem planilhas, sem cold call às cegas.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onCTA}
                className="group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
              >
                Começar grátis agora
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center gap-2 text-slate-300 hover:text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 transition-all">
                <Play className="w-4 h-4" />
                Ver demo
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-4">Sem cartão de crédito · Cancele quando quiser</p>
          </div>

          {/* Dashboard mock */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-3xl blur-xl" />
            <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              {/* Topbar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <div className="ml-3 flex-1 bg-slate-700/50 rounded-md h-5 max-w-xs flex items-center px-2">
                  <span className="text-[10px] text-slate-400">leadzone.app/dashboard</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {/* Search bar mock */}
                <div className="flex gap-2">
                  {["Colombia", "Bogotá", "Restaurantes"].map((t, i) => (
                    <div key={i} className="flex-1 bg-slate-800 rounded-lg px-3 py-2 border border-slate-700/50">
                      <div className="text-[10px] text-slate-500 mb-0.5">Filtro</div>
                      <div className="text-xs text-slate-200 font-medium">{t}</div>
                    </div>
                  ))}
                </div>
                {/* Result cards mock */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Restaurante El Cielo", phone: "+57 310 234 5678", rating: "4.8" },
                    { name: "Café Árabe", phone: "+57 311 456 7890", rating: "4.6" },
                    { name: "Don Pedro Parrilla", phone: "+57 312 678 9012", rating: "4.9" },
                    { name: "La Bodega del Chef", phone: "+57 313 890 1234", rating: "4.7" },
                  ].map((lead, i) => (
                    <div key={i} className="bg-slate-800/60 border border-slate-700/30 rounded-xl p-2.5">
                      <div className="text-[11px] font-semibold text-white mb-1 leading-tight">{lead.name}</div>
                      <div className="text-[10px] text-slate-400 mb-2">{lead.phone}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-yellow-400 font-bold">★ {lead.rating}</span>
                        <div className="bg-green-500/20 text-green-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md">WhatsApp</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] text-slate-500">42 leads encontrados em 3s</span>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-slate-800 py-8 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 divide-x divide-slate-800">
          {STATS.map((s) => (
            <StatCounter key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}