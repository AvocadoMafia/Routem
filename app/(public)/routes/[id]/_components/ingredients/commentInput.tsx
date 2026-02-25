"use client";

import { useState } from "react";

export default function CommentInput() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div 
      className={`p-[1px] rounded-3xl transition-all duration-300 ${
        isFocused ? "bg-linear-to-r from-accent-1 to-accent-0 shadow-sm" : "bg-foreground-0/10"
      }`}
    >
      <div className="flex flex-col gap-4 p-6 rounded-[23px] w-full bg-background-1">
        <textarea
          placeholder="Write a comment..."
          className="w-full bg-transparent border-none outline-none text-foreground-0 placeholder:text-foreground-1/40 resize-none min-h-[120px] text-lg leading-relaxed"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-accent-1 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:opacity-90 transition-all shadow-lg shadow-accent-1/20">
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}
