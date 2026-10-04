import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  Check,
  Sparkles,
  Plus,
  Trash2,
  ArrowLeftRight,
  Maximize2,
  Smartphone,
  Square,
  FileText,
  Gift,
  ArrowRight,
  Wand2,
} from "lucide-react";
import { AspectRatio, CarouselTheme, SlideItem } from "../types/carousel";
import { copySlideToClipboard, downloadSlideAsPng } from "../utils/canvasExport";

interface CarouselViewerProps {
  slides: SlideItem[];
  activeSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onUpdateSlide: (index: number, updated: SlideItem) => void;
  onAddSlide: () => void;
  onDeleteSlide: (index: number) => void;
  onMoveSlide: (index: number, direction: "left" | "right") => void;
  theme: CarouselTheme;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  brandHandle: string;
  websiteUrl: string;
  onEnhanceSlide: (index: number, instruction: string) => void;
  isEnhancing: boolean;
}

export const CarouselViewer: React.FC<CarouselViewerProps> = ({
  slides,
  activeSlideIndex,
  onSelectSlide,
  onUpdateSlide,
  onAddSlide,
  onDeleteSlide,
  onMoveSlide,
  theme,
  aspectRatio,
  onAspectRatioChange,
  brandHandle,
  websiteUrl,
  onEnhanceSlide,
  isEnhancing,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showEnhancePrompt, setShowEnhancePrompt] = useState(false);
  const [enhanceInstruction, setEnhanceInstruction] = useState("Make the hook sharper and add specific gift ideas");

  const currentSlide = slides[activeSlideIndex] || slides[0];
  const totalSlides = slides.length;

  const handleNext = () => {
    if (activeSlideIndex < totalSlides - 1) {
      onSelectSlide(activeSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeSlideIndex > 0) {
      onSelectSlide(activeSlideIndex - 1);
    }
  };

  const handleCopyImage = async () => {
    if (!currentSlide) return;
    const success = await copySlideToClipboard(
      currentSlide,
      totalSlides,
      theme,
      aspectRatio,
      brandHandle,
      websiteUrl
    );
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCurrent = async () => {
    if (!currentSlide) return;
    setIsDownloading(true);
    try {
      await downloadSlideAsPng(
        currentSlide,
        totalSlides,
        theme,
        aspectRatio,
        brandHandle,
        websiteUrl,
        `slide-${currentSlide.slideNumber}.png`
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Determine aspect ratio class for the preview container
  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case "4:5":
        return "aspect-[4/5] max-w-[420px]";
      case "9:16":
        return "aspect-[9/16] max-w-[340px]";
      case "1:1":
      default:
        return "aspect-square max-w-[480px]";
    }
  };

  const getHeadingFontClass = () => {
    if (theme.fontHeading === "serif") return "font-serif-display";
    if (theme.fontHeading === "luxury") return "font-luxury-display";
    return "font-modern-display";
  };

  return (
    <section id="canvas-section" className="w-full py-8 px-6 bg-stone-950">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Canvas Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-stone-200">
              Interactive Slide Simulator
            </span>
            <span className="text-xs text-stone-500 font-mono-numbers bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
              Slide {String(activeSlideIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Aspect Ratio Switcher */}
            <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => onAspectRatioChange("1:1")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  aspectRatio === "1:1"
                    ? "bg-amber-400 text-stone-950 font-semibold"
                    : "text-stone-400 hover:text-stone-200"
                }`}
                title="Square 1:1 (Instagram Feed / LinkedIn post)"
              >
                <Square className="w-3 h-3" />
                <span>1:1 Square</span>
              </button>

              <button
                type="button"
                onClick={() => onAspectRatioChange("4:5")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  aspectRatio === "4:5"
                    ? "bg-amber-400 text-stone-950 font-semibold"
                    : "text-stone-400 hover:text-stone-200"
                }`}
                title="Portrait 4:5 (Instagram Carousel Portrait / LinkedIn Carousel Document)"
              >
                <FileText className="w-3 h-3" />
                <span>4:5 Portrait</span>
              </button>

              <button
                type="button"
                onClick={() => onAspectRatioChange("9:16")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  aspectRatio === "9:16"
                    ? "bg-amber-400 text-stone-950 font-semibold"
                    : "text-stone-400 hover:text-stone-200"
                }`}
                title="Stories & Vertical 9:16"
              >
                <Smartphone className="w-3 h-3" />
                <span>9:16 Story</span>
              </button>
            </div>

            {/* Slide Action Buttons */}
            <button
              onClick={() => setShowEnhancePrompt(!showEnhancePrompt)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/40 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Polish Slide</span>
            </button>

            <button
              onClick={handleCopyImage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-300 bg-stone-900 border border-stone-800 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title="Copy slide image directly to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Image!" : "Copy Image"}</span>
            </button>

            <button
              onClick={handleDownloadCurrent}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-100 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? "Rendering..." : "Download PNG"}</span>
            </button>
          </div>
        </div>

        {/* AI Polish Slide Drawer */}
        {showEnhancePrompt && (
          <div className="bg-stone-900 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-in fade-in">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-amber-400 mb-1">
                Refine Active Slide #{activeSlideIndex + 1} with AI
              </label>
              <input
                type="text"
                value={enhanceInstruction}
                onChange={(e) => setEnhanceInstruction(e.target.value)}
                placeholder="e.g. Make the headline punchier, emphasize luxury gifts, add 3 specific ideas..."
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto pt-2 sm:pt-4">
              <button
                type="button"
                onClick={() => onEnhanceSlide(activeSlideIndex, enhanceInstruction)}
                disabled={isEnhancing || !enhanceInstruction.trim()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? "animate-spin" : ""}`} />
                <span>{isEnhancing ? "Polishing..." : "Apply AI Refinement"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowEnhancePrompt(false)}
                className="px-3 py-2 text-xs font-medium text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Main Preview Stage */}
        <div className="relative flex flex-col items-center justify-center py-4">
          {/* Previous Slide Button */}
          <button
            onClick={handlePrev}
            disabled={activeSlideIndex === 0}
            className="absolute left-0 sm:left-4 z-20 p-2.5 rounded-full bg-stone-900/90 border border-stone-800 text-stone-200 hover:text-white hover:bg-stone-800 disabled:opacity-20 disabled:pointer-events-none transition-all shadow-lg cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Slide Button */}
          <button
            onClick={handleNext}
            disabled={activeSlideIndex === totalSlides - 1}
            className="absolute right-0 sm:right-4 z-20 p-2.5 rounded-full bg-stone-900/90 border border-stone-800 text-stone-200 hover:text-white hover:bg-stone-800 disabled:opacity-20 disabled:pointer-events-none transition-all shadow-lg cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* The Slide Frame Mockup */}
          <div
            className={`w-full ${getAspectRatioStyle()} mx-auto ${theme.backgroundClass} rounded-2xl border border-stone-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden select-none transition-all duration-300`}
            style={{
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Subtle decorative luxury ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Inner Border Frame for Luxury Editorial Feeling */}
            <div className={`absolute inset-3 rounded-xl border ${theme.accentBorder} opacity-30 pointer-events-none`} />

            {/* Header: Brand Handle + Slide Progress Counter */}
            <div className="relative z-10 flex items-center justify-between border-b border-stone-700/30 pb-3">
              <span className={`text-xs font-semibold tracking-wider uppercase ${theme.accentClass}`}>
                {brandHandle}
              </span>
              <span className="text-xs font-mono-numbers text-stone-400">
                {String(currentSlide.slideNumber).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
              </span>
            </div>

            {/* Body Content Zone */}
            <div className="relative z-10 my-auto py-4 space-y-3.5">
              {/* Eyebrow tag */}
              {currentSlide.eyebrow && (
                <div className={`text-[11px] font-bold tracking-widest uppercase ${theme.accentClass}`}>
                  {currentSlide.eyebrow}
                </div>
              )}

              {/* Headline */}
              <h2
                className={`text-xl sm:text-2xl md:text-3xl font-bold leading-tight ${theme.textPrimaryClass} ${getHeadingFontClass()}`}
                style={{ textWrap: "balance" }}
              >
                {currentSlide.headline}
              </h2>

              {/* Subheadline (if any) */}
              {currentSlide.subheadline && (
                <p className={`text-xs sm:text-sm font-medium ${theme.accentClass} leading-snug`}>
                  {currentSlide.subheadline}
                </p>
              )}

              {/* Highlight Badge */}
              {currentSlide.highlightBadge && (
                <div className="pt-1">
                  <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md ${theme.badgeClass}`}>
                    {currentSlide.highlightBadge}
                  </span>
                </div>
              )}

              {/* Body Text */}
              {currentSlide.body && (
                <p className={`text-xs sm:text-sm leading-relaxed ${theme.textSecondaryClass}`}>
                  {currentSlide.body}
                </p>
              )}

              {/* Bullet Points Container (if any) */}
              {currentSlide.bulletPoints && currentSlide.bulletPoints.length > 0 && (
                <div className={`mt-3 p-3.5 rounded-xl ${theme.cardBgClass} space-y-2`}>
                  {currentSlide.bulletPoints.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-200">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${theme.accentClass} bg-current`} />
                      <span className="leading-snug">{bullet}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer: Destination URL + Swipe / Action Indicator */}
            <div className="relative z-10 flex items-center justify-between border-t border-stone-700/30 pt-3 text-[11px]">
              <span className="text-stone-400 font-medium truncate max-w-[190px]">
                {websiteUrl.replace(/^https?:\/\//, "")}
              </span>

              <span className={`font-semibold flex items-center gap-1 ${theme.accentClass}`}>
                <span>{currentSlide.swipePrompt || (currentSlide.type === "cta" ? "Visit shop ➔" : "Swipe ➔")}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Slide Strip & Sequence Manager */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-semibold text-stone-300">
              Slide Strip ({slides.length} slides)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onMoveSlide(activeSlideIndex, "left")}
                disabled={activeSlideIndex === 0}
                className="hover:text-stone-100 disabled:opacity-30 p-1 cursor-pointer"
                title="Move current slide left"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onAddSlide}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slide</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {slides.map((s, idx) => {
              const isActive = idx === activeSlideIndex;
              return (
                <div
                  key={idx}
                  onClick={() => onSelectSlide(idx)}
                  className={`group relative shrink-0 w-28 sm:w-32 aspect-square rounded-lg p-2.5 cursor-pointer transition-all flex flex-col justify-between text-left ${
                    isActive
                      ? "ring-2 ring-amber-400 bg-stone-900 border border-transparent shadow-md"
                      : "bg-stone-950 border border-stone-800 hover:border-stone-700 hover:bg-stone-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={`font-mono-numbers font-bold ${isActive ? "text-amber-400" : "text-stone-500"}`}>
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-stone-500 capitalize text-[9px]">{s.type}</span>
                  </div>

                  <p className="text-[10px] font-semibold text-stone-200 line-clamp-2 my-auto leading-tight">
                    {s.headline || "Untitled Slide"}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-800/60">
                    <span className="text-[9px] text-stone-500 truncate max-w-[60px]">
                      {s.eyebrow || "Slide"}
                    </span>

                    {slides.length > 2 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSlide(idx);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-stone-500 hover:text-rose-400 transition-opacity p-0.5"
                        title="Delete slide"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
