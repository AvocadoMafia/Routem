"use client";

import { HiArrowDownOnSquare } from "react-icons/hi2";
import { Route } from "@/lib/types/domain";
import { useTranslations } from "next-intl";
import { errorStore } from "@/lib/stores/errorStore";

type ImportButtonProps = {
  route: Route;
  variant?: "compact" | "large";
};

export default function ImportButton({ route, variant = "compact" }: ImportButtonProps) {
  const t = useTranslations("routes");
  const appendError = errorStore(state => state.appendError);

  const handleImport = () => {
    try {
      localStorage.setItem("imported_route_data", JSON.stringify(route));
      window.location.href = "/routes/new";
    } catch (error: any) {
      console.error("Failed to import route:", error);
      appendError({
        code: "IMPORT_ERROR",
        message: "ルートの取り込みに失敗しました。"
      });
    }
  };

  if (variant === "large") {
    return (
      <button
        onClick={handleImport}
        className="group flex items-center gap-4 px-8 py-4 bg-background-0 border border-grass rounded-full transition-all shadow-sm hover:shadow-xl hover:shadow-accent-0/10 cursor-pointer hover:border-accent-0"
      >
        <HiArrowDownOnSquare className="w-6 h-6 text-accent-0 group-hover:scale-125 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-0">
          {t("importRoute")}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleImport}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground-0/5 hover:bg-foreground-0/10 text-foreground-1 rounded-lg transition-all active:scale-95 border border-foreground-0/5"
      title={t("importRoute")}
    >
      <HiArrowDownOnSquare className="w-4 h-4 text-accent-0" />
      <span className="text-[10px] font-bold uppercase tracking-wider">{t("importRoute")}</span>
    </button>
  );
}
