import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User, CreditCard, Shield, Check, Zap, Star, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PLANS = [
  {
    id: "free",
    name: "Gratuito",
    price: "$0",
    period: "/mes",
    icon: Zap,
    color: "text-slate-500",
    features: ["3 búsquedas/día", "5 resultados por búsqueda", "Embudo CRM básico"],
    popular: false
  },
  {
    id: "starter",
    name: "Starter",
    price: "$12",
    period: "/mes",
    icon: Zap,
    color: "text-blue-500",
    features: ["120 búsquedas/mes", "Paginación completa", "Soporte por email"],
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    price: "$25",
    period: "/mes",
    icon: Star,
    color: "text-purple-500",
    features: ["300 búsquedas/mes", "Paginación completa", "CRM completo", "Soporte prioritario"],
    popular: true
  },
  {
    id: "pro_max",
    name: "Pro Max",
    price: "$49",
    period: "/mes",
    icon: Star,
    color: "text-orange-500",
    features: ["800 búsquedas/mes", "Todo lo del Pro", "Exportar CSV"],
    popular: false
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    period: "/mes",
    icon: Building2,
    color: "text-amber-500",
    features: ["1500+ búsquedas/mes", "Todo lo del Pro Max", "API access", "Soporte dedicado"],
    popular: false
  }
];

const PLAN_LIMITS = {
  free: { limit: 3, type: "diarias" },
  starter: { limit: 120, type: "mensuales" },
  pro: { limit: 300, type: "mensuales" },
  pro_max: { limit: 800, type: "mensuales" },
  enterprise: { limit: 1500, type: "mensuales" },
};

const PLAN_LABELS = {
  free: "Gratuito",
  starter: "Starter",
  pro: "Pro",
  pro_max: "Pro Max",
  enterprise: "Enterprise"
};

export default function Configuraciones() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("cuenta");
  const [planInfo, setPlanInfo] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const u = await base44.auth.me();
      setUser(u);
      setDisplayName(u?.full_name || "");
      
      if (u) {
        try {
          const res = await base44.functions.invoke("trackSearch", { action: "check" });
          setPlanInfo(res.data);
        } catch (e) {
          console.error("Error al cargar consumo:", e);
        }
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ full_name: displayName });
      toast({ title: "¡Perfil actualizado!", description: "Tus cambios han sido guardados." });
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "cuenta", label: "Mi Cuenta", icon: User },
    { id: "planes", label: "Planes", icon: CreditCard },
    { id: "seguridad", label: "Seguridad", icon: Shield },
  ];

  // Cálculos da Barra de Progresso
  const currentPlan = planInfo?.plan || "free";
  const planDetails = PLAN_LIMITS[currentPlan] || PLAN_LIMITS.free;
  const isFree = currentPlan === "free";
  const searchesDone = isFree ? (planInfo?.searches_today || 0) : (planInfo?.searches_this_month || 0);
  const percentage = Math.min(Math.round((searchesDone / planDetails.limit) * 100), 100);

  let progressColor = "bg-primary";
  if (percentage > 70) progressColor = "bg-warning";
  if (percentage >= 95) progressColor = "bg-destructive";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Configuraciones</h1>
        <p className="text-muted-foreground mt-1 text-sm">Administra tu cuenta y suscripción</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-8 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Account Tab */}
      {activeTab === "cuenta" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <h2 className="text-base font-semibold text-foreground">Información de la Cuenta</h2>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {user?.full_name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-foreground">{user?.full_name || "Usuario"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1 inline-block font-medium">
                {user?.role === "admin" ? "Administrador" : "Usuario"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nombre completo</label>
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
              <input
                value={user?.email || ""}
                disabled
                className="bg-muted border border-input rounded-lg px-3 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>

          {/* Seção de Consumo Injetada Aqui */}
          {planInfo && (
            <div className="pt-6 mt-2 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-4">Consumo de tu Plan</h3>
              <div className="flex justify-between items-end mb-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${isFree ? 'bg-slate-100 text-slate-600' : 'bg-primary/10 text-primary'}`}>
                  PLAN {PLAN_LABELS[currentPlan]}
                </span>
                <p className="text-sm font-bold text-foreground">
                  <span className="text-xl">{searchesDone}</span> / {planDetails.limit}
                </p>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${progressColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {isFree ? 'Las búsquedas se reinician a la medianoche.' : 'El límite se reinicia el próximo mes.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === "planes" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(plan => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`relative bg-card border rounded-2xl p-6 flex flex-col ${
                    plan.popular ? "border-primary shadow-lg shadow-primary/10" : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        MÁS POPULAR
                      </span>
                    </div>
                  )}

                  <div className={`w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${plan.color}`} />
                  </div>

                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1 mb-4">
                    <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>

                  <ul className="space-y-2 flex-1 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-success shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    Elegir Plan
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "seguridad" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-foreground">Seguridad de la Cuenta</h2>
          <p className="text-sm text-muted-foreground">La gestión de contraseña y autenticación se realiza a través del sistema de login seguro de la plataforma.</p>
          <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl">
            <Shield className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm font-semibold text-foreground">Cuenta protegida</p>
              <p className="text-xs text-muted-foreground">Tu cuenta tiene autenticación segura activada.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}