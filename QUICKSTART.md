# Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Step 1: Install (one time)
```bash
./install.sh
```

This installs all dependencies, sets up NVM (if available), creates .env files.

### Step 2: Run
```bash
./run.sh
```

That's it! Both servers start automatically.

✅ Backend ready at `http://localhost:3002`
✅ Frontend ready at `http://localhost:5173`

### Alternative (Manual):
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2 (new terminal)
cd frontend && npm run dev
```

### Step 3: Test It
1. Open http://localhost:5173
2. Visit [Meta Ad Library](https://www.facebook.com/ads/library/)
3. Right-click any ad → Inspect → Copy HTML
4. Paste into text area
5. Click "Parse & Preview"
6. See Instagram story! 🎉

## 📁 Project Structure
```
instagram-mirror/
├── backend/          # Express API (port 3002)
│   └── src/
│       ├── server.ts
│       ├── parser.ts
│       ├── types.ts
│       └── routes/api.ts
├── frontend/         # SvelteKit (port 5173)
│   └── src/
│       ├── routes/+page.svelte
│       └── lib/
│           ├── components/InstagramStory.svelte
│           └── types.ts
└── README.md
```

## 🛠️ Available Commands

### Backend
```bash
npm run dev      # Development with hot reload
npm run build    # Build for production
npm start        # Run production build
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## ✨ Key Features
- 🎨 Instagram-style story rendering (9:16)
- 📱 Responsive design
- 🖼️ Image & video support
- ⚡ Real-time parsing
- 🔒 TypeScript type safety
- 🎯 Error handling

## 📚 Documentation
- [README.md](README.md) - Full documentation
- [SPEC.md](SPEC.md) - Project requirements
- [IMPLEMENTATION.md](IMPLEMENTATION.md) - Technical details
- [CLAUDE.md](CLAUDE.md) - Development guidelines

## 🧪 Quick API Test
```bash
curl http://localhost:3002/health
# {"status":"ok"}

curl -X POST http://localhost:3002/api/parse-ad \
  -H "Content-Type: application/json" \
  -d '{"html":"<img src=\"https://example.com/ad.jpg\" />"}'
# Returns structured ad data
```

## 💡 Tips
- Use actual Meta Ad Library HTML for best results
- Parser uses multiple fallback selectors for robustness
- Empty fields (like CTA) are handled gracefully
- Check browser console for debug info

## ❓ Troubleshooting

**Port already in use?**
```bash
lsof -ti:3000 | xargs kill -9  # Kill process on 3000
lsof -ti:5173 | xargs kill -9  # Kill process on 5173
```

**Dependencies issue?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors?**
```bash
npm run build  # Check TypeScript errors
```

---

**Status:** ✅ Production Ready
**Tech Stack:** Node.js + Express + Cheerio + SvelteKit + TypeScript
**Tested:** Backend ✅ | Frontend ✅ | Integration ✅
