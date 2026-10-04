import React from "react";
import { ExternalLink, Sparkles, Download } from "lucide-react";

interface NavbarProps {
  onScrollTo: (sectionId: string) => void;
  onExportAll: () => void;
  isExporting: boolean;
  websiteUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScrollTo,
  onExportAll,
  isExporting,
  websiteUrl,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-stone-100 font-luxury-display flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            CarouselForge
          </span>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-300">
          <button
            onClick={() => onScrollTo("topic-section")}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Topic Ideas
          </button>
          <button
            onClick={() => onScrollTo("canvas-section")}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Slide Studio
          </button>
          <button
            onClick={() => onScrollTo("theme-section")}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Aesthetics & Themes
          </button>
          <button
            onClick={() => onScrollTo("caption-section")}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Caption & Hashtags
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-900 border border-stone-800 rounded-lg hover:border-stone-700 transition-colors whitespace-nowrap"
          >
            <span>snazzy-gnome/gifts</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onExportAll}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-950"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? "Rendering..." : "Export Slides"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
