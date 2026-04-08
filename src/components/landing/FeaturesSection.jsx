const STEPS = [
  {
    number: "01",
    title: "Escolha sua cidade-alvo",
    desc: "Filtre por país, estado e cidade com precisão cirúrgica. Seu lead está onde seu vendedor pode chegar.",
    icon: "🎯",
  },
  {
    number: "02",
    title: "Defina o nicho",
    desc: "Restaurantes, clínicas, farmácias, ferreteiras — nossa IA sugere nichos baseados no que você vende.",
    icon: "🔍",
  },
  {
    number: "03",
    title: "Extraia leads reais",
    desc: "Nome, endereço, telefone e rating. Dados públicos reais, atualizados, prontos para o WhatsApp.",
    icon: "⚡",
  },
  {
    number: "04",
    title: "Gerencie no CRM",
    desc: "Mova seus leads pelo funil de vendas com drag & drop. De 'Novo Lead' até 'Cliente Fechado'.",
    icon: "📊",
  },
];

const DIFFERENTIALS = [
  {
    icon: "🗺️",
    title: "Cobertura total da América Latina",
    desc: "Colombia, México, Brasil, Chile, Argentina, Peru e mais — um único produto para toda a região.",
  },
  {
    icon: "📱",
    title: "WhatsApp direto do resultado",
    desc: "Um clique já abre o WhatsApp com o número do negócio. Zero atrito entre o lead e o contato.",
  },
  {
    icon: "🤖",
    title: "IA para descobrir nichos",
    desc: "Descreva o que você vende e a IA sugere 15 tipos de estabelecimentos que podem ser seus clientes.",
  },
  {
    icon: "🔄",
    title: "Dados sempre atualizados",
    desc: "Conectado ao Google Places em tempo real. Sem listas velhas, sem números inexistentes.",
  },
];

export default function FeaturesSection() {
  return (
    <>
      {/* How it works */}
      <section className="bg-slate-950 py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-5">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">Como funciona</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
              De zero a 40 leads em menos de 3 minutos
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">Um fluxo pensado para quem vende, não para quem programa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.number} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-slate-700 to-transparent z-0" />
                )}
                <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
                  <div className="text-3xl mb-4">{step.icon}</div>
                  <div className="text-xs font-black text-indigo-500 mb-2 font-mono">{step.number}</div>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="bg-slate-900 py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">Por que o LeadZone?</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-6">
                Tudo que um time de vendas precisa — sem o custo de um time inteiro.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Enquanto seu concorrente ainda está montando planilha, você já está ligando para o quinto lead do dia.
              </p>
              <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <div className="text-3xl">📉</div>
                <div>
                  <div className="text-sm font-bold text-white">Redução de 80% no custo de aquisição</div>
                  <div className="text-xs text-slate-400 mt-0.5">Baseado em feedback médio dos nossos usuários</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DIFFERENTIALS.map((d) => (
                <div key={d.title} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-indigo-500/30 transition-all">
                  <div className="text-2xl mb-3">{d.icon}</div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{d.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}