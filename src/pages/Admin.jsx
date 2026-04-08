import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Shield, Loader2, ChevronDown, X, CheckCircle, AlertCircle } from "lucide-react";

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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null);
  const [saving, setSaving] = useState({});
  const [confirm, setConfirm] = useState(null); // { user, newPlan }
  const [notification, setNotification] = useState(null); // { type, message }
  const notifTimer = useRef(null);

  const showNotification = (type, message) => {
    clearTimeout(notifTimer.current);
    setNotification({ type, message });
    notifTimer.current = setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      const me = await base44.auth.me();
      if (me?.role !== "admin") {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setIsAdmin(true);
      const res = await base44.functions.invoke("getAdminUsers", {});
      setUsers(res.data.users || []);
      setLoading(false);
    };
    load();
  }, []);

  const requestPlanChange = (user, newPlan) => {
    if (newPlan === (user.plan?.plan || "free")) return;
    setConfirm({ user, newPlan });
  };

  const handlePlanChange = async () => {
    if (!confirm) return;
    const { user, newPlan } = confirm;
    setConfirm(null);
    setSaving(prev => ({ ...prev, [user.email]: true }));
    try {
      const res = await base44.functions.invoke("updateUserPlan", {
        userEmail: user.email,
        newPlan,
        planId: user.plan?.id || null,
      });
      setUsers(prev =>
        prev.map(u =>
          u.email === user.email ? { ...u, plan: res.data.plan } : u
        )
      );
      showNotification("success", `${user.email} → ${PLAN_LABELS[newPlan]}`);
    } catch (e) {
      showNotification("error", e.message);
    } finally {
      setSaving(prev => ({ ...prev, [user.email]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
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
      {/* Inline Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border max-w-sm ${
          notification.type === "success"
            ? "bg-white border-green-200 text-green-800"
            : "bg-white border-red-200 text-red-800"
        }`}>
          {notification.type === "success"
            ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            : <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          }
          <div className="flex-1">
            <p className="text-xs font-semibold">{notification.type === "success" ? "Plan actualizado" : "Error"}</p>
            <p className="text-xs opacity-80">{notification.message}</p>
          </div>
          <button onClick={() => { clearTimeout(notifTimer.current); setNotification(null); }} className="p-0.5 hover:opacity-60 transition-opacity">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {/* Confirmation Modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground text-base">Confirmar cambio de plan</h3>
              <button onClick={() => setConfirm(null)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Usuario: <span className="font-semibold text-foreground">{confirm.user.email}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Nuevo plan: <span className="font-semibold text-foreground">{PLAN_LABELS[confirm.newPlan]}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePlanChange}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{users.length} usuario(s) registrado(s)</p>
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
            const currentPlan = user.plan?.plan || "free";
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
                  <span className="text-sm font-semibold text-foreground">{user.plan?.searches_this_month || 0}</span>
                </div>

                <div className="col-span-2">
                  <div className="relative">
                    <select
                      value={currentPlan}
                      disabled={isSaving}
                      onChange={e => requestPlanChange(user, e.target.value)}
                      className={`w-full appearance-none text-xs font-semibold px-3 py-2 pr-7 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 cursor-pointer ${PLAN_COLORS[currentPlan]}`}
                    >
                      {PLANS.map(p => (
                        <option key={p} value={p}>{PLAN_LABELS[p]}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-60" />
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