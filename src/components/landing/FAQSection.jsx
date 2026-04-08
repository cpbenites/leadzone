import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "Os dados de contato são reais e atualizados?",
    a: "Sim. Conectamos diretamente à API do Google Places, que atualiza os dados continuamente. Você sempre recebe o número de telefone público mais recente do negócio.",
  },
  {
    q: "Posso cancelar meu plano a qualquer momento?",
    a: "Absolutamente. Não há fidelidade. Você cancela com um clique e continua com acesso até o fim do período pago.",
  },
  {
    q: "O LeadZone funciona para qual tipo de vendedor?",
    a: "Para qualquer profissional que venda B2B — distribuidores, consultores, agências, representantes comerciais. Se o seu cliente é uma empresa ou estabelecimento, o LeadZone é para você.",
  },
  {
    q: "Qual a diferença entre os planos pagos?",
    a: "Principalmente o número de buscas mensais e o volume de leads acessíveis. Todos os planos pagos têm paginação completa, CRM e suporte. A diferença está na escala de operação.",
  },
  {
    q: "Posso usar o LeadZone em equipe?",
    a: "Atualmente cada conta é individual. Planos para equipes com múltiplos usuários estão previstos para o segundo semestre de 2026.",
  },
  {
    q: "Os dados podem ser exportados?",
    a: "Sim, a partir do plano Pro Max você pode exportar seus leads salvos em formato CSV para usar em outras ferramentas.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-slate-900 py-24 px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Perguntas frequentes</h2>
          <p className="text-slate-400">Tire suas dúvidas antes de começar.</p>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-xl overflow-hidden transition-all ${
                open === i ? "border-indigo-500/40 bg-slate-800/50" : "border-slate-800 bg-slate-900"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
              >
                <span className={`text-sm font-semibold transition-colors ${open === i ? "text-white" : "text-slate-300"}`}>
                  {faq.q}
                </span>
                {open === i
                  ? <Minus className="w-4 h-4 text-indigo-400 shrink-0" />
                  : <Plus className="w-4 h-4 text-slate-500 shrink-0" />
                }
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}