"use client";

import { MdClose, MdExplore, MdLocationOn, MdCalendarMonth, MdAccessTime, MdPeople, MdPayments, MdLocalOffer } from "react-icons/md";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { userStore } from "@/lib/client/stores/userStore";
import { enumsStore } from "@/lib/client/stores/enumsStore";
import { dbLocaleToAppLocale } from "@/lib/client/helpers";
import { CurrencyCode } from "@prisma/client";

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

const DEFAULT_CURRENCY_BY_LANGUAGE: Record<string, CurrencyCode> = {
  ja: CurrencyCode.JPY,
  en: CurrencyCode.USD,
  ko: CurrencyCode.KRW,
  zh: CurrencyCode.CNY,
};

// API未取得時のフォールバック。OTHERは表示しても意味がないので除外。
const CURRENCY_FALLBACK: CurrencyCode[] = Object.values(CurrencyCode).filter(
  (c) => c !== CurrencyCode.OTHER,
);

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function ExploreCard({ isSidebar = false }: ExploreCardProps) {
  const t = useTranslations("explore");
  const tFilter = useTranslations("filter");
  const router = useRouter();
  const searchParams = useSearchParams();

  const user = userStore((state) => state.user);
  const routeForOptions = enumsStore((state) => state.routeFor);
  const currencyOptions = enumsStore((state) => state.currencyCode);

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [whenMonth, setWhenMonth] = useState("");
  const [days, setDays] = useState("");
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
    setDays(searchParams.get("days") ?? "");
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

    const daysNumber = Number(days);
    if (Number.isInteger(daysNumber) && daysNumber > 0) {
      params.set("days", String(daysNumber));
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
      fontWeight: 800,
      letterSpacing: "0.05em",
      transform: "translate(14px, -10px) scale(1)",
      backgroundColor: "#fcfaf2", // しおりの背景色に合わせる
      padding: "0 6px",
      borderRadius: "4px",
      zIndex: 1,
      "&.Mui-focused": {
        color: "var(--accent-0)",
      },
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      color: "var(--foreground-0)",
      backgroundColor: "transparent",
      transition: "all 0.2s ease-in-out",
      "& fieldset": {
        borderColor: "rgba(var(--foreground-0-rgb), 0.12)",
        borderWidth: "1.2px",
      },
      "&:hover fieldset": {
        borderColor: "rgba(var(--foreground-0-rgb), 0.25)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--accent-0)",
        borderWidth: "2px",
      },
    },
    "& input": {
      color: "var(--foreground-0)",
      fontSize: "0.9rem",
      padding: "10px 14px",
      fontWeight: 600,
    },
    "& .MuiSelect-select": {
      padding: "10px 14px",
      fontWeight: 600,
    },
    "& .MuiInputAdornment-root": {
      color: "var(--foreground-1)",
    },
  };

  const StepLabel = ({ icon: Icon, text }: { icon: any; text: string }) => (
    <div className="flex items-center gap-2 mb-1 ml-1">
      <Icon className="text-accent-0 text-base" />
      <span className="text-[10px] font-bold text-foreground-1 uppercase tracking-wider">{text}</span>
    </div>
  );

  const HandwrittenArrow = () => (
    <span className="font-caveat text-2xl text-accent-0/40 mr-2 -translate-y-1 inline-block select-none">
      →
    </span>
  );

  const cardContent = (
    <div className="flex flex-col gap-5 relative">
      {/* Bookmark Ribbon Decor */}
      <div className="absolute -top-12 right-8 w-6 h-12 bg-accent-0 rounded-b-sm shadow-md flex items-end justify-center pb-1.5 z-10">
        <div className="w-0.5 h-6 bg-white/20 rounded-full mb-1" />
      </div>

      <div className="flex flex-row items-start justify-between text-left gap-2">
        <div className="relative pt-1">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl font-bold text-foreground-0 leading-tight -rotate-2 origin-left">
                {t("findYourRoute")}
            </h1>
            <div className="w-full h-0.5 bg-accent-0/30 -rotate-1 -mt-0.5 rounded-full self-start" />
          </motion.div>
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

      <div className="space-y-4">
        {/* Step 1: What */}
        <div className="relative" ref={tagBoxRef}>
          <StepLabel icon={MdLocalOffer} text={t("stepWhat")} />
          <div className="flex items-center">
            <HandwrittenArrow />
            <TextField
              placeholder={t("whatPlaceholder")}
              fullWidth
              variant="outlined"
              value={what}
              onChange={(e) => {
                setWhat(e.target.value);
                setShowTagSuggestions(true);
              }}
              onFocus={() => setShowTagSuggestions(true)}
              sx={textFieldSx}
            />
          </div>
          {showTagSuggestions && tagSuggestions.length > 0 && (
            <div className="absolute z-30 mt-1 w-full rounded-xl border border-grass bg-white shadow-xl overflow-hidden">
              {tagSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-background-0 transition-colors font-medium"
                  onClick={() => {
                    setWhat(tag);
                    setShowTagSuggestions(false);
                  }}
                >
                  # {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Where */}
        <div className="relative" ref={placeBoxRef}>
          <StepLabel icon={MdLocationOn} text={t("stepWhere")} />
          <div className="flex items-center">
            <HandwrittenArrow />
            <TextField
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
              sx={textFieldSx}
            />
          </div>
          {showPlaceSuggestions && placeSuggestions.length > 0 && (
            <div className="absolute z-30 mt-1 w-full rounded-xl border border-grass bg-white shadow-xl overflow-hidden max-h-64 overflow-y-auto">
              {placeSuggestions.map((s) => (
                <button
                  key={s.mapbox_id}
                  type="button"
                  className="block w-full text-left px-4 py-3 hover:bg-background-0 transition-colors"
                  onClick={() => handleSelectPlace(s)}
                >
                  <div className="text-sm font-bold text-foreground-0 truncate">{s.name}</div>
                  <div className="text-[10px] text-foreground-1 truncate uppercase tracking-tight">
                    {s.full_address}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 3: When & Days */}
        <div>
          <StepLabel icon={MdCalendarMonth} text={t("stepWhen")} />
          <div className="flex items-center">
            <HandwrittenArrow />
            <div className="grid grid-cols-2 gap-4 flex-1">
              <TextField
                select
                fullWidth
                value={whenMonth}
                onChange={(e) => setWhenMonth(e.target.value)}
                sx={textFieldSx}
                SelectProps={{ displayEmpty: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdCalendarMonth className="text-accent-0" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">{tFilter("allSeasons")}</MenuItem>
                {MONTHS.map((m) => (
                  <MenuItem key={m} value={String(m)}>
                    {m}月
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                placeholder={t("daysPlaceholder")}
                type="number"
                fullWidth
                value={days}
                onChange={(e) => setDays(e.target.value)}
                sx={textFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdAccessTime className="text-accent-0" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
        </div>

        {/* Step 4: Who */}
        <div>
          <StepLabel icon={MdPeople} text={t("stepWho")} />
          <div className="flex items-center">
            <HandwrittenArrow />
            <TextField
              select
              fullWidth
              value={who}
              onChange={(e) => setWho(e.target.value)}
              sx={textFieldSx}
              SelectProps={{ displayEmpty: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdPeople className="text-accent-0" />
                  </InputAdornment>
                ),
              }}
            >
              {(routeForOptions.length
                ? routeForOptions
                : ["EVERYONE", "SOLO", "FRIENDS", "FAMILY", "COUPLE"]
              ).map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {whoLabel(opt)}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>

        {/* Step 5: Budget */}
        <div>
          <StepLabel icon={MdPayments} text={t("stepBudget")} />
          <div className="flex items-center">
            <HandwrittenArrow />
            <div className="grid grid-cols-[100px_1fr] gap-4 flex-1">
              <TextField
                select
                fullWidth
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                sx={textFieldSx}
                SelectProps={{ displayEmpty: true }}
              >
                {(currencyOptions.length
                  ? currencyOptions
                  : CURRENCY_FALLBACK
                ).map((code) => (
                  <MenuItem key={code} value={code}>
                    {code}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                type="number"
                fullWidth
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                sx={textFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span className="text-foreground-0 font-bold text-xs">MAX</span>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="group relative w-full py-4 mt-1 bg-grass text-white rounded-2xl font-black overflow-hidden transition-all duration-300 hover:bg-accent-0 hover:scale-[1.02] active:scale-[0.98]"
      >
        <span className="relative z-10 tracking-[0.2em] uppercase text-xs">
          {t("searchRoutes")}
        </span>
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
                className="fixed bottom-0 left-0 right-0 z-[120] bg-[#fcfaf2] rounded-t-[24px] px-6 pt-6 pb-10 max-h-[90vh] overflow-y-auto"
              >
                <div className="w-12 h-1 bg-grass rounded-full mx-auto mb-6 opacity-50" />
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
        px-8 py-10 flex flex-col gap-8 backdrop-blur-xl bg-background-0 relative overflow-hidden
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
