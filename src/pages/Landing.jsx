import { base44 } from "@/api/base44Client";
import { MapPin, Clock, Route, Zap, ArrowRight, Check, Star } from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Gratuito",
    price: "$0",
    period: "/mes",
    tag: null,
    description: "Para probar el motor de búsqueda.",
    features: ["3 búsquedas/día", "5 resultados por búsqueda", "Embudo CRM básico", "Sin tarjeta de crédito"],
    cta: "Empezar Gratis",
    highlight: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: "$12",
    period: "/mes",
    tag: null,
    description: "Para el vendedor independiente.",
    features: ["120 búsquedas/mes", "Paginación completa", "Acceso al CRM (Embudo)", "Soporte por email"],
    cta: "Elegir Starter",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$25",
    period: "/mes",
    tag: "MÁS POPULAR",
    description: "Ideal para pequeñas empresas.",
    features: ["300 búsquedas/mes", "Paginación completa", "CRM completo", "Exportación de datos", "Soporte prioritario"],
    cta: "Elegir Pro",
    highlight: true,
  },
  {
    id: "pro_max",
    name: "Pro Max",
    price: "$49",
    period: "/mes",
    tag: null,
    description: "Para equipos comerciales.",
    features: ["800 búsquedas/mes", "Todo lo del Pro", "Exportar CSV", "Filtro de Calificación Estratégica", "Enlaces directos a Web e Instagram"],
    cta: "Elegir Pro Max",
    highlight: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    period: "/mes",
    tag: null,
    description: "Para distribuidores y agencias.",
    features: ["1500+ búsquedas/mes", "Todo lo del Pro Max", "API access", "Soporte dedicado", "Filtro de Calificación Estratégica", "Enlaces directos a Web e Instagram"],
    cta: "Elegir Enterprise",
    highlight: false,
  },
];

const PAINS = [
  {
    icon: MapPin,
    title: "Listas frías y desactualizadas",
    desc: "Compras bases de datos donde el 70% de los números ya no existen.",
  },
  {
    icon: Clock,
    title: "Tiempo perdido",
    desc: "Horas buscando en internet en lugar de estar negociando y cerrando ventas.",
  },
  {
    icon: Route,
    title: "Rutas ineficientes",
    desc: "Vendedores cruzando la ciudad para visitar negocios que no tienen el perfil de compra.",
  },
];

const FEATURES = [
  {
    icon: "🎯",
    title: "Precisión Geográfica",
    desc: "Filtra exactamente por País, Estado y Ciudad para encontrar leads en tu zona objetivo.",
  },
  {
    icon: "⚡",
    title: "Contacto Directo",
    desc: "Extraemos el teléfono público del negocio para que inicies la conversación por WhatsApp al instante.",
  },
  {
    icon: "📊",
    title: "CRM Visual Integrado",
    desc: "Guarda tus leads y muévelos por un embudo de ventas intuitivo sin salir de la plataforma.",
  },
  {
    icon: "⭐",
    title: "Radar de Oportunidades",
    desc: "Filtra negocios por su reputación en Google para encontrar clientes que necesitan tus servicios de marketing hoy mismo.",
  },
  {
    icon: "🌐",
    title: "Inteligencia Social",
    desc: "Ahorra horas de investigación: Accede al Sitio Web y al Instagram de tu prospecto con un solo clic desde tu CRM.",
  }
];

const TESTIMONIALS = [
  {
    name: "Carlos Mendoza",
    role: "Director Comercial, TechB2B",
    content: "Antes pasábamos horas buscando en Google Maps. Ahora, filtramos nuestra ciudad y en 2 minutos tenemos una lista lista para enviar WhatsApps. Nuestro equipo cierra el doble de reuniones.",
    rating: 5
  },
  {
    name: "Laura Gómez",
    role: "Agente Independiente",
    content: "El mejor SaaS de prospección que he probado. El hecho de que extraiga el número de teléfono directo me ha ahorrado días de trabajo. Se paga solo con la primera venta.",
    rating: 5
  },
  {
    name: "Diego Sánchez",
    role: "CEO, Distribuidora Sur",
    content: "Mapear restaurantes y cafeterías para nuestra distribución solía ser un dolor de cabeza. Con LeadZone, creamos rutas precisas en minutos. Brutal.",
    rating: 5
  }
];

const FAQS = [
  {
    q: "¿De dónde provienen los datos?",
    a: "Extraemos información pública y actualizada en tiempo real directamente de motores de búsqueda y mapas (como Google), garantizando que los negocios sigan operando y los números estén activos."
  },
  {
    q: "¿Funciona en mi país o ciudad?",
    a: "Sí, LeadZone funciona en cualquier país de Latinoamérica y España. Solo tienes que buscar el país, estado y la ciudad exacta que deseas prospectar."
  },
  {
    q: "¿Necesito tarjeta de crédito para el plan gratis?",
    a: "No. Puedes crear tu cuenta y usar tus búsquedas diarias gratuitas sin introducir ningún método de pago. Empieza a prospectar al instante."
  },
  {
    q: "¿Puedo cancelar o cambiar mi plan en cualquier momento?",
    a: "Absolutamente. No hay contratos a largo plazo. Puedes subir de plan cuando tu equipo crezca o cancelar tu suscripción con un solo clic desde tu panel."
  }
];

