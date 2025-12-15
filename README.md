# Instagram Mirror - Meta Ad Library Parser

A full-stack application that parses Meta Ad Library HTML and renders Instagram-style story previews.

## Architecture

```
instagram-mirror/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── parser.ts      # HTML parsing logic (Cheerio)
│   │   ├── server.ts      # Express server setup
│   │   ├── types.ts       # TypeScript interfaces
│   │   └── routes/
│   │       └── api.ts     # API endpoints
│   └── package.json
├── frontend/         # SvelteKit application
│   ├── src/
│   │   ├── routes/
│   │   │   └── +page.svelte    # Main UI
│   │   └── lib/
│   │       ├── components/
│   │       │   └── InstagramStory.svelte  # Story component
│   │       └── types.ts
│   └── package.json
└── README.md
```

## Features

- ✅ Parse Meta Ad Library HTML into structured data
- ✅ Extract advertiser info, media, text, and CTA
- ✅ Instagram-style story rendering (9:16 aspect ratio)
- ✅ Support for both images and videos
- ✅ Responsive design
- ✅ Error handling and validation
- ✅ TypeScript for type safety

## Tech Stack

**Backend:**
- Node.js
- Express
- Cheerio (HTML parsing)
- TypeScript
- CORS

**Frontend:**
- SvelteKit
- Svelte 5 (with runes)
- TypeScript
- Vite

## Setup & Installation

### Prerequisites
- Node.js 20.18.1+ (recommended via [NVM](https://github.com/nvm-sh/nvm))
- npm (comes with Node.js)

### Quick Start (Recommended)

**Step 1: Install everything**
```bash
./install.sh
```

**Step 2: Run both servers**
```bash
./run.sh
```

This will:
- Install all dependencies (root + backend + frontend)
- Create `.env` files from templates (if missing)
- Start both servers concurrently

**Servers:**
- Backend: `http://localhost:3002`
- Frontend: `http://localhost:5173`

**Stop:** Press `Ctrl+C` (stops both servers)

### Alternative: Manual Setup

#### Backend
```bash
cd backend
cp .env.example .env  # Copy environment template
npm install
npm run dev
```
Runs on `http://localhost:3002`

**Environment Variables:**
- `PORT` - Server port (default: 3002)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:5173)

#### Frontend
```bash
cd frontend
cp .env.example .env  # Copy environment template
npm install
npm run dev
```
Runs on `http://localhost:5173`

**Environment Variables:**
- `PUBLIC_API_URL` - Backend API URL (default: http://localhost:3002)

### NPM Scripts (Alternative)
```bash
# Install all dependencies at once
npm run install:all

# Run both servers
npm run dev

# Build backend
npm run build
```

## Usage

1. Start both backend and frontend servers
2. Visit `http://localhost:5173`
3. Go to [Meta Ad Library](https://www.facebook.com/ads/library/)
4. Search for an advertiser
5. Right-click on an ad → Inspect
6. Copy the HTML of the ad element
7. Paste into the text area
8. Click "Parse & Preview"

## API Documentation

### POST `/api/parse-ad`

Parse Meta Ad Library HTML and extract structured ad data.

**Request:**
```json
{
  "html": "<html>...</html>"
}
```

**Response:**
```json
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

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Development Commands

### Backend
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Run production build
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Key Implementation Details

### HTML Parsing Strategy
The parser uses multiple CSS selectors to extract data, prioritizing:
1. Data attributes (e.g., `data-testid`)
2. Specific class names
3. Element structure patterns
4. Generic fallbacks

### Instagram Story Rendering
- 9:16 aspect ratio container
- Gradient overlays for readability
- Absolute-positioned header/footer
- Instagram-style fonts and spacing
- Hover effects on CTA button

### Error Handling
- Input validation (empty HTML, invalid format)
- Network error handling
- User-friendly error messages
- Graceful degradation (missing fields)

## License

MIT
