import * as cheerio from 'cheerio';
import type { AdData } from './types.js';

export function parseAdHtml(html: string): AdData {
  const $ = cheerio.load(html);

  // Extract advertiser name
  const advertiserName = extractAdvertiserName($);

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

function extractAdvertiserName($: cheerio.CheerioAPI): string {
  // Try multiple selectors for advertiser name
  const selectors = [
    '[data-testid="page-name"]',
    '.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x1ji3w43.x18d9i69.xkhd6sd.x1a2a7pz.x193iq5w.xeuugli.x1ay05ga.x1y1aw1k.x1sxyh0.xwib8y2.xurb0ha',
    'a[role="link"] span',
    '.x193iq5w span',
  ];

  for (const selector of selectors) {
    const name = $(selector).first().text().trim();
    if (name && name.length > 0 && name !== 'Ad Library') {
      return name;
    }
  }

  return 'Unknown Advertiser';
}

function extractProfileImage($: cheerio.CheerioAPI): string | null {
  // Try to find profile/advertiser image
  const selectors = [
    'img[data-imgperflogname="profileCoverPhoto"]',
    'img[alt*="profile"]',
    'image[role="img"]',
  ];

  for (const selector of selectors) {
    const src = $(selector).first().attr('src') || $(selector).first().attr('xlink:href');
    if (src && isValidImageUrl(src, ['emoji'])) {
      return src;
    }
  }

  return null;
}

function isValidImageUrl(url: string, excludePatterns: string[] = []): boolean {
  if (!url || !url.startsWith('http')) return false;

  // Check if URL path (not domain) contains excluded patterns
  try {
    const urlObj = new URL(url);
    const pathAndQuery = urlObj.pathname + urlObj.search;
    return !excludePatterns.some(pattern => pathAndQuery.toLowerCase().includes(pattern));
  } catch {
    // If URL parsing fails, fall back to simple check
    return !excludePatterns.some(pattern => url.toLowerCase().includes(pattern));
  }
}

function extractMedia($: cheerio.CheerioAPI): { mediaType: 'image' | 'video'; mediaUrl: string } {
  // Check for video first
  const video = $('video source').first().attr('src') || $('video').first().attr('src');
  if (video) {
    return { mediaType: 'video', mediaUrl: video };
  }

  // Look for images - prioritize larger content images
  const imgSelectors = [
    'img[data-visualcompletion="media-vc-image"]',
    'img[referrerpolicy="origin-when-cross-origin"]',
    'div[data-visualcompletion="media-vc-image"] img',
    'img[src*="scontent"]',
  ];

  for (const selector of imgSelectors) {
    const src = $(selector).first().attr('src');
    if (src && isValidImageUrl(src, ['emoji', '/profile'])) {
      return { mediaType: 'image', mediaUrl: src };
    }
  }

  // Fallback: find any substantial image
  const allImages = $('img');
  for (let i = 0; i < allImages.length; i++) {
    const src = $(allImages[i]).attr('src');
    if (src && isValidImageUrl(src, ['emoji'])) {
      return { mediaType: 'image', mediaUrl: src };
    }
  }

  throw new Error('No media content found in HTML');
}

function extractAdText($: cheerio.CheerioAPI): string {
  // Look for ad copy/text
  const textSelectors = [
    '[data-ad-preview="message"]',
    'div[dir="auto"] span',
    '.xdj266r span',
    'div[style*="text-align"] span',
  ];

  const MIN_TEXT_LENGTH = 10;
  const texts: string[] = [];

  for (const selector of textSelectors) {
    $(selector).each((_, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > MIN_TEXT_LENGTH && !texts.includes(text)) {
        texts.push(text);
      }
    });
  }

  // Return the longest text found (likely the main ad copy)
  return texts.sort((a, b) => b.length - a.length)[0] || '';
}

function extractCta($: cheerio.CheerioAPI): string | null {
  // Look for CTA button text
  const ctaSelectors = [
    '[data-testid="cta-button"]',
    'a[role="button"]',
    'button span',
    'div[role="button"] span',
  ];

  const MAX_CTA_LENGTH = 30;

  for (const selector of ctaSelectors) {
    const text = $(selector).first().text().trim();
    if (text && text.length > 0 && text.length <= MAX_CTA_LENGTH) {
      return text;
    }
  }

  return null;
}

function extractDestinationUrl($: cheerio.CheerioAPI): string | null {
  // Try to find the destination link
  const linkSelectors = [
    'a[href*="l.facebook.com"]',
    'a[data-lynx-uri]',
    'a[rel="nofollow noopener"]',
  ];

  for (const selector of linkSelectors) {
    const href = $(selector).first().attr('href');
    if (href && href.startsWith('http')) {
      // Decode Facebook's link wrapper if present
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
