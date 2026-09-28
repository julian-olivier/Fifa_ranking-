# ♞ FIFA.ELO — Roommate EA FC Ranking & Game Review

A **Chess.com-inspired rating and analytics software** crafted specifically for local FIFA / EA Sports FC games between roommates.

---

## 🌟 Highlights & Features

### 1. ♟️ Authentic Chess.com Aesthetic & Elo Engine
- **Rank Divisions & Badges**:
  - 👑 **Grandmaster (GM)**: 2000+
  - 🏆 **Master (M)**: 1800 - 1999
  - 💎 **Diamond (DIA)**: 1600 - 1799
  - 💠 **Platinum (PLAT)**: 1400 - 1599
  - 🥇 **Gold (GOLD)**: 1200 - 1399 *(Standard starting Elo)*
  - 🥈 **Silver (SLV)**: 1000 - 1199
  - 🥉 **Bronze (BRZ)**: 800 - 999
  - 🪵 **Wood**: < 800
- **Dynamic Elo & Margin of Victory (MOV)**:
  - Base expected win probability formula: $E_A = \frac{1}{1 + 10^{(R_B - R_A)/400}}$
  - Dynamic K-factor: 48 for provisional calibration (first 5 games), 32 standard.
  - Smooth goal margin multiplier: a 4-0 blowout rewards more Elo than a narrow 1-0 or penalty shootout.
  - **Live Elo Prediction Bar**: When setting up a match, the app previews the exact rating gain/loss for both roommates before you click submit!

### 2. 🔍 Iconic "Game Review" & Accuracy Analysis
- Modeled directly after Chess.com's post-game evaluation screen:
  - **Simulated Accuracy Percentage** (e.g. `92.4% Accuracy` vs `68.1% Accuracy`).
  - **Tactical Classifications**:
    - 💎 **Brilliant**: Dominant blowout or stunning upset against a higher-rated roommate
    - ✨ **Great**: Controlled victory or clean sheet
    - 📘 **Book Play**: Expected tactical result
    - ❓ **Inaccuracy**: Conceding multiple goals
    - ⚠️ **Mistake**: Blown lead or squandered possession
    - ❌ **Blunder**: Catastrophic breakdown (conceded 4+ goals)
    - 🚨 **Rage Quit / Forfeit**: Disconnected before the final whistle (applies rating penalty & awards opponent *Rage Inducer* achievement!)
  - **Coach's Key Moments**: Timeline of turning points, tactical blunders, and dagger goals.

### 3. 🥇 Roommate Podium & Global Leaderboard
- Top 3 Podium with crowns, medals, and rating division badges.
- Full table with search, sorting by **Elo**, **Win Rate %**, **Goals Scored**, and **Streak**.
- Interactive **Recent Form Pills** (`[W] [W] [D] [L] [W]`).
- Quick-challenge action buttons to immediately launch a match between players.

### 4. ⚔️ Head-to-Head (H2H) Rivalry Hub
- Compare any two roommates to resolve house arguments:
  - Visual Win/Draw/Loss ratio split bar.
  - Total goals scored and goal difference in their rivalry.
  - Complete history of every derby match played between them.
  - One-click **Play Derby** launcher!

### 5. 🏆 Trophy Cabinet & Achievements
- Roommates unlock achievements as they play:
  - 🎩 *Hat-Trick Hero* — Score 3+ goals in a match
  - 🧱 *The Brick Wall* — Keep a clean sheet
  - ⚔️ *Giant Slayer* — Beat an opponent rated 150+ Elo higher
  - 🔥 *On Fire!* — Win 5 matches in a row
  - 🤬 *Rage Inducer* — Force an opponent to rage quit
  - 🌪️ *Total Football* — Win by 4+ goals margin
  - 🏆 *Master Tactician* — Reach 1800+ Elo
  - 👑 *Living Room Grandmaster* — Reach 2000+ Elo

### 6. 📈 Interactive Rating Trajectory Chart
- Detailed player profile modal with **Recharts** interactive timeline graph tracking rating rise and fall across games.

### 7. 🔊 Web Audio API Sound Design
- Synthesized game audio with zero external dependencies:
  - Crisp chess button clicks
  - Double referee whistle on kickoff/submit
  - Triumphant victory fanfare & confetti celebration
  - Blunder buzzer and rating level-up chimes
  - Sound effects toggle in top navigation.

### 8. 🏆 Weekend Knockout Cups
- Create 4-player knockout brackets ("Friday Living Room Cup", "Champions League").
- Advance winners through Semifinals to the Grand Final with automatic champion crowning!

### 9. 💾 Local Network & Disk Persistence
- Data is saved directly to disk at `data/fifa_data.json` and mirrored in browser `localStorage`.
- Includes one-click **JSON Backup Export & Import** and **Reset to Seed Data**.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+) and npm

### Run Locally
```bash
# 1. Start development server
npm run dev

# 2. Or run the optimized production build
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Playing from Couch / Phone (Local Wi-Fi)

To allow everyone in the living room to access the ranking app from their phones or tablets while playing on the console:

```bash
# Bind to all network interfaces
npm run dev -- -H 0.0.0.0 -p 3000
# or
npm run start -- -H 0.0.0.0 -p 3000
```
Then find your computer's local IP address (e.g. `192.168.1.45`) by running `ipconfig` in terminal.
Any roommate connected to the same Wi-Fi can open:
```
http://192.168.1.X:3000
```
and log matches, inspect head-to-head records, and view the live leaderboard!

---

## ⚽ Default Seed Roommates
The app comes preloaded with realistic historical records and rivalries:
1. **Julian** (*The Special One*) — 1845 Elo (Grandmaster) • Real Madrid
2. **Leo** (*The Dribbler*) — 1720 Elo (Master) • Manchester City
3. **Marcus** (*Counter Merchant*) — 1540 Elo (FIFA Master) • Arsenal
4. **Sam** (*Cross & Inshallah*) — 1390 Elo (Candidate Master) • Bayern Munich
5. **Alex** (*Park The Bus*) — 1220 Elo (Sweat) • Inter Milan
6. **David** (*Rage Specialist*) — 1080 Elo (Chaos) • Paris Saint-Germain

*You can add new roommates or reset anytime from the top menu.*
