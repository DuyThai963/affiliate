"use client";

import React, { useRef } from "react";
import { Search, ClipboardPaste, X, Loader2, Sparkles } from "lucide-react";

interface LinkInputBarProps {
  url: string;
  setUrl: (url: string) => void;
  onSearch: (customUrl?: string) => void;
  isLoading: boolean;
}

/**
 * [Design Read] Family: Minimalist Tactile Commerce Input | Variance: 5/10 | Motion: 5/10 | Density: 8/10 | Accent: Warm Terracotta Pastel (#d96947)
 */
export default function LinkInputBar({
  url,
  setUrl,
  onSearch,
  isLoading,
}: LinkInputBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setUrl("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        onSearch(text);
      }
    } catch (err) {
      console.warn("Không thể truy cập Clipboard:", err);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-[#faf9f6]/95 dark:bg-[#121215]/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60 transition-colors">
      <div className="flex flex-col space-y-2">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-zinc-400 dark:text-zinc-500 pointer-events-none flex items-center">
            <Search className="w-4 h-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Dán link Shopee hoặc TikTok Shop..."
            className="w-full pl-9 pr-24 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#1a1a1f] border border-zinc-200/80 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-shopee-500/20 focus:border-shopee-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition disabled:opacity-60 shadow-sm"
          />

          <div className="absolute right-2 flex items-center space-x-1">
            {url ? (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                aria-label="Xóa nội dung nhập"
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={handlePaste}
              disabled={isLoading}
              title="Dán link từ bộ nhớ tạm và tìm ngay"
              className="flex items-center space-x-1 px-2.5 py-1 text-[11px] font-semibold text-shopee-600 dark:text-shopee-400 bg-shopee-50 dark:bg-shopee-900/30 hover:bg-shopee-100 dark:hover:bg-shopee-900/50 border border-shopee-200/70 dark:border-shopee-800/40 rounded-lg active:scale-95 transition"
            >
              <ClipboardPaste className="w-3 h-3" />
              <span>Dán</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSearch()}
          disabled={isLoading || !url.trim()}
          className="w-full py-2.5 px-4 bg-shopee-500 hover:bg-shopee-600 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm shadow-shopee-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang giải mã link &amp; tìm voucher...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Tìm Mã Giảm Giá &amp; Tạo Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
