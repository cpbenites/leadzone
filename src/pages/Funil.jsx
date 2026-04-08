import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Phone, MapPin, Star, MessageCircle, Loader2, Trash2, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const COLUMNS = [
  { id: "nuevos_leads", label: "Nuevos Leads", color: "bg-blue-500", light: "bg-blue-50 border-blue-100" },
  { id: "en_contacto", label: "En Contacto", color: "bg-amber-500", light: "bg-amber-50 border-amber-100" },
  { id: "en_negociacion", label: "En Negociación", color: "bg-purple-500", light: "bg-purple-50 border-purple-100" },
  { id: "cliente_cerrado", label: "Cliente Cerrado", color: "bg-green-500", light: "bg-green-50 border-green-100" },
];

function KanbanCard({ lead, index, onDelete }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const whatsapp = lead.telefono
    ? `https://wa.me/${lead.telefono.replace(/\D/g, "")}`
    : null;

  // Cria a URL de pesquisa exata no Google Maps com o nome da empresa e a localização
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.nombre_empresa + " " + (lead.direccion || lead.ciudad))}`;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(lead.nombre_empresa);
    setCopied(true);
    
    // Capturamos a referência do toast criado
    const { dismiss } = toast({ 
      title: "Copiado", 
      description: "Nombre de la empresa copiado."
    });

    // Restaurar ícone e fechar o toast após 2.5s
    setTimeout(() => {
      setCopied(false);
      dismiss(); // Força o fechamento do toast específico
    }, 2500);
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
                title="Copiar nombre"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }} 
                className="p-1 hover:bg-red-50 rounded text-muted-foreground hover:text-red-500 transition-colors"
                title="Eliminar lead"
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
              {/* Endereço agora é clicável e abre no Google Maps */}
              <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // Impede que arraste o card ao clicar no link
                className="text-xs text-muted-foreground leading-tight hover:text-primary hover:underline cursor-pointer"
                title="Ver perfil en Google Maps"
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

          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-green-500/10 text-green-600 border border-green-500/20 text-xs font-bold hover:bg-green-500 hover:text-white transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Llamar por WhatsApp
            </a>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default function Funil() {
  const { toast } = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    base44.entities.SavedLead.list("-created_date", 200).then(data => {
      setLeads(data);
      setLoading(false);
    });
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este lead? Esta acción no se puede deshacer.")) return;
    
    try {
      await base44.entities.SavedLead.delete(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      toast({ title: "Lead eliminado correctamente." });
    } catch (e) {
      toast({ title: "Error al eliminar", description: e.message, variant: "destructive" });
    }
  };

  const getColumnLeads = (colId) => leads.filter(l => l.status_funil === colId);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, status_funil: newStatus } : l));

    try {
      await base44.entities.SavedLead.update(draggableId, { status_funil: newStatus });
    } catch (e) {
      toast({ title: "Error al mover lead", description: e.message, variant: "destructive" });
      fetchLeads();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Mi Embudo CRM</h1>
        <p className="text-muted-foreground mt-1 text-sm">Arrastra los leads entre columnas para actualizar su estado</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {COLUMNS.map(col => {
            const colLeads = getColumnLeads(col.id);
            return (
              <div key={col.id} className="flex-shrink-0 w-72">
                <div className={`rounded-xl border p-3 h-full flex flex-col ${col.light}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                      <h2 className="text-sm font-semibold text-foreground">{col.label}</h2>
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
                        {colLeads.map((lead, i) => (
                          <KanbanCard key={lead.id} lead={lead} index={i} onDelete={handleDeleteLead} />
                        ))}
                        {provided.placeholder}
                        {colLeads.length === 0 && !snapshot.isDraggingOver && (
                          <div className="flex items-center justify-center h-24 text-xs font-medium text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-xl bg-white/30">
                            Arrastra leads aquí
                          </div>
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
    </div>
  );
}