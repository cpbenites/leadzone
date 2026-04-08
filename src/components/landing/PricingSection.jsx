import { Check } from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Gratuito",
    price: "$0",
    period: "/mês",
    desc: "Para testar o motor de busca.",
    features: ["3 buscas/dia", "5 resultados por busca", "CRM básico"],
    cta: "Começar grátis",
    highlight: false,
    tag: null,
  },
  {
    id: "starter",
    name: "Starter",
    price: "$12",
    period: "/mês",
    desc: "Para o vendedor independente.",
    features: ["120 buscas/mês", "Paginação completa", "CRM completo", "Suporte por email"],
    cta: "Escolher Starter",
    highlight: false,
    tag: null,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$25",
    period: "/mês",
    desc: "Para pequenas equipes comerciais.",
    features: ["300 buscas/mês", "Paginação completa", "CRM completo", "Exportação de dados", "Suporte prioritário"],
    cta: "Escolher Pro",
    highlight: true,
    tag: "MAIS POPULAR",
  },
  {
    id: "pro_max",
    name: "Pro Max",
    price: "$49",
    period: "/mês",
    desc: "Para times de vendas.",
    features: ["800 buscas/mês", "Tudo do Pro", "Filtros avançados", "Exportar CSV"],
    cta: "Escolher Pro Max",
    highlight: false,
    tag: null,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    period: "/mês",
    desc: "Para distribuidores e agências.",
    features: ["1500+ buscas/mês", "Tudo do Pro Max", "Acesso à API", "Suporte dedicado"],
    cta: "Falar com Vendas",
    highlight: false,
    tag: null,
  },
];

export default function PricingSection({ onCTA }) {
  return (
    <section id="planos" className="bg-slate-950 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-5">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">Planos e Preços</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            Uma assinatura que se paga com a primeira venda do mês.
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">Comece grátis, descubra o poder da prospecção inteligente e escale quando precisar.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl p-5 border transition-all ${
                plan.highlight
                  ? "bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-600/30 lg:-mt-4 lg:-mb-4"
                  : "bg-slate-900 border-slate-800 hover:border-slate-600"
              }`}
            >
              {plan.tag && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                    {plan.tag}
                  </span>
                </div>
              )}

              <h3 className={`text-sm font-black mb-1 ${plan.highlight ? "text-white" : "text-white"}`}>{plan.name}</h3>
              <p className={`text-xs mb-4 ${plan.highlight ? "text-indigo-200" : "text-slate-500"}`}>{plan.desc}</p>

              <div className="flex items-baseline gap-1 mb-5">
                <span className={`text-3xl font-black ${plan.highlight ? "text-white" : "text-white"}`}>{plan.price}</span>
                <span className={`text-xs ${plan.highlight ? "text-indigo-200" : "text-slate-500"}`}>{plan.period}</span>
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${plan.highlight ? "text-emerald-300" : "text-emerald-500"}`} />
                    <span className={`text-xs leading-relaxed ${plan.highlight ? "text-indigo-100" : "text-slate-400"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onCTA}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                  plan.highlight
                    ? "bg-white text-indigo-700 hover:bg-indigo-50"
                    : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">Todos os planos incluem acesso ao CRM. Cancele quando quiser.</p>
      </div>
    </section>
  );
}