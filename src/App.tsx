/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { TopicSelector } from "./components/TopicSelector";
import { CarouselViewer } from "./components/CarouselViewer";
import { SlideEditor } from "./components/SlideEditor";
import { StyleControls } from "./components/StyleControls";
import { CaptionPanel } from "./components/CaptionPanel";
import { INITIAL_CAROUSEL, INITIAL_TOPIC_PRESETS, THEMES } from "./constants/presets";
import { AspectRatio, CarouselData, CarouselTheme, SlideItem, TopicPreset } from "./types/carousel";
import { downloadAllSlidesAsPng } from "./utils/canvasExport";
import { Gift, Sparkles, CheckCircle2, AlertCircle, ExternalLink, Heart } from "lucide-react";

export default function App() {
  const [carouselData, setCarouselData] = useState<CarouselData>(INITIAL_CAROUSEL);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [currentTopic, setCurrentTopic] = useState<string>(
    "5 Luxury Gift Hampers That Make Anyone Feel Deeply Cherished"
  );
  const [slideCount, setSlideCount] = useState<number>(5);
  const [tone, setTone] = useState<string>("aesthetic-luxury");
  const [platform, setPlatform] = useState<string>("instagram");
  const [websiteUrl, setWebsiteUrl] = useState<string>("https://snazzy-gnome-1d4893.netlify.app/gifts");
  const [brandHandle, setBrandHandle] = useState<string>("@snazzygnomegifts");
  const [theme, setTheme] = useState<CarouselTheme>(THEMES["luxury-gold"]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [topicPresets, setTopicPresets] = useState<TopicPreset[]>(INITIAL_TOPIC_PRESETS);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isRefreshingPresets, setIsRefreshingPresets] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  // Keyboard navigation for carousel slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      if (e.key === "ArrowLeft") {
        setActiveSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveSlideIndex((prev) => Math.min(carouselData.slides.length - 1, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [carouselData.slides.length]);

  // Generate carousel from Gemini API
  const handleGenerate = async () => {
    if (!currentTopic.trim()) {
      showNotification("Please enter a topic or hook first.", "error");
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: currentTopic.trim(),
          slideCount,
          targetPlatform: platform,
          tone,
          websiteUrl,
          brandName: "Snazzy Gnome Gifts",
          brandHandle,
          themeStyle: theme.id,
          audience: "Thoughtful gift seekers, friends, couples & corporate clients",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      setCarouselData({
        ...data,
        websiteUrl,
        brandName: "Snazzy Gnome Gifts",
        brandHandle,
      });

      // Suggest theme if returned and available
      if (data.themeSuggestion && THEMES[data.themeSuggestion]) {
        setTheme(THEMES[data.themeSuggestion]);
      }

      setActiveSlideIndex(0);
      showNotification(`Generated ${data.slides?.length || slideCount} slides for "${currentTopic.slice(0, 32)}..."`);

      // Smooth scroll to canvas section
      const canvasEl = document.getElementById("canvas-section");
      if (canvasEl) {
        canvasEl.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      showNotification(err.message || "Could not generate carousel. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Refresh topic ideas with AI
  const handleRefreshPresets = async () => {
    setIsRefreshingPresets(true);
    try {
      const response = await fetch("/api/suggest-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "Celebrations, Luxury Hampers & Thoughtful Presents" }),
      });
      if (response.ok) {
        const freshTopics = await response.json();
        if (Array.isArray(freshTopics) && freshTopics.length > 0) {
          setTopicPresets(freshTopics);
          showNotification("Fresh trending gift topics loaded!");
        }
      }
    } catch (err) {
      console.warn("Could not refresh topics:", err);
    } finally {
      setIsRefreshingPresets(false);
    }
  };

  // Enhance / Polish a specific slide
  const handleEnhanceSlide = async (index: number, instruction: string) => {
    const targetSlide = carouselData.slides[index];
    if (!targetSlide) return;
    setIsEnhancing(true);
    try {
      const response = await fetch("/api/enhance-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slide: targetSlide, instruction }),
      });
      if (!response.ok) throw new Error("Enhancement failed");
      const enhanced = await response.json();
      const updatedSlides = [...carouselData.slides];
      updatedSlides[index] = enhanced;
      setCarouselData({ ...carouselData, slides: updatedSlides });
      showNotification(`Refined slide #${index + 1}!`);
    } catch (err: any) {
      showNotification(err.message || "Failed to refine slide", "error");
    } finally {
      setIsEnhancing(false);
    }
  };

  // Slide management
  const handleUpdateSlide = (index: number, updated: SlideItem) => {
    const newSlides = [...carouselData.slides];
    newSlides[index] = updated;
    setCarouselData({ ...carouselData, slides: newSlides });
  };

  const handleAddSlide = () => {
    const newSlideNum = carouselData.slides.length + 1;
    const newSlide: SlideItem = {
      slideNumber: newSlideNum,
      type: "content",
      eyebrow: `0${newSlideNum} · NEW IDEA`,
      headline: "Artisan Gift Concept & Packaging Detail",
      subheadline: "Why this sensory touch makes a lasting impression",
      body: "Describe the personalized gift concept or unboxing surprise in 1 to 2 crisp sentences.",
      bulletPoints: ["Highlight small-batch curation", "Include bespoke monogramming or ribbon"],
      highlightBadge: "Curated Pick",
      swipePrompt: "Keep swiping ➔",
    };
    const updated = [...carouselData.slides, newSlide];
    setCarouselData({ ...carouselData, slides: updated });
    setActiveSlideIndex(updated.length - 1);
    showNotification(`Added slide #${newSlideNum}`);
  };

  const handleDeleteSlide = (index: number) => {
    if (carouselData.slides.length <= 2) {
      showNotification("Carousels require at least 2 slides.", "info");
      return;
    }
    const updated = carouselData.slides
      .filter((_, i) => i !== index)
      .map((s, idx) => ({ ...s, slideNumber: idx + 1 }));
    setCarouselData({ ...carouselData, slides: updated });
    setActiveSlideIndex((prev) => Math.min(prev, updated.length - 1));
    showNotification(`Removed slide #${index + 1}`);
  };

  const handleMoveSlide = (index: number, direction: "left" | "right") => {
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= carouselData.slides.length) return;
    const slides = [...carouselData.slides];
    const temp = slides[index];
    slides[index] = slides[newIndex];
    slides[newIndex] = temp;
    const renumbered = slides.map((s, idx) => ({ ...s, slideNumber: idx + 1 }));
    setCarouselData({ ...carouselData, slides: renumbered });
    setActiveSlideIndex(newIndex);
  };

  // Batch Export All Slides as PNG
  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      showNotification("Rendering high-res slide images...", "info");
      await downloadAllSlidesAsPng(
        carouselData.slides,
        theme,
        aspectRatio,
        brandHandle,
        websiteUrl,
        carouselData.title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30) || "carousel"
      );
      showNotification("Downloaded all slides as PNG images!");
    } catch (err: any) {
      console.error("Export error:", err);
      showNotification("Error downloading slides. Try downloading individually.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSelectPreset = (preset: TopicPreset) => {
    setCurrentTopic(preset.title);
    setSlideCount(preset.slidesCount);
    showNotification(`Selected: "${preset.title}". Click Generate to write deck!`, "info");
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold backdrop-blur-md border animate-in slide-in-from-bottom-5 bg-stone-900 border-amber-500/40 text-stone-100">
          {notification.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Bar Navigation adhering to 3-zone contract */}
      <Navbar
        onScrollTo={scrollTo}
        onExportAll={handleExportAll}
        isExporting={isExporting}
        websiteUrl={websiteUrl}
      />

      {/* Topic Engine & Presets Bar */}
      <TopicSelector
        currentTopic={currentTopic}
        onTopicChange={setCurrentTopic}
        slideCount={slideCount}
        onSlideCountChange={setSlideCount}
        tone={tone}
        onToneChange={setTone}
        platform={platform}
        onPlatformChange={setPlatform}
        websiteUrl={websiteUrl}
        onWebsiteUrlChange={setWebsiteUrl}
        brandHandle={brandHandle}
        onBrandHandleChange={setBrandHandle}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        topicPresets={topicPresets}
        onSelectPreset={handleSelectPreset}
        onRefreshPresets={handleRefreshPresets}
        isRefreshingPresets={isRefreshingPresets}
      />

      {/* Slide Simulator & Carousel Canvas */}
      <CarouselViewer
        slides={carouselData.slides}
        activeSlideIndex={activeSlideIndex}
        onSelectSlide={setActiveSlideIndex}
        onUpdateSlide={handleUpdateSlide}
        onAddSlide={handleAddSlide}
        onDeleteSlide={handleDeleteSlide}
        onMoveSlide={handleMoveSlide}
        theme={theme}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        brandHandle={brandHandle}
        websiteUrl={websiteUrl}
        onEnhanceSlide={handleEnhanceSlide}
        isEnhancing={isEnhancing}
      />

      {/* In-Place Slide Editor (Edit whichever slide is currently active) */}
      <section className="w-full py-6 px-6 bg-stone-950 border-t border-stone-800">
        <div className="max-w-7xl mx-auto">
          <SlideEditor
            slide={carouselData.slides[activeSlideIndex] || carouselData.slides[0]}
            slideIndex={activeSlideIndex}
            totalSlides={carouselData.slides.length}
            onUpdate={(updated) => handleUpdateSlide(activeSlideIndex, updated)}
          />
        </div>
      </section>

      {/* Aesthetic Theme Controller */}
      <StyleControls currentTheme={theme} onSelectTheme={setTheme} />

      {/* Caption & Post Publishing Center */}
      <CaptionPanel
        carouselData={carouselData}
        onUpdateCaption={(cap) => setCarouselData({ ...carouselData, caption: cap })}
        onExportAll={handleExportAll}
        isExporting={isExporting}
        websiteUrl={websiteUrl}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-800/80 bg-stone-950 py-8 px-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-300">CarouselForge AI</span>
            <span>·</span>
            <span>Dedicated Social Studio for</span>
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:underline"
            >
              snazzy-gnome-1d4893.netlify.app/gifts
            </a>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>Instagram & LinkedIn Ready</span>
            <span>·</span>
            <span>1080px High-Res Export</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
