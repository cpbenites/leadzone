import { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown, Loader2, AlertCircle, Building2, Plus, Lock, Check, ChevronsUpDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Country, State, City } from "country-state-city";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LeadCard from "../components/LeadCard";
import NichoSuggester from "../components/NichoSuggester";
import UpgradeModal from "../components/UpgradeModal";
import { useToast } from "@/components/ui/use-toast";
import { useLang } from "@/lib/i18n";
import { APP_T } from "@/lib/translations/app";

const sendFbEvent = (event_name, custom_data = {}) => {
  base44.functions.invoke("fbEvent", { event_name, custom_data }).catch(() => {});
};

const LATAM_CODES = ["AR", "BO", "BR", "CL", "CO", "CR", "CU", "DO", "EC", "SV", "GT", "HN", "MX", "NI", "PA", "PY", "PE", "PR", "UY", "VE"];

function Combobox({ options, value, onChange, placeholder, disabled, emptyText }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between bg-background border border-input rounded-lg px-3 py-2.5 text-sm font-normal text-foreground hover:bg-background hover:text-foreground h-auto disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="truncate">
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Buscar...`} />
          <CommandList className="max-h-48 overflow-y-auto">
            <CommandEmpty>{emptyText || "No se encontraron resultados."}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function Dashboard() {
  const { toast } = useToast();
  const { lang } = useLang();
  const t = (APP_T[lang] || APP_T.es).dashboard;
  const [pais, setPais] = useState("");
  const [estado, setEstado] = useState("");
  const [ciudad, setCiudad] = useState("");

  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");

  const [nicho, setNicho] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [leads, setLeads] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");

  // Plan state
  const [userPlanInfo, setUserPlanInfo] = useState(null);

  // Pagination state
  const [nextPageToken, setNextPageToken] = useState(null);
  const [nextVariationIndex, setNextVariationIndex] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const handlePaisChange = (code) => {
    const country = availableCountries.find(c => c.isoCode === code);
    setSelectedCountryCode(code);
    setPais(country ? country.name : "");
    setEstado("");
    setCiudad("");
    setSelectedStateCode("");
    setAvailableStates(code ? State.getStatesOfCountry(code) : []);
    setAvailableCities([]);
  };

  const handleEstadoChange = (code) => {
    const state = availableStates.find(s => s.isoCode === code);
    setSelectedStateCode(code);
    setEstado(state ? state.name : "");
    setCiudad("");
    setAvailableCities(selectedCountryCode && code ? City.getCitiesOfState(selectedCountryCode, code) : []);
  };

  const handleCiudadChange = (name) => {
    setCiudad(name);
  };

  // Load plan info on mount + PageView event
  useEffect(() => {
    base44.functions.invoke("trackSearch", { action: "check" })
      .then(res => setUserPlanInfo(res.data))
      .catch(() => {});
    sendFbEvent("PageView");
  }, []);

  useEffect(() => {
    let allCountries = Country.getAllCountries();
    const currentPlan = userPlanInfo?.plan || "free";

    if (currentPlan === "free" || currentPlan === "starter") {
      allCountries = allCountries.filter(c => LATAM_CODES.includes(c.isoCode));
    }
    
    setAvailableCountries(allCountries);
  }, [userPlanInfo]);

  const isFree = userPlanInfo?.plan === "free" || !userPlanInfo;
  const canUseRatingFilter = userPlanInfo?.plan === "pro_max" || userPlanInfo?.plan === "enterprise";

  const handleSearch = async () => {
    if (!pais || !estado || !ciudad) {
      toast({ title: t.incompleteTitle, description: t.incompleteDesc, variant: "destructive" });
      return;
    }

    let deviceId = localStorage.getItem("lz_device_id");
    if (!deviceId) {
      deviceId = "dev_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem("lz_device_id", deviceId);
    }

    setLoading(true);
    setError("");

    try {
      const res = await base44.functions.invoke("searchLeads", {
        nicho: nicho ? nicho.trim() : "", ciudad, estado, pais,
        variationIndex: 0,
        deviceId: deviceId,
        ratingFilter
      });
      const d = res.data;

      base44.functions.invoke("trackSearch", { action: "check" })
        .then(resCheck => setUserPlanInfo(resCheck.data))
        .catch(() => {});

      setLeads([]);
      setSearched(true);
      setSavedIds(new Set());
      setNextPageToken(null);
      setNextVariationIndex(null);
      setHasMore(false);

      sendFbEvent("Search", { search_string: nicho || "geral", content_category: ciudad });
      const fetchedLeads = d.leads || [];

      if (userPlanInfo?.plan === "free" || !userPlanInfo) {
        setLeads(fetchedLeads.slice(0, 5));
        setHasMore(false);
      } else {
        setLeads(fetchedLeads);
        setNextPageToken(d.nextPageToken || null);
        setNextVariationIndex(d.nextVariationIndex ?? null);
        setHasMore(d.hasMore || false);
      }
    } catch (e) {
      const errorMessage = e.response?.data?.error || e.message || t.errorGeneric;
      if (errorMessage.includes("Límite") || errorMessage.includes("dispositivo") || e.response?.status === 403) {
        setUpgradeReason(errorMessage);
        setShowUpgrade(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (isFree) {
      setUpgradeReason(t.loadMoreUpgrade);
      setShowUpgrade(true);
      return;
    }
    setLoadingMore(true);
    try {
      const res = await base44.functions.invoke("searchLeads", {
        nicho: nicho ? nicho.trim() : "", ciudad, estado, pais,
        pageToken: nextPageToken || undefined,
        variationIndex: nextVariationIndex ?? 0,
        ratingFilter
      });
      const d = res.data;
      const fetchedLeads = d.leads || [];
      setLeads(prevLeads => {
        const existingIds = new Set(prevLeads.map(lead => lead.place_id));
        const uniqueNewLeads = fetchedLeads.filter(lead => !existingIds.has(lead.place_id));
        return [...prevLeads, ...uniqueNewLeads];
      });
      setNextPageToken(d.nextPageToken || null);
      setNextVariationIndex(d.nextVariationIndex ?? null);
      setHasMore(d.hasMore || false);
    } catch (e) {
      toast({ title: t.loadMoreError, description: e.message, variant: "destructive" });
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSave = async (lead) => {
    try {
      // 1. Obter o utilizador atual
      const currentUser = await base44.auth.me();
      
      if (!currentUser) {
        toast({ title: t.errorTitle, description: t.loginRequired, variant: "destructive" });
        return;
      }

      // 2. Salvar o lead com o user_email
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
        website: lead.website,
        status_funil: "nuevos_leads",
        user_email: currentUser.email // Associar o lead ao dono
      });
      setSavedIds(prev => new Set([...prev, lead.place_id || lead.nombre_empresa]));
      toast({ title: t.savedTitle, description: t.savedDesc });
    } catch (e) {
      toast({ title: t.saveErrorTitle, description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {showUpgrade && (
        <UpgradeModal reason={upgradeReason} onClose={() => setShowUpgrade(false)} />
      )}

      <div className="mb-8 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t.subtitle}</p>
        </div>

        {/* Plan badge */}
        {userPlanInfo && (
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2 text-xs">
            <span className="font-semibold text-foreground capitalize">{userPlanInfo.plan === "free" ? t.planFree : `${t.planPrefix} ${userPlanInfo.plan}`}</span>
            {userPlanInfo.plan === "free" ? (
            <span className="text-muted-foreground">
              {t.remainingToday(3 - (userPlanInfo.searches_today || 0))}
              </span>
            ) : (
              <span className="text-muted-foreground">
                {t.monthlyUsage(userPlanInfo.searches_this_month || 0, userPlanInfo.monthly_limit)}
              </span>
            )}
            <button
              onClick={() => { setUpgradeReason(""); setShowUpgrade(true); }}
              className="ml-1 text-primary font-semibold hover:underline"
            >
              {t.upgradeBtn}
            </button>
          </div>
        )}
      </div>

      <NichoSuggester onSelectNicho={(s) => setNicho(s)} />

      {/* Filters Card */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.country}</label>
            <Combobox
              options={availableCountries.map(p => ({ label: p.name, value: p.isoCode }))}
              value={selectedCountryCode}
              onChange={handlePaisChange}
              placeholder={t.selectCountry}
              emptyText={t.emptyCountry}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.state}</label>
            <Combobox
              disabled={!selectedCountryCode}
              options={availableStates.map(e => ({ label: e.name, value: e.isoCode }))}
              value={selectedStateCode}
              onChange={handleEstadoChange}
              placeholder={t.selectState}
              emptyText={t.emptyState}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.city}</label>
            <Combobox
              disabled={!selectedStateCode}
              options={availableCities.map(c => ({ label: c.name, value: c.name }))}
              value={ciudad}
              onChange={handleCiudadChange}
              placeholder={t.selectCity}
              emptyText={t.emptyCity}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.niche}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={nicho} onChange={e => setNicho(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder={t.nichePh}
                className="w-full bg-background border border-input rounded-lg pl-9 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.reputation}</label>
            <div className="relative">
              <select 
                value={ratingFilter} 
                onChange={e => setRatingFilter(e.target.value)} 
                disabled={!canUseRatingFilter}
                className="w-full appearance-none bg-background border border-input rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-8 disabled:opacity-40 disabled:cursor-not-allowed">
                <option value="all">{t.ratingAll}</option>
                <option value="help">{t.ratingHelp}</option>
                <option value="growth">{t.ratingGrowth}</option>
                <option value="elite">{t.ratingElite}</option>
              </select>
              {!canUseRatingFilter ? (
                <Lock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              ) : (
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              )}
            </div>
          </div>
        </div>

        {ciudad && (
          <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{t.searchingLabel} <strong className="text-foreground">{t.searchPreview(nicho, ciudad, estado, pais)}</strong></span>
          </div>
        )}

        <button onClick={handleSearch} disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? t.searchingBtn : t.searchBtn}
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
          <p className="font-medium">{t.noResults}</p>
          <p className="text-sm mt-1">{t.tryOther}</p>
        </div>
      )}

      {/* Results */}
      {leads.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">{t.foundCount(leads.length)}</h2>
            <span className="text-xs text-muted-foreground">{ciudad}, {estado}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {leads.map((lead, i) => (
              <LeadCard
                key={`${lead.place_id || lead.nombre_empresa}-${i}`}
                lead={lead}
                onSave={handleSave}
                saved={savedIds.has(lead.place_id || lead.nombre_empresa)}
                canViewSocials={userPlanInfo?.plan === 'pro_max' || userPlanInfo?.plan === 'enterprise'}
                onUpgradeClick={() => { setUpgradeReason(t.socialsUpgrade); setShowUpgrade(true); }}
              />
            ))}
          </div>

          {/* Load More — locked for free, functional for paid */}
          {(hasMore || isFree) && searched && (
            <div className="flex flex-col items-center mt-10 gap-2">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`flex items-center gap-2 px-10 py-3 rounded-xl text-sm font-semibold transition-all shadow-md ${
                  isFree
                    ? "bg-secondary text-muted-foreground border border-border cursor-pointer hover:bg-secondary/80"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                }`}
              >
                {isFree ? <Lock className="w-4 h-4" /> : loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {isFree ? t.loadMoreLocked : loadingMore ? t.loadingMore : t.loadMore}
              </button>
              {isFree && (
                <p className="text-xs text-muted-foreground">{t.freeLimitNote}</p>
              )}
              {!isFree && (
                <p className="text-xs text-muted-foreground">{t.searchingMore(ciudad)}</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}