import { ArrowRight } from "lucide-react";

export default function CTASection({ onCTA }) {
  return (
    <>
      {/* Final CTA */}
      <section className="bg-slate-950 py-24 px-8">
        <div className="max-w-4xl mx-auto relative">
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-indigo-600/20 rounded-3xl blur-2xl" />

          <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-12 text-center overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="relative">
              <div className="text-5xl mb-6">🚀</div>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
                Pronto para encher seu pipeline?
              </h2>
              <p className="text-indigo-200 text-lg mb-10 max-w-lg mx-auto">
                Comece grátis hoje. Sem cartão de crédito. Seu primeiro lead em menos de 5 minutos.
              </p>
              <button
                onClick={onCTA}
                className="group inline-flex items-center gap-2 bg-white text-indigo-700 font-black text-lg px-10 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl"
              >
                Criar minha conta gratuita
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-indigo-300/60 text-xs mt-4">Mais de 1.200 vendedores já estão prospectando agora</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-10 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-black text-white text-sm">LeadZone</span>
          </div>
          <p className="text-slate-600 text-xs">© 2026 LeadZone. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#planos" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Planos</a>
            <button onClick={onCTA} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Entrar</button>
          </div>
        </div>
      </footer>
    </>
  );
}