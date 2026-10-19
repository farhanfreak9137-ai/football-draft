# Historical Football Draft Game

A complete, production-ready, browser-based tactical football draft game. Draft starting XIs from 40 verified historical team editions (20 National Teams, 20 Clubs), challenge a tactical AI or an opponent in real-time private rooms, and watch an authentic 90-second luck-first football simulation unfold.

---

## Key Features

1. **Verified Historical Database:**
   - **20 National Team Editions (1950–2022):** Brazil 1970, Hungary 1954, Spain 2010, Greece 2004, West Germany 1974, Argentina 2022, France 1998, Italy 1982, Netherlands 1974, and more.
   - **20 Club Season Editions (1959–2023):** Real Madrid 1959–60, Ajax 1971–72, AC Milan 1988–89, Barcelona 2010–11, Arsenal 2003–04, Manchester City 2022–23, Bayern Munich 2012–13, Inter Milan 2009–10, and more.
   - **386 Real-World Player Identities** with strict cross-version uniqueness enforcement (e.g. Lionel Messi 2009 vs 2015 vs 2022).
   - **441 Verified Player Versions** with documented 1–100 OVR form ratings, natural and secondary positions, and Golden Legend Seals.
   - **21 Authoritative Sources:** FIFA, UEFA, RSSSF historical archives, and official club records with strict verification checks.

2. **Server-Authoritative Draft Engine:**
   - Standard tactical formation presets: **4-3-3**, **4-4-2**, **4-2-3-1**, and **3-5-2**.
   - Tactical strategy selection: **Attacking**, **Balanced**, and **Defensive**.
   - Strict 40-second turn countdown timer managed by the server clock.
   - Deterministic auto-pick fallback on timer expiry: Highest OVR → natural position match → legend seal → squad number → alphabetical ID.
   - Two rerolls per XI, with automatic replacement for impossible rolls (never consuming a user reroll).

3. **Strictly Luck-First 90-Second Match Simulation:**
   - **1 Real-Time Second = 1 Simulated Match Second** (90-second standard match).
   - Driven by a seedable PRNG (`Mulberry32`) guaranteeing that normal teams can defeat legendary squads (e.g., Greece 2004 defeating legendary sides).
   - Real squad event attribution: goals, assists, saves, tackles, fouls, and cards credited to active players on the pitch.
   - Authoritative extra time (2 × 15 real seconds) and sudden-death penalty shootout if tied.
   - Real-time animated 2D pitch visualizer and scrolling match event feed.

4. **Multiplayer & Reconnection Resilience:**
   - Solo mode against tactical historical AI.
   - Private 2-player multiplayer rooms with 6-character room codes.
   - Stateless seat authentication tokens stored in localStorage enabling instant reconnection upon browser refresh or network interruption.
   - 1-hour automated room cleanup for abandoned sessions.

---

## Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Web Audio API synth sounds.
- **Backend:** Node.js, Express, WebSocket (`ws`), TypeScript.
- **Database:** SQLite / `@libsql/client` (zero-dependency local development) and PostgreSQL migration scripts for remote VPS deployments.
- **Testing:** Vitest (21 automated unit, Monte Carlo, and end-to-end integration tests).

---

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Historical Data Validation
```bash
npm run validate
```
Expected output:
```
Status: PASSED
Accepted records: 386 identities, 40 editions, 441 player versions, 21 sources.
Errors: 0
```

### 3. Run Automated Tests
```bash
npm test
```
Runs 21 tests across 4 test suites verifying the match engine, draft rules, multiplayer room lifecycle, and REST API.

### 4. Build Client and Server
```bash
npm run build:client
npm run build:server
```

### 5. Launch Development Server
- **Start Backend Server:**
  ```bash
  npm run dev:server
  ```
  Runs at `http://localhost:3001` (API and WebSocket).

- **Start Vite Client:**
  ```bash
  npm run dev:client
  ```
  Runs at `http://localhost:5173` with automatic reverse proxy to port 3001.

---

## Directory Structure

```
├── data/
│   ├── sources.json              # 21 authoritative archival sources
│   ├── identities.json           # 386 real-world player identity records
│   ├── editions_national.json    # 20 verified national team editions
│   ├── editions_club.json        # 20 verified club season editions
│   ├── players_national.json     # 220 national tournament player versions
│   └── players_club.json         # 221 club season player versions
├── docs/
│   ├── rating_methodology.md     # Documented 1-100 OVR and Legend Seal methodology
│   ├── validation_report.json    # Machine-readable data verification report
│   └── deployment.md             # Linux VPS production deployment instructions
├── migrations/
│   └── 001_initial_schema.sql    # PostgreSQL schema migration
├── scripts/
│   ├── validateData.ts           # Schema and uniqueness validation utility
│   └── runMigrations.ts          # Database migration runner
├── src/
│   ├── client/                   # React frontend
│   │   ├── components/           # Pitch, RosterList, MatchView, Modals
│   │   ├── i18n/                 # Restrained football labels and messages
│   │   ├── services/             # API client and WebSocket handlers
│   │   └── utils/                # Web Audio sound synthesis
│   ├── server/                   # Express & WebSocket multiplayer backend
│   │   ├── db.ts                 # Database persistence and in-memory cache
│   │   ├── roomManager.ts        # Turn management, timeouts, and solo AI
│   │   ├── routes.ts             # REST API endpoints
│   │   └── wsHandler.ts          # Real-time WebSocket broadcasting
│   └── shared/                   # Shared TypeScript models and game engines
│       ├── constants/            # Formations (4-3-3, 4-4-2, 4-2-3-1, 3-5-2)
│       ├── engine/               # PRNG, DraftEngine, MatchEngine
│       └── types/                # Strict domain types
└── tests/                        # Vitest test suite
    ├── draftEngine.test.ts
    ├── matchEngine.test.ts
    ├── roomManager.test.ts
    └── e2eSoloAndMultiplayer.test.ts
```

---

## Production Deployment

Refer to [`docs/deployment.md`](file:///docs/deployment.md) for full instructions on deploying using Docker Compose, Systemd, Nginx reverse proxy, and setting up automated database backups.

