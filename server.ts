import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "5mb" }));

// Server-side Gemini initialization as mandated by @google/genai guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Preset gift topics specifically grounded in https://snazzy-gnome-1d4893.netlify.app/gifts
const DEFAULT_TOPICS = [
  {
    id: "luxury-hampers",
    title: "5 Luxury Gift Hampers That Make Anyone Feel Deeply Cherished",
    category: "Luxury & Hampers",
    hook: "Most gift hampers get forgotten. These 5 leave people speechless.",
    slidesCount: 6,
    angle: "Curated Luxury",
  },
  {
    id: "person-who-has-everything",
    title: "The Ultimate Guide: What to Gift the Person Who Has Everything",
    category: "Thoughtful & Unique",
    hook: "Stop buying another generic candle. Try these 4 psychological gifting rules.",
    slidesCount: 5,
    angle: "High Curiosity",
  },
  {
    id: "last-minute-thoughtful",
    title: "4 Last-Minute Gifts That Look Like You Planned Them 3 Months Ago",
    category: "Quick Solutions",
    hook: "Running out of time? Here is how to give an unforgettable present overnight.",
    slidesCount: 5,
    angle: "Urgency & Relief",
  },
  {
    id: "corporate-memorable",
    title: "Corporate Gifting Etiquette: Gifts Clients Actually Keep & Love",
    category: "Corporate & Work",
    hook: "Why 80% of corporate gifts end up in the trash (and 4 modern alternatives).",
    slidesCount: 6,
    angle: "Professional Insight",
  },
  {
    id: "anniversary-formula",
    title: "The 3-Part Surprise Formula for Unforgettable Anniversary Gifting",
    category: "Love & Romance",
    hook: "The secret to gifts that bring happy tears isn't the price tag—it's this formula.",
    slidesCount: 5,
    angle: "Emotional Storytelling",
  },
  {
    id: "budget-chic",
    title: "7 Aesthetic Gifts Under $40 That Look Like a Million Bucks",
    category: "Budget-Friendly",
    hook: "You don't need a luxury budget to give an undeniably chic gift.",
    slidesCount: 6,
    angle: "High Value & Practicality",
  },
];

