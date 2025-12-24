# 🏯 Sengoku - Feudal Japan Strategy Map

An interactive grand strategy map for managing clan warfare in feudal Japan. Built for Roblox communities to coordinate battles and territory control.

## Features

- 65 historical provinces from the Sengoku period
- 10 playable clans with unique starting positions
- Army movement planning with visual arrows
- Building construction system
- Admin panel for battle resolution
- Weekly turn-based system

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
```

## Deploy to Vercel

### Option A: One-Click Deploy
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repo
5. Click "Deploy" (settings auto-detected)
6. Done! Your site is live at `your-project.vercel.app`

### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

## Project Structure

```
sengoku-map/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx
│   ├── SengokuMap.jsx    # Main map component
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Roadmap

### Phase 2: Persistence
- [ ] Supabase database integration
- [ ] Discord OAuth authentication
- [ ] Role-based access (Lord, Council, Admin)
- [ ] Save/load game state

### Phase 3: Game Mechanics
- [ ] Fog of war (forests hide army counts)
- [ ] Terrain movement modifiers
- [ ] Unrest system for conquered provinces
- [ ] Diplomacy (alliances, treaties)

### Phase 4: Roblox Integration
- [ ] Webhook to trigger Roblox battles
- [ ] Battle result API endpoint
- [ ] Live status updates

## License

MIT
