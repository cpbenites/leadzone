import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Loader2, ChevronDown } from "lucide-react";

const PLANS = ["free", "starter", "pro", "pro_max", "enterprise"];

const PLAN_LABELS = {
  free: "Gratuito",
  starter: "Starter",
  pro: "Pro",
  pro_max: "Pro Max",
  enterprise: "Enterprise",
};

const PLAN_COLORS = {
  free: "bg-slate-100 text-slate-600",
  starter: "bg-blue-100 text-blue-700",
  pro: "bg-purple-100 text-purple-700",
  pro_max: "bg-orange-100 text-orange-700",
  enterprise: "bg-amber-100 text-amber-700",
};

export default function Admin() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [userPlans, setUserPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const load = async () => {
      const me = await base44.auth.me();
      setCurrentUser(me);
      if (me?.role !== "admin") {
        setLoading(false);
        return;
      }
      const [usersData, plansData] = await Promise.all([
        base44.entities.User.list(),
        base44.asServiceRole.entities.UserPlan.list(),
      ]);
      setUsers(usersData);
      const plansMap = {};
      plansData.forEach(p => { plansMap[p.user_email] = p; });
      setUserPlans(plansMap);
      setLoading(false);
    };
    load();
  }, []);

  const handlePlanChange = async (userEmail, newPlan, planId) => {
    setSaving(prev => ({ ...prev, [userEmail]: true }));
    try {
      if (planId) {
        await base44.asServiceRole.entities.UserPlan.update(planId, { plan: newPlan });
      } else {
        const created = await base44.asServiceRole.entities.UserPlan.create({
          user_email: userEmail,
          plan: newPlan,
          searches_today: 0,
          searches_this_month: 0,
        });
        setUserPlans(prev => ({ ...prev, [userEmail]: created }));
      }
      setUserPlans(prev => ({
        ...prev,
        [userEmail]: { ...prev[userEmail], plan: newPlan },
      }));
      toast({ title: "Plan actualizado", description: `Plan de ${userEmail} cambiado a ${PLAN_LABELS[newPlan]}.` });
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(prev => ({ ...prev, [userEmail]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (currentUser?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-6">
        <Shield className="w-12 h-12 text-muted-foreground mb-4 opacity-40" />
        <h2 className="text-xl font-bold text-foreground mb-2">Acceso Restringido</h2>
        <p className="text-muted-foreground text-sm">Solo los administradores pueden acceder a este panel.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Gestiona los planes de los usuarios registrados</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Usuario</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Búsquedas (mes)</div>
            <div className="col-span-2">Plan</div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {users.map((user, idx) => {
            const plan = userPlans[user.email];
            const currentPlan = plan?.plan || "free";
            const isSaving = saving[user.email];

            return (
              <div key={user.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-muted/20 transition-colors">
                <div className="col-span-1 text-xs text-muted-foreground font-mono">{idx + 1}</div>

                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user.full_name || "Sin nombre"}</p>
                    {user.role === "admin" && (
                      <span className="text-xs text-primary font-medium">Admin</span>
                    )}
                  </div>
                </div>

                <div className="col-span-3">
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>

                <div className="col-span-2 text-center">
                  <span className="text-sm font-semibold text-foreground">{plan?.searches_this_month || 0}</span>
                </div>

                <div className="col-span-2">
                  <div className="relative">
                    <select
                      value={currentPlan}
                      disabled={isSaving}
                      onChange={e => handlePlanChange(user.email, e.target.value, plan?.id)}
                      className={`w-full appearance-none text-xs font-semibold px-3 py-2 pr-7 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 cursor-pointer ${PLAN_COLORS[currentPlan]}`}
                    >
                      {PLANS.map(p => (
                        <option key={p} value={p}>{PLAN_LABELS[p]}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-current opacity-60" />
                    {isSaving && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-lg">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {users.length === 0 && (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No hay usuarios registrados aún.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}