import { MapPin, Phone, Star, Bookmark, CheckCircle } from "lucide-react";
import { MessageCircle } from "lucide-react";

export default function LeadCard({ lead, onSave, saved }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground text-sm leading-tight">{lead.nombre_empresa}</h3>
        {lead.rating && (
          <div className="flex items-center gap-1 shrink-0 bg-warning/10 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 text-warning fill-warning" />
            <span className="text-xs font-semibold text-warning">{lead.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {lead.direccion && (
        <div className="flex items-start gap-1.5 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span className="text-xs leading-relaxed">{lead.direccion}</span>
        </div>
      )}

      {lead.telefono && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs flex-1">{lead.telefono}</span>
          <a
            href={`https://wa.me/${lead.telefono.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors text-xs font-semibold"
          >
            <MessageCircle className="w-3 h-3" />
            WhatsApp
          </a>
        </div>
      )}

      <button
        onClick={() => onSave(lead)}
        disabled={saved}
        className={`mt-auto flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
          saved
            ? "bg-success/10 text-success border border-success/20 cursor-default"
            : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
        }`}
      >
        {saved ? (
          <>
            <CheckCircle className="w-3.5 h-3.5" />
            Lead Guardado
          </>
        ) : (
          <>
            <Bookmark className="w-3.5 h-3.5" />
            Guardar Lead
          </>
        )}
      </button>
    </div>
  );
}