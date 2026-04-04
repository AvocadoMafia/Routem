"use client";

import { useState } from "react";
import { HiShare, HiCheck } from "react-icons/hi2";

type ShareButtonProps = {
  variant?: "compact" | "large";
};

export default function ShareButton({ variant = "compact" }: ShareButtonProps) {
  const [isCopying, setIsCopying] = useState(false);

  const handleShare = async () => {
    // Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // User cancelled or share failed
        console.warn("Share failed", err);
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  if (variant === "large") {
    return (
      <button 
        onClick={handleShare}
        className="group flex items-center gap-4 px-8 py-4 bg-background-0 border border-grass rounded-full transition-all shadow-sm hover:shadow-xl hover:shadow-accent-0/10 cursor-pointer hover:border-accent-0"
      >
        {isCopying ? (
          <HiCheck className="w-6 h-6 text-accent-0" />
        ) : (
          <HiShare className="w-6 h-6 text-accent-0 group-hover:scale-125 transition-transform" />
        )}
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-0">
          {isCopying ? "Copied!" : "Share this route"}
        </span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-1.5 text-foreground-1 hover:text-accent-0 transition-colors"
      title="Share"
    >
      {isCopying ? (
        <HiCheck className="w-3.5 h-3.5" />
      ) : (
        <HiShare className="w-3.5 h-3.5" />
      )}
      <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
        {isCopying ? "Copied!" : "Share"}
      </span>
    </button>
  );
}
