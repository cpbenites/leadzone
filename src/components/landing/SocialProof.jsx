const LOGOS = [
  "Distribuidora Norte",
  "Clínicas Salud+",
  "Agencia Creativa",
  "Ferretería Central",
  "Hotel Boutique",
  "Tech Soluciones",
  "Consultora RH",
  "Moda Express",
];

const TESTIMONIALS = [
  {
    name: "Carlos Mendoza",
    role: "Vendedor Independente",
    country: "🇨🇴 Colombia",
    avatar: "CM",
    color: "bg-indigo-600",
    text: "Antes gastava 3 horas por dia buscando contatos. Agora em 10 minutos tenho 40 leads qualificados com telefone. Fechei 4 clientes no primeiro mês.",
    result: "+4 clientes em 30 dias",
  },
  {
    name: "Ana Ríos",
    role: "Diretora Comercial",
    country: "🇲🇽 México",
    avatar: "AR",
    color: "bg-violet-600",
    text: "Nossa equipe de 5 vendedores triplicou o número de ligações diárias. O ROI foi imediato — o plano se pagou na primeira semana.",
    result: "3x mais ligações/dia",
  },
  {
    name: "João Lima",
    role: "Consultor B2B",
    country: "🇧🇷 Brasil",
    avatar: "JL",
    color: "bg-emerald-600",
    text: "Trabalho com distribuição de alimentos. Mapeei 200 panificadoras em São Paulo em menos de uma hora. Nunca foi tão fácil prospectar.",
    result: "200 leads em 1 hora",
  },
];

export default function SocialProof() {
  return (
    <section className="bg-slate-950 py-24 px-8 overflow-hidden">
      {/* Logos ticker */}
      <div className="mb-20">
        <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-8">
          Usado por vendedores em toda América Latina
        </p>
        <div className="relative">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div key={i} className="inline-flex items-center px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
                <span className="text-sm font-semibold text-slate-400">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            Resultados reais de vendedores reais
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">Não são promessas. São histórias de quem transformou prospecção em rotina de crescimento.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 transition-all hover:-translate-y-1">
              {/* Quote mark */}
              <div className="text-5xl font-black text-indigo-500/20 leading-none mb-4">"</div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">{t.text}</p>

              {/* Result badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-emerald-400">{t.result}</span>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-xs font-black text-white shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role} · {t.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}