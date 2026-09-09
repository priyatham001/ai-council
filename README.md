# 🌾 KrishiSetu (कृषिसेतु)
### Farmer Intelligence & Agricultural Marketplace Platform
*An Idea Forge Initiative*

KrishiSetu is a unified, production-ready agricultural technology platform that bridges deep farm agronomic intelligence with transparent agricultural commerce on a single unified deployment.

---

## 🏛️ Architecture & Routing

One Domain, One Deployment, One Unified Application:

* **Main Landing Page**: `/`
  * Interactive Agricultural Intelligence Orb
  * Direct access to both core experiences
  * Real-time mandi prices ticker and feature breakdown
* **🌾 Farm Intelligence Experience**: `/crop-analysis`
  * AI Crop Quality Assayer (Agmark Grade standard assessment via Gemini Vision)
  * APMC Mandi price discovery with freight deduction calculations
  * Storage longevity and moisture/foreign matter degradation prediction
  * Net realization analysis (Immediate Mandi vs. Hold & Store vs. Direct Buyer)
* **🚜 Farmer Marketplace Experience**: `/marketplace`
  * **Dashboard**: `/marketplace/dashboard` (or `/marketplace`)
  * **Digital Lots**: `/marketplace/lots` & `/marketplace/lots/new`
  * **Verified Buyers**: `/marketplace/buyers`
  * **Bids & Offers**: `/marketplace/offers`
  * **Logistics & Transport**: `/marketplace/logistics`
  * **Warehouse & Cold Storage**: `/marketplace/storage`
  * **Escrow Transactions**: `/marketplace/transactions`
  * **Grievance Redressal**: `/marketplace/grievances`
  * **Market Explorer**: `/marketplace/markets`
  * **AI Sell Advisor**: `/marketplace/advisor`
* **🤖 Kisan AI**: Native multilingual AI assistant (English, हिन्दी, मराठी, తెలుగు) with Gemini reasoning and live voice mode.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Node.js 20+
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Set your Gemini API key in `.env.local` or environment variables:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Production Build
```bash
npm run build
npm start
```

