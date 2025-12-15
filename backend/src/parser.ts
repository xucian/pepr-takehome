import * as cheerio from 'cheerio';
import type { AdData } from './types.js';

export function parseAdHtml(html: string): AdData {
  const $ = cheerio.load(html);

  // Extract advertiser info
  const { name: advertiserName, pageUrl } = extractAdvertiserInfo($);

  // Extract profile image
  const profileImage = extractProfileImage($);

  // Extract media (image or video)
  const { mediaType, mediaUrl } = extractMedia($);

  // Extract ad text/copy
  const text = extractAdText($);

  // Extract CTA button
  const cta = extractCta($);

  // Extract destination URL
  const destinationUrl = extractDestinationUrl($);

  return {
    advertiser: {
      name: advertiserName,
      profileImage,
      pageUrl,
    },
    creative: {
      mediaType,
      mediaUrl,
      text,
      cta,
    },
    metadata: {
      platform: 'instagram',
      format: 'story',
      destinationUrl,
    },
  };
}

function extractAdvertiserInfo($: cheerio.CheerioAPI): { name: string; pageUrl: string | null } {
  // Strategy: Find links to facebook.com/[advertiser] and extract the text from span inside
  let advertiserName = 'Unknown Advertiser';
  let pageUrl: string | null = null;

  $('a[href*="facebook.com/"]').each((_, elem) => {
    const href = $(elem).attr('href');
    const $elem = $(elem);

    // Extract brand name and URL
    if (href && !href.includes('/ads/library') && !pageUrl) {
      // Try to find span with advertiser name inside the link
      const spanText = $elem.find('span').first().text().trim();

      // Also check if img alt has the advertiser name
      const imgAlt = $elem.closest('div').find('img').attr('alt');

      const linkText = spanText || imgAlt || $elem.text().trim();

      if (linkText && linkText.length > 0 && linkText.length < 100) {
        const excludeTexts = ['Ad Library', 'Sponsored', 'See more', 'Learn more', 'See ad details'];
        const isExcluded = excludeTexts.some(exclude => linkText.includes(exclude));

        if (!isExcluded && linkText !== 'Active') {
          advertiserName = linkText;
          pageUrl = href;
          return false; // Break out of loop
        }
      }
    }
  });

  return { name: advertiserName, pageUrl };
}

function extractProfileImage($: cheerio.CheerioAPI): string | null {
  // Strategy: Profile images are the SMALLEST images (typically 40x40, 50x50, 60x60)
  interface ImageCandidate {
    src: string;
    size: number; // width * height
  }

  const images: ImageCandidate[] = [];

  $('img').each((_, elem) => {
    const src = $(elem).attr('src');
    if (!src || !src.startsWith('http')) return;

    // Try to parse dimensions from URL (e.g., s60x60, 40x40)
    const dimensionMatch = src.match(/[_s](\d+)x(\d+)/);
    if (dimensionMatch) {
      const width = parseInt(dimensionMatch[1]);
      const height = parseInt(dimensionMatch[2]);
      const size = width * height;

      // Profile pics are small (less than 100x100)
      if (size < 10000) {
        images.push({ src, size });
      }
    }
  });

  // Return the smallest image (likely the profile pic)
  if (images.length > 0) {
    images.sort((a, b) => a.size - b.size);
    return images[0].src;
  }

  return null;
}

function extractMedia($: cheerio.CheerioAPI): { mediaType: 'image' | 'video'; mediaUrl: string } {
  // Check for video first
  const video = $('video source').first().attr('src') || $('video').first().attr('src');
  if (video) {
    return { mediaType: 'video', mediaUrl: video };
  }

  // Strategy: Main creative is the LARGEST image
  interface ImageCandidate {
    src: string;
    size: number;
  }

  const images: ImageCandidate[] = [];

  $('img').each((_, elem) => {
    const src = $(elem).attr('src');
    if (!src || !src.startsWith('http')) return;

    // Parse dimensions from URL
    const dimensionMatch = src.match(/[_s](\d+)x(\d+)/);
    if (dimensionMatch) {
      const width = parseInt(dimensionMatch[1]);
      const height = parseInt(dimensionMatch[2]);
      const size = width * height;

      // Main creative is large (typically 600x600 or larger)
      if (size >= 100000) {
        images.push({ src, size });
      }
    } else {
      // If no dimensions in URL, check referrerpolicy (main images often have this)
      const refPolicy = $(elem).attr('referrerpolicy');
      if (refPolicy === 'origin-when-cross-origin') {
        // Assume it's large
        images.push({ src, size: 999999 });
      }
    }
  });

  // Return the largest image
  if (images.length > 0) {
    images.sort((a, b) => b.size - a.size);
    return { mediaType: 'image', mediaUrl: images[0].src };
  }

  throw new Error('No media content found in HTML');
}

