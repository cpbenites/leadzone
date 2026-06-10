import { useState } from "react";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLang } from "@/lib/i18n";
import { T } from "@/lib/translations";

export default function NichoSuggester({ onSelectNicho }) {
  const [servicos, setServicos] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  const t = T[lang].nicho;

  const handleSuggest = async () => {
    if (!servicos.trim()) return;
    setLoading(true);
    setSugestoes([]);
    const prompt = lang === "pt"
      ? `Sou um vendedor/prestador de serviços. Meus serviços são: "${servicos}".
Me dê uma lista de 15 tipos de estabelecimentos comerciais que poderiam precisar dos meus serviços e ser meu público-alvo.
Responda SOMENTE com os tipos de estabelecimentos, em português, sem explicações adicionais.`
      : `Soy un vendedor/proveedor de servicios. Mis servicios son: "${servicos}".
Dame una lista de 15 tipos de establecimientos comerciales que podrían necesitar mis servicios y ser mi público objetivo.
Responde SOLO con los tipos de establecimientos, sin explicaciones adicionales.`;

    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          establecimientos: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    });
    setSugestoes(res.establecimientos || []);
    setLoading(false);
  };

  return (
    <div className="bg-card border border-border rounded-2xl mb-6 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">{t.title}</p>
            <p className="text-xs text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="p-4 pt-0 border-t border-border">
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <textarea
              value={servicos}
              onChange={e => setServicos(e.target.value)}
              placeholder={t.placeholder}
              rows={2}
              className="flex-1 bg-background border border-input rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
            />
            <button
              onClick={handleSuggest}
              disabled={loading || !servicos.trim()}
              className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap h-fit self-end"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? t.analyzing : t.suggest}
            </button>
          </div>

          {sugestoes.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
                {sugestoes.length} {t.suggestedLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {sugestoes.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectNicho(s)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground transition-all border border-accent/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}