export default function Landing() {
  const handleCTA = () => {
    base44.auth.redirectToLogin("/dashboard");
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
          <button
            onClick={handleCTA}
            className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all"
          >
            Entrar
          </button>
        </div>
      </header>

      {/* DOBRA 1 — Hero */}
      <section className="pt-28 pb-20 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest text-indigo-400 uppercase mb-5 bg-indigo-400/10 px-3 py-1.5 rounded-full border border-indigo-400/20">
              Prospección B2B Inteligente
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              Deja de golpear puertas a ciegas. Encuentra clientes calificados en tu ciudad{" "}
              <span className="text-indigo-400">en 3 clics.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              El software de prospección B2B que mapea tu región, extrae contactos reales y llena tu WhatsApp de empresas listas para comprar.
            </p>
            <button
              onClick={handleCTA}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-lg shadow-green-500/30 active:scale-95"
            >
              Crear mi cuenta GRATIS
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-slate-500 text-sm mt-3">
              No requiere tarjeta. Al entrar, selecciona la pestaña <strong>Sign up</strong> para crear tu cuenta.
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
                    {["País", "Estado", "Ciudad", "Nicho"].map(l => (
                      <div key={l} className="flex-1 bg-slate-600/50 rounded-lg h-8 flex items-center px-2">
                        <span className="text-xs text-slate-400">{l}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-indigo-600 rounded-lg h-8 flex items-center justify-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs text-white font-semibold">Buscar Leads</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["Restaurante Don Pedro", "Clínica Salud Plus", "Ferretería El As", "Hotel Plaza Real"].map((name, i) => (
                    <div key={i} className="bg-slate-700/40 rounded-xl p-2.5 border border-slate-600/30">
                      <div className="text-xs font-semibold text-white mb-1">{name}</div>
                      <div className="flex items-center gap-1 text-slate-400 mb-1.5">
                        <MapPin className="w-2.5 h-2.5" />
                        <span className="text-[10px]">Bogotá, Colombia</span>
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
              +42 leads encontrados ✓
            </div>
          </div>
        </div>
      </section>

      {/* DOBRA 2 — Agitación del Dolor */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            ¿Por qué tu equipo comercial está <span className="text-red-500">perdiendo dinero</span> hoy?
          </h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {PAINS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
                <Icon className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DOBRA 3 — Solución */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            Tu nuevo <span className="text-indigo-600">radar de ventas B2B.</span> Diseñado para cerrar negocios.
          </h2>
          <p className="text-slate-500 text-lg">Todo lo que necesitas para prospectar, contactar y gestionar tus leads.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DOBRA 4 — Caso de Uso */}
      <section className="py-20 px-6 bg-indigo-950">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest text-indigo-400 uppercase mb-4 bg-indigo-400/10 px-3 py-1.5 rounded-full border border-indigo-400/20">
              Caso de uso real
            </span>
            <h2 className="text-3xl font-extrabold text-white mb-5">
              De la búsqueda a la ruta logística en minutos.
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Imagina que eres un distribuidor. Abres nuestra plataforma, filtras <strong className="text-white">"Bogotá"</strong> y buscas <strong className="text-white">"Panaderías Artesanales"</strong>. En 10 segundos, tienes una lista con la dirección exacta y el WhatsApp del dueño.
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">📉</span>
              <p className="text-green-400 font-semibold">Tu costo de adquisición de clientes acaba de caer un 80%.</p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80"
              alt="Distribuidor con mapa de rutas"
              className="rounded-2xl shadow-2xl w-full object-cover h-72"
            />
            <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 text-sm font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              47 panaderías encontradas
            </div>
          </div>
        </div>
      </section>

      {/* DOBRA 4.5 — Prueba Social */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              Únete a cientos de equipos que ya no pierden tiempo
            </h2>
            <p className="text-slate-500 text-lg">Lo que dicen los profesionales que prospectan con LeadZone.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
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

      {/* DOBRA 5 — Precios */}
      <section className="py-20 px-6 bg-slate-50" id="planes">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            Una inversión que se paga con <span className="text-indigo-600">tu primera venta del mes.</span>
          </h2>
          <p className="text-slate-500 text-lg">Empieza gratis, descubre el poder de la prospección inteligente y escala según el tamaño de tu negocio.</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PLANS.map(plan => (
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
                onClick={handleCTA}
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

      {/* DOBRA 5.5 — FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              Preguntas Frecuentes
            </h2>
            <p className="text-slate-500 text-lg">Todo lo que necesitas saber antes de empezar.</p>
          </div>
          <div className="grid gap-4">
            {FAQS.map((faq, i) => (
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
        <h2 className="text-3xl font-extrabold text-white mb-4">¿Listo para llenar tu pipeline?</h2>
        <p className="text-slate-400 mb-8 text-lg">Empieza gratis hoy. Sin tarjeta de crédito.</p>
        <button
          onClick={handleCTA}
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all shadow-lg shadow-green-500/30"
        >
          Crear mi cuenta GRATIS
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
        <p className="text-slate-600 text-xs">© 2026 LeadZone. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}