"use client";

import React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

interface ToastProps {
  message: string | null;
}

/**
 * [Design Read] Family: Minimalist Floating Pill | Variance: 5/10 | Motion: 8/10 | Density: 5/10 | Accent: Vermilion & Emerald
 */
export default function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] transition-all transform animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-zinc-900/95 dark:bg-zinc-100/95 text-white dark:text-zinc-900 shadow-xl shadow-black/25 text-xs font-semibold backdrop-blur-md border border-white/10 dark:border-black/10">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
        <span className="truncate">{message}</span>
      </div>
    </div>
  );
}
