import React from "react";
import { Plus, Trash2, Edit3, Type, List, Sparkles } from "lucide-react";
import { SlideItem, SlideType } from "../types/carousel";

interface SlideEditorProps {
  slide: SlideItem;
  slideIndex: number;
  totalSlides: number;
  onUpdate: (updated: SlideItem) => void;
}

const SLIDE_TYPES: { value: SlideType; label: string }[] = [
  { value: "cover", label: "Cover / Hook" },
  { value: "content", label: "Value / Gift Idea" },
  { value: "comparison", label: "Comparison / Before & After" },
  { value: "quote", label: "Story / Quote" },
  { value: "cta", label: "Conversion / CTA" },
];

export const SlideEditor: React.FC<SlideEditorProps> = ({
  slide,
  slideIndex,
  totalSlides,
  onUpdate,
}) => {
  const handleChange = (field: keyof SlideItem, value: any) => {
    onUpdate({
      ...slide,
      [field]: value,
    });
  };

  const handleAddBullet = () => {
    const current = slide.bulletPoints || [];
    handleChange("bulletPoints", [...current, "New recommendation or tip"]);
  };

  const handleUpdateBullet = (idx: number, text: string) => {
    const current = [...(slide.bulletPoints || [])];
    current[idx] = text;
    handleChange("bulletPoints", current);
  };

  const handleRemoveBullet = (idx: number) => {
    const current = (slide.bulletPoints || []).filter((_, i) => i !== idx);
    handleChange("bulletPoints", current);
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-stone-100">
            Edit Slide #{slideIndex + 1}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-stone-400">Slide Type:</label>
          <select
            value={slide.type}
            onChange={(e) => handleChange("type", e.target.value as SlideType)}
            className="bg-stone-950 border border-stone-800 text-xs text-stone-200 rounded-md px-2.5 py-1 focus:outline-none focus:border-amber-400"
          >
            {SLIDE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Eyebrow */}
        <div>
          <label className="block text-xs font-medium text-stone-400 mb-1">
            Eyebrow Tag
          </label>
          <input
            type="text"
            value={slide.eyebrow || ""}
            onChange={(e) => handleChange("eyebrow", e.target.value)}
            placeholder="e.g. 01 · LUXURY HAMPER"
            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Highlight Badge */}
        <div>
          <label className="block text-xs font-medium text-stone-400 mb-1">
            Highlight Badge
          </label>
          <input
            type="text"
            value={slide.highlightBadge || ""}
            onChange={(e) => handleChange("highlightBadge", e.target.value)}
            placeholder="e.g. Best-Seller Pick, Under $50"
            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Headline */}
      <div>
        <label className="block text-xs font-medium text-stone-400 mb-1">
          Headline
        </label>
        <textarea
          rows={2}
          value={slide.headline || ""}
          onChange={(e) => handleChange("headline", e.target.value)}
          placeholder="Main slide headline"
          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400 resize-none font-medium"
        />
      </div>

      {/* Subheadline */}
      <div>
        <label className="block text-xs font-medium text-stone-400 mb-1">
          Subheadline / Hook Context
        </label>
        <input
          type="text"
          value={slide.subheadline || ""}
          onChange={(e) => handleChange("subheadline", e.target.value)}
          placeholder="Secondary context or emotional appeal"
          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Body Text */}
      <div>
        <label className="block text-xs font-medium text-stone-400 mb-1">
          Body Copy (Keep concise for high mobile read-through)
        </label>
        <textarea
          rows={3}
          value={slide.body || ""}
          onChange={(e) => handleChange("body", e.target.value)}
          placeholder="Concise explanation, gift narrative, or tips..."
          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
        />
      </div>

      {/* Bullet Points */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-stone-400 flex items-center gap-1.5">
            <List className="w-3.5 h-3.5" />
            <span>Key Details & Product Recommendations ({slide.bulletPoints?.length || 0})</span>
          </label>
          <button
            type="button"
            onClick={handleAddBullet}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Point</span>
          </button>
        </div>

        {(slide.bulletPoints || []).map((bullet, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={bullet}
              onChange={(e) => handleUpdateBullet(idx, e.target.value)}
              className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={() => handleRemoveBullet(idx)}
              className="p-1.5 text-stone-500 hover:text-rose-400 cursor-pointer"
              title="Remove point"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Swipe Prompt */}
      <div>
        <label className="block text-xs font-medium text-stone-400 mb-1">
          Swipe Prompt Label
        </label>
        <input
          type="text"
          value={slide.swipePrompt || ""}
          onChange={(e) => handleChange("swipePrompt", e.target.value)}
          placeholder="e.g. Swipe to discover ➔"
          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
        />
      </div>
    </div>
  );
};
