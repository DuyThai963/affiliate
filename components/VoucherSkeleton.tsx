"use client";

import React from "react";

/**
 * [Design Read] Family: Shimmer Pulse Skeleton | Variance: 4/10 | Motion: 8/10 | Density: 8/10 | Accent: Neutral Shimmer
 */
export default function VoucherSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
          </div>

          <div className="space-y-1.5">
            <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-3 w-5/6 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>

          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full" />

          <div className="flex items-center space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="h-9 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-9 w-28 bg-zinc-300 dark:bg-zinc-700 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
