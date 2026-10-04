export type SlideType = 'cover' | 'content' | 'comparison' | 'quote' | 'cta';

export interface SlideItem {
  slideNumber: number;
  type: SlideType;
  eyebrow: string;
  headline: string;
  subheadline?: string;
  body: string;
  bulletPoints?: string[];
  highlightBadge?: string;
  footerNote?: string;
  swipePrompt?: string;
}

export type ThemeId = 
  | 'luxury-gold' 
  | 'botanical-sage' 
  | 'midnight-velvet' 
  | 'editorial-stone' 
  | 'blush-rose' 
  | 'royal-sapphire';

export interface CarouselTheme {
  id: ThemeId;
  name: string;
  description: string;
  backgroundClass: string;
  canvasBg: string; // for canvas export
  canvasTextPrimary: string;
  canvasTextSecondary: string;
  canvasAccent: string;
  canvasCardBg: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  accentClass: string;
  badgeClass: string;
  cardBgClass: string;
  fontHeading: 'serif' | 'modern' | 'luxury';
  accentBorder: string;
}

export type AspectRatio = '1:1' | '4:5' | '9:16';

export interface CarouselData {
  title: string;
  themeSuggestion?: string;
  keyTakeaway?: string;
  slides: SlideItem[];
  caption: string;
  hashtags: string[];
  callToAction?: string;
  websiteUrl: string;
  brandName: string;
  brandHandle: string;
}

export interface TopicPreset {
  id: string;
  title: string;
  category: string;
  hook: string;
  angle: string;
  slidesCount: number;
}