// Endpoint: Generate complete social media carousel
app.post("/api/generate-carousel", async (req: Request, res: Response) => {
  try {
    const {
      topic,
      slideCount = 5,
      targetPlatform = "instagram",
      tone = "aesthetic-luxury",
      websiteUrl = "https://snazzy-gnome-1d4893.netlify.app/gifts",
      brandName = "Snazzy Gnome Gifts",
      brandHandle = "@snazzygnomegifts",
      themeStyle = "luxury-gold",
      audience = "Thoughtful gift shoppers, friends, partners, & hosts",
      extraNotes = "",
    } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({ error: "A valid topic is required." });
    }

    const count = Math.max(3, Math.min(8, Number(slideCount) || 5));

    const prompt = `
You are an expert social media creative director, viral content strategist, and luxury e-commerce copywriter for the gifts boutique "${brandName}" (Website: ${websiteUrl}).
Your task is to craft a viral, captivating, scroll-stopping social media carousel deck (total ${count} slides) for the topic:
"${topic.trim()}"

Platform: ${targetPlatform} (e.g. Instagram/LinkedIn/Threads swipeable carousel)
Tone: ${tone}
Target Audience: ${audience}
Website Link: ${websiteUrl}
Brand Handle: ${brandHandle}
${extraNotes ? `Additional Instructions: ${extraNotes}` : ""}

GUIDELINES FOR THE SLIDES:
- Slide 1 MUST BE A POWERFUL COVER / HOOK SLIDE:
  * Eyebrow: Short punchy kicker (e.g. "GIFT CURATION GUIDE", "STOP SCROLLING", "DON'T BUY BLIND")
  * Headline: Big, bold, irresistible headline with high emotional tension or curiosity
  * Subheadline: Clear value promise of what they will learn by swiping
  * Body: 1 crisp sentence setting the stage
  * swipePrompt: "Swipe to discover ➔"
  * type: "cover"

- Slides 2 to ${count - 1} ARE THE CORE VALUE / GIFT RECOMMENDATION SLIDES:
  * Eyebrow: e.g. "IDEA 01", "THE AESTHETE", "RULE #1", "STEP 02"
  * Headline: Specific, evocative gift concept, insight, or unboxing moment
  * Subheadline: Why this works so well psychologically
  * body: 1-2 punchy, readable sentences. Avoid fluff.
  * bulletPoints: 2 to 3 ultra-practical curation ideas, gift pairings, or packaging tips
  * highlightBadge: e.g. "Best Seller Pick", "Under $50", "Crowd Pleaser", "Pro Tip"
  * swipePrompt: "Keep swiping ➔"
  * type: "content" or "comparison"

- Final Slide (${count}) MUST BE THE CONVERSION & CTA SLIDE:
  * Eyebrow: "FIND THE PERFECT PRESENT" or "EASY GIFTING"
  * Headline: Clear call to action to visit ${websiteUrl}
  * Subheadline: "Browse curated hampers, bespoke gift boxes, and thoughtful surprises"
  * body: Encouraging closing note to save this post, share with someone who needs gift inspiration, or tap the link in bio to shop now.
  * bulletPoints: [
      "Save this post for your next celebration",
      "Share with a friend who always asks for gift ideas",
      "Shop the full collection at ${websiteUrl}"
    ]
  * highlightBadge: "Tap Link in Bio"
  * swipePrompt: "Visit ${brandName} ➔"
  * type: "cta"

ALSO PROVIDE:
- A high-converting social media caption formatted with an opening hook, value summary, clear bullet points, CTA to visit ${websiteUrl}, and 8-12 relevant hashtags.
- Suggested visual theme identifier (e.g. "luxury-gold", "editorial-stone", "warm-terracotta", "midnight-velvet", "rose-champagne").
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are an elite digital marketing and social media copywriter specialized in curated gifting, lifestyle retail, and swipeable carousels. Produce high-end, conversational, clean copy without generic clichés.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Short catchy title for the carousel project",
            },
            themeSuggestion: {
              type: Type.STRING,
              description: "Recommended aesthetic theme name",
            },
            keyTakeaway: {
              type: Type.STRING,
              description: "One-sentence core message or summary",
            },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slideNumber: { type: Type.INTEGER },
                  type: {
                    type: Type.STRING,
                    description: "cover, content, comparison, quote, or cta",
                  },
                  eyebrow: { type: Type.STRING },
                  headline: { type: Type.STRING },
                  subheadline: { type: Type.STRING },
                  body: { type: Type.STRING },
                  bulletPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  highlightBadge: { type: Type.STRING },
                  footerNote: { type: Type.STRING },
                  swipePrompt: { type: Type.STRING },
                },
                required: ["slideNumber", "type", "eyebrow", "headline", "body"],
              },
            },
            caption: {
              type: Type.STRING,
              description: "Full ready-to-copy social post caption",
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 8-12 trending hashtags",
            },
            callToAction: {
              type: Type.STRING,
              description: "Short primary CTA phrase",
            },
          },
          required: ["title", "slides", "caption", "hashtags"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini model.");
    }

    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (err: any) {
    console.error("Error in /api/generate-carousel:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate carousel content.",
    });
  }
});

// Endpoint: Suggest trending gifting topics
app.post("/api/suggest-topics", async (req: Request, res: Response) => {
  try {
    const { category, customKeyword } = req.body;

    const prompt = `
Generate 8 high-performing, viral social media carousel topics for the gifts boutique "Snazzy Gnome Gifts" (Website: https://snazzy-gnome-1d4893.netlify.app/gifts).
${category ? `Category focus: ${category}` : ""}
${customKeyword ? `Keyword/Vibe: ${customKeyword}` : ""}

Each topic must have:
- title: punchy, scroll-stopping title formatted for an Instagram / LinkedIn slide deck
- category: gift occasion or theme (e.g. Birthday, Luxury Hampers, Budget Chic, Corporate, Anniversaries, Thoughtful Surprises)
- hook: 1-sentence viral hook preview
- angle: content strategy angle (e.g. "Curiosity Gap", "Checklist", "Dos & Don'ts", "Gift Formula")
- slidesCount: recommended number of slides (4 to 7)
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              hook: { type: Type.STRING },
              angle: { type: Type.STRING },
              slidesCount: { type: Type.INTEGER },
            },
            required: ["title", "category", "hook", "angle", "slidesCount"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      return res.json(DEFAULT_TOPICS);
    }
    const topics = JSON.parse(text);
    return res.json(topics);
  } catch (err: any) {
    console.warn("Fallback to default topics due to error:", err.message);
    return res.json(DEFAULT_TOPICS);
  }
});

// Endpoint: Polish / enhance an individual slide
app.post("/api/enhance-slide", async (req: Request, res: Response) => {
  try {
    const { slide, instruction = "Make headline more punchy and body more concise" } = req.body;

    if (!slide) {
      return res.status(400).json({ error: "Slide data is required." });
    }

    const prompt = `
Rewrite and refine this social media carousel slide for Snazzy Gnome Gifts (https://snazzy-gnome-1d4893.netlify.app/gifts).
Current Slide:
${JSON.stringify(slide, null, 2)}

User Enhancement Request:
${instruction}

Return the enhanced slide maintaining concise text, high legibility, and captivating style.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slideNumber: { type: Type.INTEGER },
            type: { type: Type.STRING },
            eyebrow: { type: Type.STRING },
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            body: { type: Type.STRING },
            bulletPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            highlightBadge: { type: Type.STRING },
            footerNote: { type: Type.STRING },
            swipePrompt: { type: Type.STRING },
          },
          required: ["eyebrow", "headline", "body"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Could not enhance slide");
    const enhanced = JSON.parse(text);
    return res.json({
      ...slide,
      ...enhanced,
      slideNumber: slide.slideNumber,
    });
  } catch (err: any) {
    console.error("Error enhancing slide:", err);
    return res.status(500).json({ error: err.message || "Failed to enhance slide" });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`CarouselForge AI server listening on port ${PORT}`);
  });
}

startServer();
