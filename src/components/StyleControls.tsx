import React from "react";
import { Palette, Check, Sparkles, Type } from "lucide-react";
import { CarouselTheme, ThemeId } from "../types/carousel";
import { THEMES } from "../constants/presets";

interface StyleControlsProps {
  currentTheme: CarouselTheme;
  onSelectTheme: (theme: CarouselTheme) => void;
}

export const StyleControls: React.FC<StyleControlsProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <section id="theme-section" className="bg-stone-900/60 border-t border-b border-stone-800 py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Aesthetic Themes & Color Direction</span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Select a visual identity tailored for luxury gifting, editorial feeds, or festive promotions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.values(THEMES).map((theme) => {
            const isSelected = currentTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onSelectTheme(theme)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? "border-amber-400 bg-stone-900 shadow-lg ring-1 ring-amber-400"
                    : "border-stone-800 bg-stone-950/80 hover:border-stone-700 hover:bg-stone-900/60"
                }`}
              >
                {/* Visual Swatch Preview Box */}
                <div
                  className={`w-full h-12 rounded-lg mb-2.5 relative flex items-center justify-center overflow-hidden ${theme.backgroundClass}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: theme.canvasAccent }}
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: theme.canvasTextPrimary }}
                    />
                  </div>

                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-amber-400 text-stone-950 rounded-full p-0.5 shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-100">
                      {theme.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 line-clamp-2 leading-tight">
                    {theme.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
