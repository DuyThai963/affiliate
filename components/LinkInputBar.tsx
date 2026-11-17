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
 * [Design Read] Family: TikTok-Inspired Tactile Search Bar | Variance: 6/10 | Motion: 4/10 | Density: 8/10 | Accent: TikTok Red (#fe2c55) & Sleek Pill Geometry
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
    <div className="sticky top-[57px] z-20 bg-white/90 dark:bg-[#121214]/95 backdrop-blur-xl px-4 pt-3 pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="flex flex-col space-y-2.5">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none flex items-center">
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
            className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-800/90 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 rounded-full focus:outline-none focus:bg-white dark:focus:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-all disabled:opacity-60"
          />

          <div className="absolute right-2 flex items-center space-x-1">
            {url ? (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                aria-label="Xóa nội dung nhập"
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={handlePaste}
              disabled={isLoading}
              title="Dán link từ bộ nhớ tạm và tìm ngay"
              className="flex items-center space-x-1 px-3 py-1 text-[11px] font-black text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-600 border border-zinc-200 dark:border-zinc-600 rounded-full shadow-2xs active:scale-95 transition"
            >
              <ClipboardPaste className="w-3 h-3 text-tiktok-red" />
              <span>Dán</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSearch()}
          disabled={isLoading || !url.trim()}
          className="w-full py-2.5 px-4 bg-tiktok-red hover:bg-tiktok-redHover text-white rounded-full font-black text-xs sm:text-sm shadow-md shadow-tiktok-red/25 active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang giải mã link &amp; tìm voucher...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Tìm Mã Giảm Giá &amp; Tạo Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
