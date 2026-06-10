import { base44 } from "@/api/base44Client";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Clock, Route, Zap, ArrowRight, Check, Star } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { LANDING } from "@/lib/landing-content";

const PAIN_ICONS = [MapPin, Clock, Route];

export default function Landing() {
  const { lang, setLang } = useLang();
  const navigate = useNavigate();
  const c = LANDING[lang] || LANDING.es;

  const handleCTA = () => {
    base44.auth.redirectToLogin("/dashboard");
  };

  const switchLang = (l) => {
    setLang(l);
    navigate(l === "pt" ? "/br" : "/");
  };

  return (
    <div className="min-h-screen bg-white font-inter">

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">LeadZone</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
              <button
                onClick={() => switchLang("es")}
                className={`px-2 py-1 rounded-md transition-colors ${lang === "es" ? "bg-slate-100 text-slate-900" : "hover:text-slate-700"}`}
              >
                ES
              </button>
              <span className="text-slate-200">|</span>
              <button
                onClick={() => switchLang("pt")}
                className={`px-2 py-1 rounded-md transition-colors ${lang === "pt" ? "bg-slate-100 text-slate-900" : "hover:text-slate-700"}`}
              >
                PT
              </button>
            </div>
            <button
              onClick={handleCTA}
              className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all"
            >
              {c.nav.enter}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest text-indigo-400 uppercase mb-5 bg-indigo-400/10 px-3 py-1.5 rounded-full border border-indigo-400/20">
              {c.hero.badge}
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              {c.hero.title}{" "}
              <span className="text-indigo-400">{c.hero.titleHighlight}</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              {c.hero.subtitle}
            </p>
            <button
              onClick={handleCTA}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-lg shadow-green-500/30 active:scale-95"
            >
              {c.hero.cta}
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-slate-500 text-sm mt-3">
              {c.hero.noteBefore}<strong>{c.hero.noteStrong}</strong>{c.hero.noteAfter}
            </p>
          </div>

          {/* Visual mock UI */}
          <div className="relative">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
              <div className="bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-slate-500">LeadZone — Dashboard</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-slate-700/50 rounded-xl p-3">
                  <div className="flex gap-2 mb-3">
                    {c.hero.mockFilters.map(l => (
                      <div key={l} className="flex-1 bg-slate-600/50 rounded-lg h-8 flex items-center px-2">
                        <span className="text-xs text-slate-400">{l}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-indigo-600 rounded-lg h-8 flex items-center justify-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs text-white font-semibold">{c.hero.mockSearch}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["Restaurante Don Pedro", "Clínica Salud Plus", "Ferretería El As", "Hotel Plaza Real"].map((name, i) => (
                    <div key={i} className="bg-slate-700/40 rounded-xl p-2.5 border border-slate-600/30">
                      <div className="text-xs font-semibold text-white mb-1">{name}</div>
                      <div className="flex items-center gap-1 text-slate-400 mb-1.5">
                        <MapPin className="w-2.5 h-2.5" />
                        <span className="text-[10px]">{c.hero.mockLocation}</span>
                      </div>
                      <div className="bg-green-500/20 rounded-md py-1 flex items-center justify-center">
                        <span className="text-[10px] text-green-400 font-semibold">WhatsApp</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg">
              {c.hero.mockBadge}
            </div>
          </div>
        </div>
      </section>

      {/* Pains */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            {c.pains.titleBefore}<span className="text-red-500">{c.pains.titleHighlight}</span>{c.pains.titleAfter}
          </h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {c.pains.items.map(({ title, desc }, i) => {
            const Icon = PAIN_ICONS[i];
            return (
              <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
                  <Icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            {c.solution.titleBefore}<span className="text-indigo-600">{c.solution.titleHighlight}</span>{c.solution.titleAfter}
          </h2>
          <p className="text-slate-500 text-lg">{c.solution.subtitle}</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {c.solution.features.map(({ icon, title, desc }) => (
            <div key={title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use case */}
      <section className="py-20 px-6 bg-indigo-950">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest text-indigo-400 uppercase mb-4 bg-indigo-400/10 px-3 py-1.5 rounded-full border border-indigo-400/20">
              {c.useCase.badge}
            </span>
            <h2 className="text-3xl font-extrabold text-white mb-5">
              {c.useCase.title}
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              {c.useCase.p1}<strong className="text-white">{c.useCase.strong1}</strong>{c.useCase.p2}<strong className="text-white">{c.useCase.strong2}</strong>{c.useCase.p3}
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">📉</span>
              <p className="text-green-400 font-semibold">{c.useCase.costNote}</p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80"
              alt={c.useCase.imageAlt}
              fetchpriority="high"
              decoding="async"
              className="rounded-2xl shadow-2xl w-full object-cover h-72"
            />
            <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 text-sm font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              {c.useCase.imageBadge}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              {c.testimonials.title}
            </h2>
            <p className="text-slate-500 text-lg">{c.testimonials.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.testimonials.items.map((t, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{t.content}"</p>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-slate-50" id="planes">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            {c.pricing.titleBefore}<span className="text-indigo-600">{c.pricing.titleHighlight}</span>
          </h2>
          <p className="text-slate-500 text-lg">{c.pricing.subtitle}</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {c.pricing.plans.map(plan => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-5 flex flex-col border transition-all ${
                plan.highlight
                  ? "bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-500/30 scale-105"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              {plan.tag && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">{plan.tag}</span>
                </div>
              )}
              <h3 className={`font-bold text-base mb-1 ${plan.highlight ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
              <p className={`text-xs mb-3 ${plan.highlight ? "text-indigo-200" : "text-slate-400"}`}>{plan.description}</p>
              <div className="flex items-baseline gap-0.5 mb-4">
                <span className={`text-3xl font-extrabold ${plan.highlight ? "text-white" : "text-slate-900"}`}>{plan.price}</span>
                <span className={`text-xs ${plan.highlight ? "text-indigo-200" : "text-slate-400"}`}>{plan.period}</span>
              </div>
              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${plan.highlight ? "text-green-300" : "text-green-500"}`} />
                    <span className={`text-xs ${plan.highlight ? "text-indigo-100" : "text-slate-500"}`}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => plan.link ? window.open(plan.link, '_blank') : handleCTA()}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                  plan.highlight
                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              {c.faq.title}
            </h2>
            <p className="text-slate-500 text-lg">{c.faq.subtitle}</p>
          </div>
          <div className="grid gap-4">
            {c.faq.items.map((faq, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left">
                <h3 className="font-bold text-slate-900 mb-2 text-base">{faq.q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-slate-900 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">{c.finalCta.title}</h2>
        <p className="text-slate-400 mb-8 text-lg">{c.finalCta.subtitle}</p>
        <button
          onClick={handleCTA}
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all shadow-lg shadow-green-500/30"
        >
          {c.finalCta.cta}
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      <footer className="py-8 px-6 bg-slate-950 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-white text-sm">LeadZone</span>
        </div>
        <div className="flex items-center justify-center gap-5 mb-4">
          <Link to="/blog" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{c.footer.blog}</Link>
          <a href="#planes" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{c.footer.pricing}</a>
        </div>
        <p className="text-slate-600 text-xs">{c.footer.rights}</p>
      </footer>
    </div>
  );
}