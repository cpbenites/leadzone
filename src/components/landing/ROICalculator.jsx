import { useState } from "react";

export default function ROICalculator() {
  const [ticketMedio, setTicketMedio] = useState(500);
  const [taxaConversao, setTaxaConversao] = useState(5);
  const [plano, setPlano] = useState("starter");

  const PLANO_CUSTO = { starter: 12, pro: 25, pro_max: 49, enterprise: 99 };
  const PLANO_BUSCAS = { starter: 120, pro: 300, pro_max: 800, enterprise: 1500 };

  const buscas = PLANO_BUSCAS[plano];
  const leadsEstimados = buscas * 20; // ~20 leads por busca
  const vendas = Math.floor(leadsEstimados * (taxaConversao / 100));
  const receita = vendas * ticketMedio;
  const custo = PLANO_CUSTO[plano];
  const roi = receita > 0 ? Math.floor(((receita - custo) / custo) * 100) : 0;
  const payback = receita > 0 ? Math.ceil((custo / receita) * 30) : "—";

  return (
    <section className="bg-slate-900 py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-5">
            <span className="text-xs font-semibold text-violet-300 uppercase tracking-wide">Calculadora de ROI</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            Quanto você vai ganhar com o LeadZone?
          </h2>
          <p className="text-slate-400">Ajuste os sliders e veja sua projeção de retorno em tempo real.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-8">
            {/* Ticket médio */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-300">Ticket médio por venda</label>
                <span className="text-lg font-black text-white">${ticketMedio.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={ticketMedio}
                onChange={e => setTicketMedio(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>$50</span><span>$5.000</span>
              </div>
            </div>

            {/* Taxa de conversão */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-300">Taxa de conversão de leads</label>
                <span className="text-lg font-black text-white">{taxaConversao}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={taxaConversao}
                onChange={e => setTaxaConversao(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1%</span><span>20%</span>
              </div>
            </div>

            {/* Plano */}
            <div>
              <label className="text-sm font-semibold text-slate-300 block mb-3">Plano escolhido</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(PLANO_CUSTO).map(p => (
                  <button
                    key={p}
                    onClick={() => setPlano(p)}
                    className={`py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                      plano === p
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {p.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                <span className="text-sm text-slate-400">Buscas por mês</span>
                <span className="text-sm font-bold text-white">{buscas.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                <span className="text-sm text-slate-400">Leads estimados</span>
                <span className="text-sm font-bold text-white">{leadsEstimados.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                <span className="text-sm text-slate-400">Vendas estimadas</span>
                <span className="text-sm font-bold text-white">{vendas}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                <span className="text-sm text-slate-400">Custo do plano</span>
                <span className="text-sm font-bold text-white">${custo}/mês</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                <span className="text-sm text-slate-400">Payback em</span>
                <span className="text-sm font-bold text-emerald-400">{typeof payback === "number" ? `${payback} dias` : "—"}</span>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-xl p-5 text-center">
              <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide font-semibold">Receita estimada / mês</div>
              <div className="text-4xl font-black text-white mb-1">${receita.toLocaleString()}</div>
              <div className="text-sm text-emerald-400 font-bold">ROI de {roi.toLocaleString()}%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}