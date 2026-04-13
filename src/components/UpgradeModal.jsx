import { X, Zap, Star, Rocket, Building2, Check } from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$12",
    period: "/mes",
    icon: Zap,
    color: "text-blue-500",
    bg: "bg-blue-50 border-blue-200",
    features: ["120 búsquedas/mes", "Búsqueda Global (Mundial)", "Paginación completa", "Soporte por email"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$25",
    period: "/mes",
    icon: Star,
    color: "text-purple-500",
    bg: "bg-purple-50 border-purple-200",
    popular: true,
    features: ["300 búsquedas/mes", "Búsqueda Global (Mundial)", "CRM completo", "Soporte prioritario"],
  },
  {
    id: "pro_max",
    name: "Pro Max",
    price: "$49",
    period: "/mes",
    icon: Rocket,
    color: "text-orange-500",
    bg: "bg-orange-50 border-orange-200",
    features: ["800 búsquedas/mes", "Todo lo del Pro", "Exportar CSV", "Filtro de Calificación Estratégica", "Enlaces directos a Web e Instagram"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    period: "/mes",
    icon: Building2,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    features: ["1500+ búsquedas/mes", "Todo lo del Pro Max", "API access", "Soporte dedicado", "Filtro de Calificación Estratégica", "Enlaces directos a Web e Instagram"],
  },
];

export default function UpgradeModal({ onClose, reason }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Mejora tu Plan</h2>
            {reason && <p className="text-sm text-muted-foreground mt-1">{reason}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map(plan => {
              const Icon = plan.icon;
              return (
                <div key={plan.id} className={`relative border rounded-xl p-4 flex flex-col ${plan.popular ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">POPULAR</span>
                    </div>
                  )}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 border ${plan.bg}`}>
                    <Icon className={`w-4 h-4 ${plan.color}`} />
                  </div>
                  <h3 className="font-bold text-foreground">{plan.name}</h3>
                  <div className="flex items-baseline gap-0.5 mt-1 mb-3">
                    <span className="text-2xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-xs">{plan.period}</span>
                  </div>
                  <ul className="space-y-1.5 flex-1 mb-4">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                    onClick={() => alert(`Contacta al administrador para activar el plan ${plan.name}.`)}
                  >
                    Elegir Plan
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}