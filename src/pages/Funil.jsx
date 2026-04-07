import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Phone, MapPin, Star, MessageCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const COLUMNS = [
  { id: "nuevos_leads", label: "Nuevos Leads", color: "bg-blue-500", light: "bg-blue-50 border-blue-100" },
  { id: "en_contacto", label: "En Contacto", color: "bg-amber-500", light: "bg-amber-50 border-amber-100" },
  { id: "en_negociacion", label: "En Negociación", color: "bg-purple-500", light: "bg-purple-50 border-purple-100" },
  { id: "cliente_cerrado", label: "Cliente Cerrado", color: "bg-green-500", light: "bg-green-50 border-green-100" },
];

function KanbanCard({ lead, index }) {
  const whatsapp = lead.telefono
    ? `https://wa.me/${lead.telefono.replace(/\D/g, "")}`
    : null;

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white border border-border rounded-xl p-3.5 shadow-sm transition-shadow ${
            snapshot.isDragging ? "shadow-xl ring-2 ring-primary/30" : "hover:shadow-md"
          }`}
        >
          <h3 className="font-semibold text-sm text-foreground leading-tight mb-2">{lead.nombre_empresa}</h3>

          {lead.segmento && (
            <span className="inline-block text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full mb-2">
              {lead.segmento}
            </span>
          )}

          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground">{lead.ciudad}, {lead.estado}</span>
            </div>
            {lead.telefono && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">{lead.telefono}</span>
              </div>
            )}
            {lead.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-warning fill-warning" />
                <span className="text-xs text-muted-foreground">{lead.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors"
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
    base44.entities.SavedLead.list("-created_date", 200).then(data => {
      setLeads(data);
      setLoading(false);
    });
  }, []);

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
      base44.entities.SavedLead.list("-created_date", 200).then(setLeads);
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
                    <span className="text-xs bg-white border border-border text-muted-foreground px-2 py-0.5 rounded-full font-medium">
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
                          <KanbanCard key={lead.id} lead={lead} index={i} />
                        ))}
                        {provided.placeholder}
                        {colLeads.length === 0 && !snapshot.isDraggingOver && (
                          <div className="flex items-center justify-center h-24 text-xs text-muted-foreground/60 border-2 border-dashed border-border/40 rounded-lg">
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