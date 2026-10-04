import React, { useState } from "react";
import { Sparkles, Wand2, RefreshCw, ChevronRight, Layers, Sliders, Globe, Tag } from "lucide-react";
import { TopicPreset } from "../types/carousel";

interface TopicSelectorProps {
  currentTopic: string;
  onTopicChange: (topic: string) => void;
  slideCount: number;
  onSlideCountChange: (count: number) => void;
  tone: string;
  onToneChange: (tone: string) => void;
  platform: string;
  onPlatformChange: (platform: string) => void;
  websiteUrl: string;
  onWebsiteUrlChange: (url: string) => void;
  brandHandle: string;
  onBrandHandleChange: (handle: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  topicPresets: TopicPreset[];
  onSelectPreset: (preset: TopicPreset) => void;
  onRefreshPresets: () => void;
  isRefreshingPresets: boolean;
}

const TONE_OPTIONS = [
  { value: "aesthetic-luxury", label: "Aesthetic Luxury" },
  { value: "warm-heartfelt", label: "Warm & Heartfelt" },
  { value: "direct-actionable", label: "Direct & Actionable" },
  { value: "curated-expert", label: "Curated Expert" },
  { value: "playful-witty", label: "Playful & Witty" },
];

const PLATFORM_OPTIONS = [
  { value: "instagram", label: "Instagram & Threads" },
  { value: "linkedin", label: "LinkedIn Document" },
  { value: "pinterest", label: "Pinterest Pin Deck" },
];

const CATEGORIES = [
  "All Ideas",
  "Luxury Hampers",
  "Thoughtful & Unique",
  "Quick Solutions",
  "Corporate & Work",
  "Romantic & Couple",
  "Budget Chic",
];

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  currentTopic,
  onTopicChange,
  slideCount,
  onSlideCountChange,
  tone,
  onToneChange,
  platform,
  onPlatformChange,
  websiteUrl,
  onWebsiteUrlChange,
  brandHandle,
  onBrandHandleChange,
  onGenerate,
  isGenerating,
  topicPresets,
  onSelectPreset,
  onRefreshPresets,
  isRefreshingPresets,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All Ideas");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filteredPresets = topicPresets.filter((p) => {
    if (selectedCategory === "All Ideas") return true;
    return p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
           selectedCategory.toLowerCase().includes(p.category.toLowerCase());
  });

  return (
    <section id="topic-section" className="w-full bg-stone-900/60 border-b border-stone-800 py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Prompt Formulation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gifts Content Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif-display tracking-tight">
              Create High-Converting Social Media Carousels
            </h1>
            <p className="text-stone-400 text-sm mt-1 max-w-2xl">
              Type any topic or choose a curated gifting theme to instantly generate a slide-by-slide swipeable deck, visual designs, and ready-to-post captions for{" "}
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline"
              >
                snazzy-gnome-1d4893.netlify.app/gifts
              </a>
              .
            </p>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="self-start md:self-auto text-xs font-medium text-stone-400 hover:text-stone-200 flex items-center gap-1.5 py-1 px-2.5 rounded border border-stone-800 hover:border-stone-700 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showAdvanced ? "Hide Settings" : "Brand & Deck Settings"}</span>
          </button>
        </div>

        {/* Primary Generator Box */}
        <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-4 sm:p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Topic Input Field */}
            <div className="flex-1 relative">
              <label htmlFor="carousel-topic-input" className="block text-xs font-medium text-stone-400 mb-1.5">
                Topic or Carousel Hook
              </label>
              <input
                id="carousel-topic-input"
                type="text"
                value={currentTopic}
                onChange={(e) => onTopicChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isGenerating && currentTopic.trim()) {
                    onGenerate();
                  }
                }}
                placeholder="e.g. 5 Luxury Hampers That Leave People Speechless, or Gifts For The Person Who Has Everything..."
                className="w-full bg-stone-900 border border-stone-700/80 rounded-lg px-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
            </div>

            {/* Slide Count Control */}
            <div className="w-full sm:w-auto shrink-0">
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                Slides ({slideCount})
              </label>
              <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-lg">
                {[4, 5, 6, 7, 8].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => onSlideCountChange(count)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      slideCount === count
                        ? "bg-amber-400 text-stone-950 shadow-sm"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="w-full lg:w-auto shrink-0 pt-2 lg:pt-5">
              <button
                type="button"
                onClick={onGenerate}
                disabled={isGenerating || !currentTopic.trim()}
                className="w-full lg:w-auto flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                    <span>Writing Deck & Slides...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-stone-950" />
                    <span>Generate Carousel</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Advanced Brand & Settings Drawer */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">
                  Tone of Voice
                </label>
                <select
                  value={tone}
                  onChange={(e) => onToneChange(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                >
                  {TONE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">
                  Target Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => onPlatformChange(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                >
                  {PLATFORM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">
                  Destination URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => onWebsiteUrlChange(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">
                  Brand Social Handle
                </label>
                <input
                  type="text"
                  value={brandHandle}
                  onChange={(e) => onBrandHandleChange(e.target.value)}
                  placeholder="@snazzygnomegifts"
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Gifting Topic Inspiration Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-300">
                Trending Gift Topics for snazzy-gnome
              </span>
              <span className="text-stone-600 text-xs">·</span>
              <span className="text-stone-400 text-xs">
                Click any topic to autofill & generate
              </span>
            </div>

            <button
              onClick={onRefreshPresets}
              disabled={isRefreshingPresets}
              className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshingPresets ? "animate-spin" : ""}`} />
              <span>More AI Topics</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-stone-100 text-stone-950 font-semibold"
                    : "bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-stone-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPresets.slice(0, 6).map((preset) => (
              <button
                key={preset.id || preset.title}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className="group text-left p-3.5 rounded-lg bg-stone-950/60 border border-stone-800/90 hover:border-amber-400/50 hover:bg-stone-900/80 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-400/90 font-medium mb-1">
                    <span>{preset.category}</span>
                    <span className="text-stone-500 font-mono-numbers text-[11px]">
                      {preset.slidesCount} slides
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-stone-100 group-hover:text-amber-300 line-clamp-2 transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">
                    {preset.hook}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-800/50 text-[11px] text-stone-500 group-hover:text-amber-400">
                  <span>Strategy: {preset.angle}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
