# Instagram Mirror - Technical Specification

## Project Overview
Build a minimal end-to-end pipeline that takes an ad from the Meta Ad Library and reproduces how that ad would appear in an Instagram story, with structured ad parameter extraction.

## Core Requirements

### 1. Backend
- **Endpoint**: REST API that accepts Meta Ad Library HTML
- **Processing**: Extract structured ad data from HTML
- **Output**: Return structured JSON with ad parameters

### 2. Frontend
- **Input**: Consume backend API endpoint
- **Rendering**: Display Instagram-style story ad
- **UI**: Visually accurate Instagram story format

## Data Flow
```
Meta Ad Library HTML → Backend Parser → Structured Ad Data → Frontend → Instagram Story UI
```

## Key Ad Parameters to Extract

### Essential Fields
- **Creative Content**
  - Image/Video URL(s)
  - Ad copy/text
  - Call-to-action button text

- **Advertiser Info**
  - Advertiser name
  - Profile picture/logo (if available)

- **Ad Metadata**
  - Platform (Instagram)
  - Format (Story)
  - Link/destination URL (if available)

### Optional Fields
- Sponsored label text
- Additional media (carousel items)
- Hashtags
- Mentions

## API Design

### Endpoint Specification
```
POST /api/parse-ad
Content-Type: application/json

Request Body:
{
  "html": "<html>...</html>"
}

Response:
{
  "success": true,
  "data": {
    "advertiser": {
      "name": "string",
      "profileImage": "string|null"
    },
    "creative": {
      "mediaType": "image|video",
      "mediaUrl": "string",
      "text": "string",
      "cta": "string|null"
    },
    "metadata": {
      "platform": "instagram",
      "format": "story",
      "destinationUrl": "string|null"
    }
  }
}
```

## Frontend Requirements

### Instagram Story Layout
- **Dimensions**: 9:16 aspect ratio (1080x1920 or responsive equivalent)
- **Components**:
  - Header: Advertiser name + profile picture
  - Media: Full-screen image/video
  - Footer: Ad text + CTA button
  - "Sponsored" label

### Visual Fidelity
- Match Instagram's story UI styling
- Responsive design
- Handle both image and video ads

## Technology Stack (Suggestions)

### Backend Options
- Node.js + Express + Cheerio (HTML parsing)
- Python + FastAPI + BeautifulSoup
- Any framework with HTML parsing capabilities

### Frontend Options
- React + Vite/Next.js
- Vue + Nuxt
- Svelte + SvelteKit
- Plain HTML/CSS/JS

### Data Parsing
- Cheerio (Node.js)
- BeautifulSoup (Python)
- jsdom (Node.js)
- Regex + DOM parsing

## Implementation Phases

### Phase 1: Backend Setup
1. Initialize project structure
2. Create API endpoint
3. Implement HTML parser
4. Test with sample Meta Ad Library HTML
5. Return structured JSON

### Phase 2: Frontend Setup
1. Initialize frontend project
2. Create Instagram story component
3. Style to match Instagram UI
4. Connect to backend API
5. Render ad data

### Phase 3: Integration & Testing
1. End-to-end testing
2. Handle edge cases
3. Error handling
4. UI polish

### Phase 4 (Bonus): Instagram Feed View
1. Create feed post layout
2. Different aspect ratio (1:1 or 4:5)
3. Feed-specific UI elements

## Success Criteria
- ✅ Backend successfully parses Meta Ad Library HTML
- ✅ Backend returns structured ad data
- ✅ Frontend renders Instagram-style story
- ✅ Visual similarity to actual Instagram stories
- ✅ End-to-end pipeline works seamlessly

## Testing Approach
1. Manual HTML extraction from https://www.facebook.com/ads/library/
2. Test with multiple advertisers
3. Verify data extraction accuracy
4. Validate Instagram UI rendering

## Notes
- Scraping is out of scope (manual HTML input)
- No authentication required
- No database needed (stateless processing)
- Focus on core functionality over edge cases
