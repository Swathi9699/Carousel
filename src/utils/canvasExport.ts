import { AspectRatio, CarouselTheme, SlideItem } from "../types/carousel";

export function getCanvasDimensions(aspectRatio: AspectRatio): { width: number; height: number } {
  switch (aspectRatio) {
    case '4:5':
      return { width: 1080, height: 1350 };
    case '9:16':
      return { width: 1080, height: 1920 };
    case '1:1':
    default:
      return { width: 1080, height: 1080 };
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export function renderSlideToCanvas(
  slide: SlideItem,
  totalSlides: number,
  theme: CarouselTheme,
  aspectRatio: AspectRatio,
  brandHandle: string,
  websiteUrl: string
): HTMLCanvasElement {
  const { width, height } = getCanvasDimensions(aspectRatio);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Draw Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  if (theme.id === 'luxury-gold') {
    gradient.addColorStop(0, '#0c0a09');
    gradient.addColorStop(0.5, '#171412');
    gradient.addColorStop(1, '#2a1a08');
  } else if (theme.id === 'botanical-sage') {
    gradient.addColorStop(0, '#0f1712');
    gradient.addColorStop(0.5, '#16231c');
    gradient.addColorStop(1, '#0b1610');
  } else if (theme.id === 'midnight-velvet') {
    gradient.addColorStop(0, '#06040d');
    gradient.addColorStop(0.5, '#120e24');
    gradient.addColorStop(1, '#090714');
  } else if (theme.id === 'blush-rose') {
    gradient.addColorStop(0, '#140b0f');
    gradient.addColorStop(0.5, '#291720');
    gradient.addColorStop(1, '#1b0e15');
  } else if (theme.id === 'royal-sapphire') {
    gradient.addColorStop(0, '#040c14');
    gradient.addColorStop(0.5, '#0b1d30');
    gradient.addColorStop(1, '#06121f');
  } else {
    gradient.addColorStop(0, '#171614');
    gradient.addColorStop(0.5, '#24221e');
    gradient.addColorStop(1, '#1c1b18');
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Subtle border glow & luxury frame
  ctx.strokeStyle = theme.canvasAccent;
  ctx.globalAlpha = 0.18;
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, width - 72, height - 72);
  ctx.globalAlpha = 1.0;

  // 2. Top Bar on Slide: Brand Handle & Slide Progress Counter
  ctx.fillStyle = theme.canvasAccent;
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(brandHandle.toUpperCase(), 72, 90);

  // Slide Counter (e.g. "02 / 05")
  const currentNumStr = String(slide.slideNumber).padStart(2, '0');
  const totalNumStr = String(totalSlides).padStart(2, '0');
  ctx.textAlign = 'right';
  ctx.fillStyle = theme.canvasTextSecondary;
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.fillText(`${currentNumStr} / ${totalNumStr}`, width - 72, 90);

  // Subtle decorative top divider
  ctx.strokeStyle = theme.canvasTextSecondary;
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.moveTo(72, 120);
  ctx.lineTo(width - 72, 120);
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  let currentY = 175;
  const contentWidth = width - 144;

  // 3. Eyebrow Tag
  if (slide.eyebrow) {
    ctx.textAlign = 'left';
    ctx.fillStyle = theme.canvasAccent;
    ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(slide.eyebrow.toUpperCase(), 72, currentY);
    ctx.letterSpacing = '0px';
    currentY += 46;
  }

  // 4. Headline
  ctx.fillStyle = theme.canvasTextPrimary;
  const isCover = slide.type === 'cover';
  const headlineFontSize = isCover ? 56 : 46;
  const headlineFontFamily =
    theme.fontHeading === 'serif'
      ? '"Playfair Display", Georgia, serif'
      : theme.fontHeading === 'luxury'
      ? '"Cinzel", serif'
      : '"Syne", sans-serif';

  ctx.font = `700 ${headlineFontSize}px ${headlineFontFamily}`;
  const headlineLines = wrapText(ctx, slide.headline, contentWidth);
  headlineLines.forEach((line) => {
    ctx.fillText(line, 72, currentY);
    currentY += headlineFontSize * 1.22;
  });
  currentY += 12;

  // 5. Subheadline (if any)
  if (slide.subheadline) {
    ctx.fillStyle = theme.canvasAccent;
    ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
    const subLines = wrapText(ctx, slide.subheadline, contentWidth);
    subLines.forEach((line) => {
      ctx.fillText(line, 72, currentY);
      currentY += 36;
    });
    currentY += 16;
  }

  // 6. Highlight Badge (if present)
  if (slide.highlightBadge) {
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    const badgeText = slide.highlightBadge.toUpperCase();
    const textWidth = ctx.measureText(badgeText).width;
    const badgeHeight = 40;
    const badgePaddingX = 20;
    const badgeWidth = textWidth + badgePaddingX * 2;

    // Badge background box
    ctx.fillStyle = theme.canvasCardBg;
    ctx.strokeStyle = theme.canvasAccent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(72, currentY, badgeWidth, badgeHeight, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = theme.canvasAccent;
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, 72 + badgeWidth / 2, currentY + 27);
    ctx.textAlign = 'left';
    currentY += badgeHeight + 28;
  }

  // 7. Body Text Card
  if (slide.body) {
    ctx.fillStyle = theme.canvasTextSecondary;
    ctx.font = '400 26px "Plus Jakarta Sans", sans-serif';
    const bodyLines = wrapText(ctx, slide.body, contentWidth);
    bodyLines.forEach((line) => {
      ctx.fillText(line, 72, currentY);
      currentY += 38;
    });
    currentY += 24;
  }

  // 8. Bullet points (if present)
  if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    const cardPadding = 24;
    const cardTop = currentY;
    const availableHeight = height - 160 - currentY;
    
    // Draw background card for bullet list
    ctx.fillStyle = theme.canvasCardBg;
    ctx.strokeStyle = theme.canvasAccent;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.roundRect(72, cardTop, contentWidth, Math.min(availableHeight, 320), 14);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    let bulletY = cardTop + 38;
    slide.bulletPoints.forEach((bullet) => {
      // Draw bullet icon / pip
      ctx.fillStyle = theme.canvasAccent;
      ctx.beginPath();
      ctx.arc(104, bulletY - 8, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = theme.canvasTextPrimary;
      ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
      const bulletLines = wrapText(ctx, bullet, contentWidth - 70);
      bulletLines.forEach((line, idx) => {
        ctx.fillText(line, 126, bulletY + idx * 32);
      });
      bulletY += bulletLines.length * 32 + 20;
    });
  }

  // 9. Bottom Footer Bar (Website + Swipe Prompt)
  const footerY = height - 60;
  ctx.strokeStyle = theme.canvasTextSecondary;
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.moveTo(72, height - 100);
  ctx.lineTo(width - 72, height - 100);
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Website Clean Display
  ctx.textAlign = 'left';
  ctx.fillStyle = theme.canvasTextSecondary;
  ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
  const cleanUrl = websiteUrl.replace(/^https?:\/\//, '');
  ctx.fillText(cleanUrl, 72, footerY);

  // Swipe Action Prompt
  const promptText = slide.swipePrompt || (slide.slideNumber === totalSlides ? 'Shop now ➔' : 'Swipe ➔');
  ctx.textAlign = 'right';
  ctx.fillStyle = theme.canvasAccent;
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(promptText, width - 72, footerY);

  return canvas;
}

export async function downloadSlideAsPng(
  slide: SlideItem,
  totalSlides: number,
  theme: CarouselTheme,
  aspectRatio: AspectRatio,
  brandHandle: string,
  websiteUrl: string,
  filename: string
): Promise<void> {
  const canvas = renderSlideToCanvas(slide, totalSlides, theme, aspectRatio, brandHandle, websiteUrl);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `slide-${slide.slideNumber}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    }, 'image/png');
  });
}

export async function downloadAllSlidesAsPng(
  slides: SlideItem[],
  theme: CarouselTheme,
  aspectRatio: AspectRatio,
  brandHandle: string,
  websiteUrl: string,
  baseName: string = 'carousel-slide'
): Promise<void> {
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    await downloadSlideAsPng(
      slide,
      slides.length,
      theme,
      aspectRatio,
      brandHandle,
      websiteUrl,
      `${baseName}-${slide.slideNumber}.png`
    );
    // Slight micro-pause so browser triggers multiple downloads smoothly
    await new Promise((r) => setTimeout(r, 220));
  }
}

export async function copySlideToClipboard(
  slide: SlideItem,
  totalSlides: number,
  theme: CarouselTheme,
  aspectRatio: AspectRatio,
  brandHandle: string,
  websiteUrl: string
): Promise<boolean> {
  try {
    const canvas = renderSlideToCanvas(slide, totalSlides, theme, aspectRatio, brandHandle, websiteUrl);
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return resolve(false);
        try {
          // ClipboardItem API
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          resolve(true);
        } catch {
          resolve(false);
        }
      }, 'image/png');
    });
  } catch {
    return false;
  }
}
