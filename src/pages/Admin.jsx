import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Shield, Loader2, ChevronDown, X, CheckCircle, AlertCircle, Search, Users, Zap, Star } from "lucide-react";

const PLANS = ["free", "starter", "pro", "pro_max", "enterprise"];

const PLAN_LABELS = { free: "Gratuito", starter: "Starter", pro: "Pro", pro_max: "Pro Max", enterprise: "Enterprise" };

const PLAN_COLORS = {
  free: "bg-slate-100 text-slate-600 border-slate-200",
  starter: "bg-blue-100 text-blue-700 border-blue-200",
  pro: "bg-purple-100 text-purple-700 border-purple-200",
  pro_max: "bg-orange-100 text-orange-700 border-orange-200",
  enterprise: "bg-amber-100 text-amber-700 border-amber-200",
};

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null);
  const [saving, setSaving] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
        setIsAdmin(false); setLoading(false); return;
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
      const res = await base44.functions.invoke("updateUserPlan", { userEmail: user.email, newPlan, planId: user.plan?.id || null });
      setUsers(prev => prev.map(u => u.email === user.email ? { ...u, plan: res.data.plan } : u));
      showNotification("success", `${user.email} → ${PLAN_LABELS[newPlan]}`);
    } catch (e) {
      showNotification("error", e.message);
    } finally {
      setSaving(prev => ({ ...prev, [user.email]: false }));
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-6">
      <Shield className="w-12 h-12 text-muted-foreground mb-4 opacity-40" />
      <h2 className="text-xl font-bold text-foreground mb-2">Acceso Restringido</h2>
      <p className="text-muted-foreground text-sm">Solo los administradores pueden acceder a este panel.</p>
    </div>
  );

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const paidUsers = users.filter(u => u.plan && u.plan.plan !== 'free').length;
  const freeUsers = totalUsers - paidUsers;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border max-w-sm animate-in slide-in-from-bottom-5 ${notification.type === "success" ? "bg-white border-green-200 text-green-800" : "bg-white border-red-200 text-red-800"}`}>
          {notification.type === "success" ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
          <div className="flex-1">
            <p className="text-xs font-semibold">{notification.type === "success" ? "Plan actualizado" : "Error"}</p>
            <p className="text-xs opacity-80">{notification.message}</p>
          </div>
          <button onClick={() => { clearTimeout(notifTimer.current); setNotification(null); }} className="p-0.5 hover:opacity-60 transition-opacity"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-in zoom-in-95">
            <h3 className="font-bold text-foreground text-base mb-4">Confirmar cambio de plan</h3>
            <p className="text-sm text-muted-foreground mb-1">Usuario: <span className="font-semibold text-foreground">{confirm.user.email}</span></p>
            <p className="text-sm text-muted-foreground mb-6">Nuevo plan: <span className="font-semibold text-foreground">{PLAN_LABELS[confirm.newPlan]}</span></p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors">Cancelar</button>
              <button onClick={handlePlanChange} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Shield className="w-6 h-6 text-primary" /> Panel de Administración</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestiona los usuarios y suscripciones de LeadZone</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center"><Users className="w-6 h-6 text-blue-500" /></div>
          <div><p className="text-sm font-medium text-muted-foreground">Total Usuarios</p><h3 className="text-2xl font-bold text-foreground">{totalUsers}</h3></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center"><Star className="w-6 h-6 text-green-500" /></div>
          <div><p className="text-sm font-medium text-muted-foreground">Usuarios Pago (Pro)</p><h3 className="text-2xl font-bold text-foreground">{paidUsers}</h3></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-500/10 flex items-center justify-center"><Zap className="w-6 h-6 text-slate-500" /></div>
          <div><p className="text-sm font-medium text-muted-foreground">Usuarios Gratis</p><h3 className="text-2xl font-bold text-foreground">{freeUsers}</h3></div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Buscar por email o nombre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Búsquedas (Mes)</th>
                <th className="px-6 py-4">Plan Actual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => {
                const currentPlan = user.plan?.plan || "free";
                const isSaving = saving[user.email];
                return (
                  <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                          {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{user.full_name || "Sin nombre"}</p>
                          {user.role === "admin" && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Admin</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4 text-center font-semibold text-foreground">{user.plan?.searches_this_month || 0}</td>
                    <td className="px-6 py-4">
                      <div className="relative w-40">
                        <select value={currentPlan} disabled={isSaving} onChange={e => requestPlanChange(user, e.target.value)} className={`w-full appearance-none text-xs font-semibold px-3 py-2 pr-7 rounded-lg border focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 cursor-pointer transition-colors ${PLAN_COLORS[currentPlan]}`}>
                          {PLANS.map(p => <option key={p} value={p}>{PLAN_LABELS[p]}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-60" />
                        {isSaving && <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-lg"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground">No se encontraron usuarios.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}