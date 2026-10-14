"use client";

import React, { useState } from "react";
import { Bookmark } from "lucide-react";

export function BookmarkButton({ questionId, initialBookmarked = false }: { questionId: string; initialBookmarked?: boolean }) {
  const [bookmarked, setBookmarked] = useState<boolean>(initialBookmarked);
  const [loading, setLoading] = useState<boolean>(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quiz/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarked(data.bookmarked);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label="Bookmark question"
      className={`p-2 rounded-xl transition-all ${
        bookmarked
          ? "bg-amber-500/10 text-amber-500 dark:bg-amber-950/60"
          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-amber-500" : ""}`} />
    </button>
  );
}
