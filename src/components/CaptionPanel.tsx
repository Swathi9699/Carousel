import React, { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  Hash,
  FileText,
  Sparkles,
} from "lucide-react";
import { CarouselData, CarouselTheme, AspectRatio, SlideItem } from "../types/carousel";

interface CaptionPanelProps {
  carouselData: CarouselData;
  onUpdateCaption: (caption: string) => void;
  onExportAll: () => void;
  isExporting: boolean;
  websiteUrl: string;
}

export const CaptionPanel: React.FC<CaptionPanelProps> = ({
  carouselData,
  onUpdateCaption,
  onExportAll,
  isExporting,
  websiteUrl,
}) => {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(carouselData.caption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyHashtagsOnly = async () => {
    try {
      const tagsText = carouselData.hashtags.join(" ");
      await navigator.clipboard.writeText(tagsText);
      setCopiedHashtags(true);
      setTimeout(() => setCopiedHashtags(false), 2000);
    } catch {
      // Fallback
    }
  };

  const charCount = carouselData.caption.length;
  const wordCount = carouselData.caption.trim().split(/\s+/).filter(Boolean).length;

  return (
    <section id="caption-section" className="w-full py-8 px-6 bg-stone-950 border-t border-stone-800">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Ready-To-Publish Post Copy</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-100 font-serif-display">
              Social Media Caption & Export Deck
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Copy the optimized caption with built-in hooks and call-to-action directing traffic to your gift boutique.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCaption}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              {copiedCaption ? <Check className="w-3.5 h-3.5 text-stone-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCaption ? "Caption Copied!" : "Copy Full Caption"}</span>
            </button>

            <button
              onClick={onExportAll}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-100 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? "Rendering Slides..." : "Download All Slides (PNG)"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Caption Editor */}
          <div className="lg:col-span-2 bg-stone-900/90 border border-stone-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-2.5">
              <span className="font-semibold text-stone-200">
                Instagram / LinkedIn Post Text
              </span>
              <div className="flex items-center gap-3 font-mono-numbers">
                <span>{charCount} characters</span>
                <span>·</span>
                <span>{wordCount} words</span>
              </div>
            </div>

            <textarea
              rows={12}
              value={carouselData.caption}
              onChange={(e) => onUpdateCaption(e.target.value)}
              placeholder="Post caption..."
              className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs leading-relaxed text-stone-200 focus:outline-none focus:border-amber-400 resize-y font-sans"
            />

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span>Pro Tip: Instagram limits captions to 2,200 characters; LinkedIn to 3,000.</span>
              <button
                onClick={handleCopyCaption}
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                Copy to clipboard ↗
              </button>
            </div>
          </div>

          {/* Right Column: Hashtag Cloud & Conversion Funnel */}
          <div className="space-y-4">
            {/* Hashtags Card */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-200">
                  <Hash className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hashtag Strategy ({carouselData.hashtags.length})</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyHashtagsOnly}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedHashtags ? "Copied" : "Copy Tags"}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {carouselData.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-stone-300 bg-stone-950 px-2 py-1 rounded border border-stone-800/80 font-mono"
                  >
                    {tag.startsWith("#") ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>

            {/* Gifts Website Traffic Card */}
            <div className="bg-gradient-to-br from-stone-900 to-amber-950/20 border border-amber-500/20 rounded-xl p-5 space-y-3">
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Conversion Link in Bio</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Direct all carousel viewers to your curated gifts boutique. Every slide in your deck and your caption includes this verified link:
              </p>
              <div className="p-2.5 bg-stone-950 rounded-lg border border-stone-800 text-xs text-amber-200 break-all font-mono">
                {websiteUrl}
              </div>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                <span>Preview Gifts Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
