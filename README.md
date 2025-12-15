# Instagram Mirror

Parse Meta Ad Library HTML and render Instagram-style story previews.

## Architecture

**Backend** (Node.js + Express): Parses HTML with Cheerio, exposes REST API
**Frontend** (SvelteKit): Consumes API, renders Instagram story UI

```
/backend
  /src
    parser.ts       # HTML parsing logic
    server.ts       # Express server
    types.ts        # TypeScript types
    /routes
      api.ts        # POST /api/parse-ad

/frontend
  /src
    /routes
      +page.svelte           # Main UI
    /lib
      /components
        InstagramStory.svelte  # Story renderer
      types.ts
```

## Quick Start

```bash
./install.sh  # Install dependencies
./run.sh      # Start both servers
```

- **Backend**: http://localhost:3002
- **Frontend**: http://localhost:5173

## Usage

1. Visit http://localhost:5173
2. Go to [Meta Ad Library](https://www.facebook.com/ads/library/)
3. Search for an advertiser, filter by Instagram
4. Right-click ad → Inspect → Copy HTML element
5. Paste and click "Parse & Preview"

## API

### `POST /api/parse-ad`

**Request:**
```json
{
  "html": "<html>...</html>"
}
```

**Response (200):**
```json
{
  "advertiser": {
    "name": "Nike",
    "profileImage": "https://...",
    "pageUrl": "https://facebook.com/nike"
  },
  "creative": {
    "mediaType": "image",
    "mediaUrl": "https://...",
    "text": "Ad copy text",
    "cta": "Shop Now"
  },
  "metadata": {
    "platform": "instagram",
    "format": "story",
    "destinationUrl": "https://..."
  }
}
```

**Error (400/500):**
```json
{
  "error": "Error message"
}
```

## Tech Stack

- **Backend**: Node.js, Express, Cheerio, TypeScript
- **Frontend**: SvelteKit (Svelte 5), TypeScript, Vite

## Features

- Extracts advertiser name, profile image, media, text, CTA
- Supports images and videos
- Instagram-style 9:16 story layout
- Responsive design
- Error handling and validation

## License

MIT
