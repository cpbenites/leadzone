import { useState } from "react";
import { Search, MapPin, ChevronDown, Loader2, AlertCircle, Building2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { LOCATIONS } from "../data/locations";
import LeadCard from "../components/LeadCard";
import NichoSuggester from "../components/NichoSuggester";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const [pais, setPais] = useState("");
  const [estado, setEstado] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [nicho, setNicho] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const paises = Object.keys(LOCATIONS);
  const estados = pais ? Object.keys(LOCATIONS[pais] || {}) : [];
  const ciudades = estado ? (LOCATIONS[pais]?.[estado] || []) : [];

  const handlePaisChange = (v) => { setPais(v); setEstado(""); setCiudad(""); };
  const handleEstadoChange = (v) => { setEstado(v); setCiudad(""); };

  const handleSearch = async () => {
    if (!pais || !estado || !ciudad || !nicho.trim()) {
      toast({ title: "Campos incompletos", description: "Selecciona País, Estado, Ciudad e ingresa un nicho.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setError("");
    setLeads([]);
    setSearched(true);
    setSavedIds(new Set());
    setNextPageToken(null);
    try {
      const res = await base44.functions.invoke("searchLeads", { nicho: nicho.trim(), ciudad, estado, pais });
      setLeads(res.data.leads || []);
      setNextPageToken(res.data.nextPageToken || null);
    } catch (e) {
      setError(e.message || "Error al buscar leads. Verifica tu API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextPageToken) return;
    setLoadingMore(true);
    try {
      const res = await base44.functions.invoke("searchLeads", { nicho: nicho.trim(), ciudad, estado, pais, pageToken: nextPageToken });
      setLeads(prev => [...prev, ...(res.data.leads || [])]);
      setNextPageToken(res.data.nextPageToken || null);
    } catch (e) {
      setError(e.message || "Error al cargar más leads.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSave = async (lead) => {
    try {
      await base44.entities.SavedLead.create({
        nombre_empresa: lead.nombre_empresa,
        segmento: lead.segmento,
        telefono: lead.telefono,
        direccion: lead.direccion,
        ciudad: lead.ciudad,
        estado: lead.estado,
        pais: lead.pais,
        rating: lead.rating,
        place_id: lead.place_id,
        status_funil: "nuevos_leads"
      });
      setSavedIds(prev => new Set([...prev, lead.place_id || lead.nombre_empresa]));
      toast({ title: "¡Lead guardado!", description: `${lead.nombre_empresa} agregado a tu embudo.` });
    } catch (e) {
      toast({ title: "Error al guardar", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard de Prospección</h1>
        <p className="text-muted-foreground mt-1 text-sm">Encuentra clientes potenciales en tu ciudad objetivo</p>
      </div>

      <NichoSuggester onSelectNicho={(s) => setNicho(s)} />

      {/* Filters Card */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* País */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">País</label>
            <div className="relative">
              <select
                value={pais}
                onChange={e => handlePaisChange(e.target.value)}
                className="w-full appearance-none bg-background border border-input rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-8"
              >
                <option value="">Seleccionar país...</option>
                {paises.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estado / Provincia</label>
            <div className="relative">
              <select
                value={estado}
                onChange={e => handleEstadoChange(e.target.value)}
                disabled={!pais}
                className="w-full appearance-none bg-background border border-input rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-8 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">Seleccionar estado...</option>
                {estados.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Ciudad */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ciudad</label>
            <div className="relative">
              <select
                value={ciudad}
                onChange={e => setCiudad(e.target.value)}
                disabled={!estado}
                className="w-full appearance-none bg-background border border-input rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-8 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">Seleccionar ciudad...</option>
                {ciudades.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Nicho */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nicho / Segmento</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={nicho}
                onChange={e => setNicho(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Ej: restaurantes, clínicas..."
                className="w-full bg-background border border-input rounded-lg pl-9 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {ciudad && nicho && (
          <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>Buscando: <strong className="text-foreground">"{nicho} en {ciudad}, {estado}, {pais}"</strong></span>
          </div>
        )}

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? "Buscando leads..." : "Buscar Leads en la Ciudad"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl mb-6 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && searched && leads.length === 0 && !error && (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No se encontraron resultados</p>
          <p className="text-sm mt-1">Intenta con otro nicho o ciudad</p>
        </div>
      )}

      {/* Results */}
      {leads.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">
              {nextPageToken ? "Más de 20 establecimientos encontrados" : `${leads.length} establecimientos encontrados`}
            </h2>
            <span className="text-xs text-muted-foreground">{ciudad}, {estado}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {leads.map((lead, i) => (
              <LeadCard
                key={lead.place_id || i}
                lead={lead}
                onSave={handleSave}
                saved={savedIds.has(lead.place_id || lead.nombre_empresa)}
              />
            ))}
          </div>

          {nextPageToken && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
              >
                {loadingMore
                  ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" /> Cargando...</>
                  : "Buscar más establecimientos"
                }
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}