function extractAdText($: cheerio.CheerioAPI): string {
  // Strategy: Ad text is in div[role="button"][tabindex="0"] that's NOT inside a link
  const candidates: string[] = [];
  const excludeTexts = [
    'Sponsored', 'Active', 'Library ID', 'Started running', 'Platforms',
    'See ad details', 'Ad Library', 'MCDONALDS.COM', '.COM', 'Download the McDonald',
    'Shop Now', 'Order now', 'Learn More', 'Get Started', 'Open Drop-down'
  ];

  // Look for divs with role="button" and tabindex="0" NOT inside links
  $('div[role="button"][tabindex="0"]').each((_, elem) => {
    const $elem = $(elem);

    // Skip if this button is inside a link (those are card CTAs)
    if ($elem.closest('a').length > 0) return;

    // Get HTML and convert <br> to newlines
    let text = $elem.html() || '';
    text = text.replace(/<br\s*\/?>/gi, '\n');
    // Remove all other HTML tags
    text = text.replace(/<[^>]+>/g, '');
    // Decode HTML entities and trim
    text = $('<div>').html(text).text().trim();

    // Ad copy is typically 10-500 chars (increased to handle line breaks)
    if (text &&
        text.length >= 10 &&
        text.length <= 500 &&
        !excludeTexts.some(exclude => text.includes(exclude))) {
      candidates.push(text);
    }
  });

  // Return first match
  if (candidates.length > 0) {
    return candidates[0];
  }

  return '';
}

function extractCta($: cheerio.CheerioAPI): string | null {
  // Strategy: Find short actionable text in [role="button"] elements
  const ctaPatterns = /^(Shop|Learn|Sign|Get|Download|Book|Buy|Join|Watch|Play|Start|View|Discover|Explore|Try|Order)/i;
  const validCtas = ['Shop Now', 'Learn More', 'Sign Up', 'Get Started', 'Download', 'Book Now', 'Order now', 'Order Now'];
  const excludeCtas = ['SEE AD DETAILS', 'See ad details', 'MCDONALDS.COM'];

  // Look specifically in role="button" divs
  const buttons = $('[role="button"]');

  for (let i = 0; i < buttons.length; i++) {
    const text = $(buttons[i]).text().trim();

    // Skip Instagram UI elements
    if (excludeCtas.some(exclude => text.toUpperCase().includes(exclude.toUpperCase()))) {
      continue;
    }

    // CTA is short (3-25 chars) and actionable
    if (text &&
        text.length >= 3 &&
        text.length <= 25 &&
        (validCtas.includes(text) || ctaPatterns.test(text))) {
      // Exclude domain names
      if (!text.includes('.COM') && !text.includes('.com') && !text.includes('http')) {
        return text;
      }
    }
  }

  return null;
}

function extractDestinationUrl($: cheerio.CheerioAPI): string | null {
  // Look for Facebook's link wrapper
  const linkSelectors = [
    'a[href*="l.facebook.com"]',
    'a[data-lynx-uri]',
  ];

  for (const selector of linkSelectors) {
    const href = $(selector).first().attr('href');
    if (href && href.startsWith('http')) {
      // Decode Facebook's link wrapper
      try {
        const url = new URL(href);
        const destination = url.searchParams.get('u');
        if (destination) {
          return decodeURIComponent(destination);
        }
        return href;
      } catch {
        return href;
      }
    }
  }

  return null;
}
