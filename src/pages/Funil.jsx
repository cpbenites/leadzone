import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Phone, MapPin, Star, MessageCircle, Loader2, Trash2, Copy, Check, Search, X, Plus, Globe, Instagram, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import UpgradeModal from "../components/UpgradeModal";
import { useLang } from "@/lib/i18n";
import { T } from "@/lib/translations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const COLUMNS = [
  { id: "nuevos_leads", color: "bg-blue-500", light: "bg-blue-50 border-blue-100" },
  { id: "en_contacto", color: "bg-amber-500", light: "bg-amber-50 border-amber-100" },
  { id: "en_negociacion", color: "bg-purple-500", light: "bg-purple-50 border-purple-100" },
  { id: "cliente_cerrado", color: "bg-green-500", light: "bg-green-50 border-green-100" },
];

const LEADS_PER_PAGE = 10;

function KanbanCard({ lead, index, onDelete, canViewSocials, onUpgradeClick }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const { lang } = useLang();
  const t = T[lang].funil;

  const whatsapp = lead.telefono
    ? `https://wa.me/${lead.telefono.replace(/\D/g, "")}`
    : null;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.nombre_empresa + " " + (lead.direccion || lead.ciudad))}`;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(lead.nombre_empresa);
    setCopied(true);
    const { dismiss } = toast({ title: t.copiedTitle, description: t.copiedDesc });
    setTimeout(() => { setCopied(false); dismiss(); }, 2500);
  };

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white border border-border rounded-xl p-2.5 shadow-sm transition-shadow group ${
            snapshot.isDragging ? "shadow-xl ring-2 ring-primary/30" : "hover:shadow-md"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-xs text-foreground leading-tight flex-1">{lead.nombre_empresa}</h3>
            
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={handleCopy} 
                className="p-1 hover:bg-slate-100 rounded text-muted-foreground hover:text-foreground transition-colors"
                title={t.copyName}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }} 
                className="p-1 hover:bg-red-50 rounded text-muted-foreground hover:text-red-500 transition-colors"
                title={t.removeLead}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {lead.segmento && (
            <span className="inline-block text-[10px] uppercase font-bold tracking-wider bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full mb-2">
              {lead.segmento}
            </span>
          )}

          <div className="space-y-1.5 mb-3">
            <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-muted-foreground leading-tight hover:text-primary hover:underline cursor-pointer"
                title={t.mapsTitle}
              >
                {lead.direccion || `${lead.ciudad}, ${lead.estado}`}
              </a>
            </div>
            {lead.telefono && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">{lead.telefono}</span>
              </div>
            )}
            {lead.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-warning fill-warning shrink-0" />
                <span className="text-xs font-medium text-muted-foreground">{lead.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2.5">
            {canViewSocials ? (
              <>
                {lead.website && (
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    <Globe className="w-3 h-3" /> Website
                  </a>
                )}
                <a
                  href={`https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(lead.nombre_empresa)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-medium text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-1.5 py-0.5 rounded transition-colors"
                  onClick={e => e.stopPropagation()}
                >
                  <Instagram className="w-3 h-3" /> Insta
                </a>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onUpgradeClick(); }}
                  className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 px-1.5 py-0.5 rounded transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  <Lock className="w-2.5 h-2.5 ml-0.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onUpgradeClick(); }}
                  className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 px-1.5 py-0.5 rounded transition-colors"
                >
                  <Instagram className="w-3 h-3" />
                  <Lock className="w-2.5 h-2.5 ml-0.5" />
                </button>
              </>
            )}
          </div>

          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-green-500/10 text-green-600 border border-green-500/20 text-xs font-bold hover:bg-green-500 hover:text-white transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {t.whatsappCall}
            </a>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default function Funil() {
  const { toast } = useToast();
  const { lang } = useLang();
  const t = T[lang].funil;
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [userPlanInfo, setUserPlanInfo] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Estados de Filtro
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPais, setFilterPais] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Paginação por coluna
  const [visibleCounts, setVisibleCounts] = useState({
    nuevos_leads: LEADS_PER_PAGE,
    en_contacto: LEADS_PER_PAGE,
    en_negociacion: LEADS_PER_PAGE,
    cliente_cerrado: LEADS_PER_PAGE,
  });

  useEffect(() => {
    fetchLeads();
    base44.functions.invoke("trackSearch", { action: "check" })
      .then(res => setUserPlanInfo(res.data))
      .catch(() => {});
  }, []);

  const fetchLeads = async () => {
    try {
      const currentUser = await base44.auth.me();
      if (!currentUser) {
        setLoading(false);
        return;
      }

      // Filtrar a busca para trazer apenas os leads onde user_email seja igual ao do utilizador logado
      const data = await base44.entities.SavedLead.filter({ user_email: currentUser.email });
      
      // Ordenar do mais recente para o mais antigo e limitar a 500 leads para performance
      const sortedData = data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 500);
      
      setLeads(sortedData);
    } catch (e) {
      toast({ title: t.loadError, description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = (id) => {
    setLeadToDelete(id);
  };

  const confirmDelete = async () => {
    if (!leadToDelete) return;
    try {
      await base44.entities.SavedLead.delete(leadToDelete);
      setLeads(prev => prev.filter(l => l.id !== leadToDelete));
      toast({ title: t.deletedToast });
    } catch (e) {
      toast({ title: t.deleteError, description: e.message, variant: "destructive" });
    } finally {
      setLeadToDelete(null);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, status_funil: newStatus } : l));

    try {
      await base44.entities.SavedLead.update(draggableId, { status_funil: newStatus });
    } catch (e) {
      toast({ title: t.moveError, description: e.message, variant: "destructive" });
      fetchLeads();
    }
  };

  // Filtragem e Listas
  const uniqueCountries = useMemo(() => {
    return [...new Set(leads.map(l => l.pais).filter(Boolean))].sort();
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (searchQuery.trim().length >= 2) {
        const query = searchQuery.toLowerCase();
        const mName = lead.nombre_empresa?.toLowerCase().includes(query);
        const mCity = lead.ciudad?.toLowerCase().includes(query);
        const mState = lead.estado?.toLowerCase().includes(query);
        const mCountry = lead.pais?.toLowerCase().includes(query);
        if (!mName && !mCity && !mState && !mCountry) return false;
      }
      if (filterPais && lead.pais !== filterPais) return false;
      if (filterStatus && lead.status_funil !== filterStatus) return false;
      return true;
    });
  }, [leads, searchQuery, filterPais, filterStatus]);

  const getColumnLeads = (colId) => filteredLeads.filter(l => l.status_funil === colId);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterPais("");
    setFilterStatus("");
  };

  const handleLoadMore = (colId) => {
    setVisibleCounts(prev => ({ ...prev, [colId]: prev[colId] + LEADS_PER_PAGE }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const canViewSocials = ['pro_max', 'enterprise'].includes(userPlanInfo?.plan);

  return (
    <div className="p-6 h-full flex flex-col">
      {showUpgrade && (
        <UpgradeModal reason={t.upgradeReason} onClose={() => setShowUpgrade(false)} />
      )}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">{t.title}</h1>
        <p className="text-muted-foreground text-sm mb-5">{t.subtitle}</p>

        {/* Filtros Inteligentes */}
        <div className="flex flex-col md:flex-row gap-3 bg-card p-3 rounded-xl border border-border shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterPais}
              onChange={(e) => setFilterPais(e.target.value)}
              className="px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-[140px]"
            >
              <option value="">{t.allCountries}</option>
              {uniqueCountries.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-[150px]"
            >
              <option value="">{t.allStages}</option>
              {COLUMNS.map(c => <option key={c.id} value={c.id}>{t.columns[c.id]}</option>)}
            </select>
            {(searchQuery || filterPais || filterStatus) && (
              <button 
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
              >
                <X className="w-4 h-4" /> {t.clear}
              </button>
            )}
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {COLUMNS.map(col => {
            const colLeads = getColumnLeads(col.id);
            const visibleLeads = colLeads.slice(0, visibleCounts[col.id]);
            const hasMore = colLeads.length > visibleCounts[col.id];

            return (
              <div key={col.id} className="flex-shrink-0 w-72">
                <div className={`rounded-xl border p-3 h-full flex flex-col ${col.light}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                      <h2 className="text-sm font-semibold text-foreground">{t.columns[col.id]}</h2>
                    </div>
                    <span className="text-xs bg-white border border-border text-muted-foreground px-2 py-0.5 rounded-full font-medium shadow-sm">
                      {colLeads.length}
                    </span>
                  </div>

                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 space-y-2.5 min-h-24 rounded-lg p-1 transition-colors ${
                          snapshot.isDraggingOver ? "bg-white/60" : ""
                        }`}
                      >
                        {visibleLeads.map((lead, i) => (
                          <KanbanCard 
                            key={lead.id} 
                            lead={lead} 
                            index={i} 
                            onDelete={handleDeleteLead}
                            canViewSocials={canViewSocials}
                            onUpgradeClick={() => setShowUpgrade(true)}
                          />
                        ))}
                        {provided.placeholder}
                        
                        {colLeads.length === 0 && !snapshot.isDraggingOver && (
                          <div className="flex items-center justify-center h-24 text-xs font-medium text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-xl bg-white/30">
                            {t.dragHere}
                          </div>
                        )}

                        {hasMore && (
                          <button
                            onClick={() => handleLoadMore(col.id)}
                            className="w-full py-2.5 mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors border border-primary/10"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            {t.loadMore} ({colLeads.length - visibleCounts[col.id]})
                          </button>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <AlertDialog open={!!leadToDelete} onOpenChange={(open) => !open && setLeadToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.dialogDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.keep}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white">
              {t.confirmRemove}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}