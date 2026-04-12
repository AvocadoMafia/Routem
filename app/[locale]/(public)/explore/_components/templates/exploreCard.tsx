"use client";

import { MdClose, MdExplore } from "react-icons/md";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { userStore } from "@/lib/client/stores/userStore";
import { searchEnumsStore } from "@/lib/client/stores/searchEnumsStore";
import { dbLocaleToAppLocale } from "@/lib/client/helpers";

interface ExploreCardProps {
  isSidebar?: boolean;
}

type TagSuggestionsResponse = string[];

type MapboxSuggestion = {
  name: string;
  full_address: string;
  mapbox_id: string;
  feature_type: string;
};

type MapboxSuggestResponse = {
  suggestions?: MapboxSuggestion[];
};

type MapboxRetrieveResponse = {
  features?: Array<{
    geometry?: { coordinates?: number[] };
    properties?: {
      mapbox_id?: string;
      name?: string;
      full_address?: string;
    };
  }>;
};

const DEFAULT_CURRENCY_BY_LANGUAGE: Record<string, string> = {
  ja: "JPY",
  en: "USD",
  ko: "KRW",
  zh: "CNY",
};

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function ExploreCard({ isSidebar = false }: ExploreCardProps) {
  const t = useTranslations("explore");
  const tFilter = useTranslations("filter");
  const router = useRouter();
  const searchParams = useSearchParams();

  const user = userStore((state) => state.user);
  const routeForOptions = searchEnumsStore((state) => state.routeFor);
  const currencyOptions = searchEnumsStore((state) => state.currencyCode);

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [whenMonth, setWhenMonth] = useState("");
  const [who, setWho] = useState("EVERYONE");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");

  const [lat, setLat] = useState<string | null>(null);
  const [lng, setLng] = useState<string | null>(null);

  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const [placeSuggestions, setPlaceSuggestions] = useState<MapboxSuggestion[]>([]);
  const [showPlaceSuggestions, setShowPlaceSuggestions] = useState(false);

  const tagBoxRef = useRef<HTMLDivElement>(null);
  const placeBoxRef = useRef<HTMLDivElement>(null);

  const sessionToken = useMemo(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `explore-${Date.now()}`;
  }, []);

  const whoLabel = (value: string) => {
    switch (value) {
      case "EVERYONE":
        return tFilter("everyone");
      case "FAMILY":
        return tFilter("family");
      case "FRIENDS":
        return tFilter("friends");
      case "COUPLE":
        return tFilter("couples");
      case "SOLO":
        return tFilter("solo");
      default:
        return value;
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setWhat(searchParams.get("what") ?? searchParams.get("q") ?? "");
    setWhere(searchParams.get("where") ?? "");
    setWho(searchParams.get("who") ?? "EVERYONE");
    setWhenMonth(searchParams.get("when") ?? "");
    setBudgetAmount(searchParams.get("maxAmount") ?? "");
    setCurrencyCode(searchParams.get("currencyCode") ?? "");
    setLat(searchParams.get("lat"));
    setLng(searchParams.get("lng"));
  }, [searchParams]);

  useEffect(() => {
    if (currencyCode) return;
    if (!currencyOptions.length) return;
    const appLocale = user.locale
      ? dbLocaleToAppLocale(user.locale)
      : dbLocaleToAppLocale(user.language);
    const preferred = DEFAULT_CURRENCY_BY_LANGUAGE[appLocale || ""];
    const next = preferred && currencyOptions.includes(preferred) ? preferred : currencyOptions[0];
    setCurrencyCode(next);
  }, [currencyCode, currencyOptions, user.locale, user.language]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (tagBoxRef.current && !tagBoxRef.current.contains(target)) {
        setShowTagSuggestions(false);
      }
      if (placeBoxRef.current && !placeBoxRef.current.contains(target)) {
        setShowPlaceSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const q = what.trim();
    if (!q) {
      setTagSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/tags?q=${encodeURIComponent(q)}&limit=8`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = (await res.json()) as TagSuggestionsResponse;
        setTagSuggestions(data ?? []);
      } catch {
        setTagSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [what]);

  useEffect(() => {
    const q = where.trim();
    if (!q) {
      setPlaceSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const url = `/api/v1/mapbox/geocode?q=${encodeURIComponent(q)}&session_token=${encodeURIComponent(sessionToken)}`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) return;
        const data = (await res.json()) as MapboxSuggestResponse;
        setPlaceSuggestions(data.suggestions ?? []);
      } catch {
        setPlaceSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [where, sessionToken]);

  const handleSelectPlace = async (suggestion: MapboxSuggestion) => {
    try {
      const url = `/api/v1/mapbox/geocode?mapbox_id=${encodeURIComponent(suggestion.mapbox_id)}&session_token=${encodeURIComponent(sessionToken)}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) return;
      const data = (await res.json()) as MapboxRetrieveResponse;
      const feature = data.features?.[0];
      const coordinates = feature?.geometry?.coordinates;
      if (!coordinates || coordinates.length < 2) return;

      const nextLng = coordinates[0];
      const nextLat = coordinates[1];
      const name = feature?.properties?.name || feature?.properties?.full_address || suggestion.name;

      setWhere(name);
      setLng(String(nextLng));
      setLat(String(nextLat));
      setShowPlaceSuggestions(false);
    } catch {
      // noop
    }
  };

  const handleSearch = () => {
    setIsMobileModalOpen(false);

    const params = new URLSearchParams();
    const tag = what.trim();
    const place = where.trim();

    if (tag) {
      params.set("what", tag);
      params.set("q", tag);
    }
    if (place) params.set("where", place);

    if (lat && lng) {
      params.set("lat", lat);
      params.set("lng", lng);
    }

    const monthNumber = Number(whenMonth);
    if (Number.isInteger(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
      params.set("when", String(monthNumber));
    }

    if (who && who !== "EVERYONE") {
      params.set("who", who);
    }

    const maxAmount = Number(budgetAmount);
    if (Number.isFinite(maxAmount) && maxAmount > 0 && currencyCode) {
      params.set("currencyCode", currencyCode);
      params.set("minAmount", "0");
      params.set("maxAmount", String(Math.floor(maxAmount)));
    }

    const query = params.toString();
    router.push(query ? `/explore?${query}` : "/explore");
  };

  const textFieldSx = {
    "& .MuiInputLabel-root": {
      color: "var(--foreground-1)",
      fontSize: "0.75rem",
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      transform: "translate(14px, -9px) scale(1)",
      backgroundColor: "var(--background-1)",
      padding: "0 8px",
      borderRadius: "4px",
      zIndex: 1,
      "&.Mui-focused": {
        color: "var(--accent-0)",
      },
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      color: "var(--foreground-0)",
      backgroundColor: "var(--background-1)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "& fieldset": {
        borderColor: "rgba(var(--foreground-0-rgb), 0.08)",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "rgba(var(--foreground-0-rgb), 0.2)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--accent-0)",
        borderWidth: "2px",
      },
    },
    "& input": {
      color: "var(--foreground-0)",
      fontSize: "0.95rem",
      padding: "16px",
      fontWeight: 500,
    },
    "& .MuiSelect-select": {
      padding: "16px",
    },
    "& .MuiSelect-icon": {
      color: "var(--foreground-1) !important",
      right: "12px",
      transition: "all 0.3s ease",
    },
  };

  const cardContent = (
    <div className="flex flex-col gap-10">
      <div className="flex flex-row items-start justify-between text-left gap-3">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-accent-0 flex items-center justify-center shadow-lg shadow-accent-0/20">
            <MdExplore className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground-0">{t("explore")}</h1>
            <p className="text-[10px] font-bold text-accent-0 tracking-[0.2em] uppercase">
              {t("findYourNextStory")}
            </p>
          </div>
        </div>
        {isMobile && isSidebar && (
          <button
            onClick={() => setIsMobileModalOpen(false)}
            className="p-2 rounded-full bg-background-0 text-foreground-1 shadow-sm z-50 hover:bg-grass transition-colors"
          >
            <MdClose size={24} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="relative" ref={tagBoxRef}>
          <TextField
            label={t("what")}
            placeholder={t("whatPlaceholder")}
            fullWidth
            variant="outlined"
            value={what}
            onChange={(e) => {
              setWhat(e.target.value);
              setShowTagSuggestions(true);
            }}
            onFocus={() => setShowTagSuggestions(true)}
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
          />
          {showTagSuggestions && tagSuggestions.length > 0 && (
            <div className="absolute z-30 mt-2 w-full rounded-xl border border-grass bg-background-1 shadow-xl overflow-hidden">
              {tagSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-background-0"
                  onClick={() => {
                    setWhat(tag);
                    setShowTagSuggestions(false);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={placeBoxRef}>
          <TextField
            label={t("where")}
            placeholder={t("wherePlaceholder")}
            fullWidth
            variant="outlined"
            value={where}
            onChange={(e) => {
              setWhere(e.target.value);
              setLat(null);
              setLng(null);
              setShowPlaceSuggestions(true);
            }}
            onFocus={() => setShowPlaceSuggestions(true)}
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
          />
          {showPlaceSuggestions && placeSuggestions.length > 0 && (
            <div className="absolute z-30 mt-2 w-full rounded-xl border border-grass bg-background-1 shadow-xl overflow-hidden max-h-64 overflow-y-auto">
              {placeSuggestions.map((s) => (
                <button
                  key={s.mapbox_id}
                  type="button"
                  className="block w-full text-left px-4 py-2 hover:bg-background-0"
                  onClick={() => handleSelectPlace(s)}
                >
                  <div className="text-sm font-semibold text-foreground-0 truncate">{s.name}</div>
                  <div className="text-xs text-foreground-1 truncate">{s.full_address}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <TextField
            select
            label={t("when")}
            fullWidth
            value={whenMonth}
            onChange={(e) => setWhenMonth(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
          >
            <MenuItem value="">-</MenuItem>
            {MONTHS.map((m) => (
              <MenuItem key={m} value={String(m)}>
                {m}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label={t("who")}
            fullWidth
            value={who}
            onChange={(e) => setWho(e.target.value)}
            sx={textFieldSx}
            InputLabelProps={{ shrink: true }}
          >
            {(routeForOptions.length ? routeForOptions : ["EVERYONE", "SOLO", "FRIENDS", "FAMILY", "COUPLE"]).map((opt) => (
              <MenuItem key={opt} value={opt}>
                {whoLabel(opt)}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <TextField
            select
            label="Currency"
            fullWidth
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={textFieldSx}
          >
            {(currencyOptions.length ? currencyOptions : ["JPY", "USD", "EUR", "KRW", "CNY"]).map((code) => (
              <MenuItem key={code} value={code}>
                {code}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={t("budget")}
            type="number"
            fullWidth
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            sx={textFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className="text-foreground-0 font-light mr-1">{currencyCode || "-"}</span>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="group relative w-full py-5 mt-2 bg-foreground-0 text-background-0 rounded-2xl font-bold overflow-hidden transition-all duration-300 hover:bg-accent-0 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-foreground-0/10"
      >
        <span className="relative z-10 tracking-widest uppercase text-sm">{t("searchRoutes")}</span>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-1">
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            {"\u003e"}
          </motion.span>
        </div>
      </button>
    </div>
  );

  if (isMobile && isSidebar) {
    return (
      <>
        <button
          onClick={() => setIsMobileModalOpen(true)}
          className="fixed bottom-8 right-8 z-[100] w-14 h-14 rounded-full bg-accent-0 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          <MdExplore size={28} />
        </button>

        <AnimatePresence>
          {isMobileModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileModalOpen(false)}
                className="fixed inset-0 bg-black/40 z-[110] backdrop-blur-sm"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 z-[120] bg-background-1 rounded-t-[24px] px-6 pt-8 pb-12 max-h-[90vh] overflow-y-auto"
              >
                <div className="w-12 h-1 bg-grass rounded-full mx-auto mb-8 opacity-50" />
                {cardContent}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        w-full max-w-[480px] h-auto
        px-10 py-12 flex flex-col gap-10 backdrop-blur-xl bg-background-1
        ${isSidebar ? "hidden md:flex h-full border-r-1 border-grass shadow-none rounded-none" : "rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] mx-4"}
      `}
      transition={{
        layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.5 },
        x: { duration: 0.5 },
      }}
    >
      {cardContent}
    </motion.div>
  );
}
