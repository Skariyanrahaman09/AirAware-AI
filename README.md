# AirAware AI – Smart Winter Smog & Air Pollution Assistant

[![GitHub Repository](https://img.shields.io/badge/GitHub-AirAware--AI-emerald?style=flat&logo=github)](https://github.com/Skariyanrahaman09/AirAware-AI)
[![Tests Passing](https://img.shields.io/badge/Tests-44%20passed%20(100%25)-brightgreen?style=flat&logo=jest)](tests/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat&logo=node.js)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack, GenAI-powered web application built to empower families, students, workers, and communities navigating severe winter smog and urban air pollution episodes worldwide.

AirAware AI acts as an intelligent environmental health assistant that provides personalized recommendations for reducing personal exposure to toxic particulate matter (PM2.5, PM10), optimizing indoor air purification, adopting low-emission daily routines, and measuring sustainable lifestyle impacts.

---

## 🌟 Core Features & Highlights

### 1. Real-Time Global Air Quality Station & Live Tracking
- **Worldwide Multi-City Coverage**: Real-time atmospheric metrics and dynamic geocoding for any city globally (Delhi, Kolkata, Mumbai, Bengaluru, Lahore, Beijing, London, New York, Tokyo, etc.).
- **Live GPS Geolocation**: One-click **"Live GPS"** detection using high-accuracy browser geolocation with automatic reverse-geocoding to the nearest regional air monitoring station.
- **30-Second Live Polling & Countdown**: Automated background polling timer with active pulse indicator and pause/resume controls.
- **Instant Autocomplete Search**: Quick global city search with instant AQI badge previews via `GET /api/air-quality/search?q=...`.
- **Live Pollutant Breakdown**: Continuous tracking of PM2.5, PM10, Nitrogen Dioxide ($\text{NO}_2$), Carbon Monoxide ($\text{CO}$), Sulfur Dioxide ($\text{SO}_2$), and Ground Ozone ($\text{O}_3$).
- **Color-Coded AQI Gauge**: Interactive circular gauge with official EPA category breakpoints:
  - 🟢 **Good (0–50)**
  - 🟡 **Moderate (51–100)**
  - 🟠 **Unhealthy for Sensitive Groups (101–150)**
  - 🔴 **Unhealthy (151–200)**
  - 🟣 **Very Unhealthy (201–300)**
  - 🟤 **Hazardous (301–500+)**
- **24-Hour Hourly Curve**: Area and line charts illustrating winter thermal inversion patterns (early morning & late evening smog peaks).
- **5-Day Weather & Smog Forecast**: Predictive planning for upcoming weekly commutes and outdoor activities.

### 2. GenAI Environmental Assistant
- **Context-Aware Reasoning**: Integrates live local AQI, temperature, humidity, and user vulnerability profiles directly into the prompt context.
- **Structured Science-Backed Output**: Answers *WHAT* to do, *WHY* it matters, and *HOW* to implement it.
- **Emergency Hazardous Precautions**: Automatic health alerts when AQI exceeds hazardous thresholds.
- **Robust Fallback Engine**: If OpenAI API key is not configured or offline, the application seamlessly utilizes its internal expert environmental engine with zero interruption.

### 3. Personalized Low-Emission Daily Routine
- **Dynamic 4-Block Schedule**:
  - **Early Morning (06:00 – 09:00)**: Inversion peak protection, indoor stretching, vehicle cabin AC recirculation mode.
  - **Midday (10:00 – 14:00)**: Errands chaining, work focus, controlled 15-minute cross-ventilation window.
  - **Evening Commute (16:00 – 19:30)**: Rush hour stop-and-go avoidance, arrival skin sanitization.
  - **Night & Sleep (20:00 – 06:00)**: Damp microfiber bedroom wiping, quiet HEPA sleep mode.
- **Lifestyle Customization**: Student, Office Commuter, Remote Worker, and Multi-Member Family.

### 4. Indoor Air Quality & Purification Master Guide
- **Scientific Pollutant Separation**:
  - **Particulate Matter (PM2.5/PM10)**: Mechanical HEPA H13 filtration, damp mopping (preventing dust resuspension), weatherstripping window drafts.
  - **Gaseous Pollutants (NO2/CO/VOCs)**: Activated carbon adsorption, kitchen range hood exhaust, strict zero-incense/candle rule.
- **Budget-Friendly DIY Strategies**: Blueprints for the low-cost Corsi-Rosenthal Box Fan + MERV-13 filter (\$25-\$35 vs \$300+ commercial purifiers), damp towel draft stoppers, and natural simmer pots.
- **Live Room Ventilation Indicator**: Alerts whether outdoor air is clean enough to open windows.

### 5. Sustainability & Emissions Impact Calculator
- **Multi-Dimensional Metrics**:
  - Annual avoided $\text{CO}_2$ emissions ($\text{kg CO}_2\text{e}$).
  - Conserved fuel (liters) and financial savings (\$ USD).
  - Mature tree offset equivalents.
  - Breathing-zone tailpipe $\text{PM}_{2.5}$ eliminated from city street air (grams).
  - Unnecessary vehicle trips reduced via errand chaining.
- **Empirical Transparency**: Transparent calculation assumptions based on IPCC, EPA, and EEA emission factors.
- **Scientific Distinction**: Clearly distinguishes between long-term atmospheric $\text{CO}_2$ reductions and immediate acute local $\text{PM}_{2.5}$ exposure.

### 6. Family & Community Hub
- **Household Vulnerability Profiling**: Tailored safeguards for infants, children, seniors (65+), and asthmatics.
- **Community Awareness Board**: Crowdsourced smog spike reports, DIY purifier success stories, carpooling routes, and verified pulmonologist tips.

---

## 🛠️ Technology Stack

### Backend
- **Node.js & Express.js**: Modular REST API architecture.
- **MongoDB & Mongoose**: Schemas for Users, Family Profiles, Chat History, and Community Posts.
- **In-Memory Zero-Setup Fallback**: Automatically spins up an in-memory database if a standalone MongoDB daemon is not running locally.
- **JWT & Bcrypt**: Secure token-based authentication and password hashing.
- **Axios & Rate Limiting**: Caching external air quality requests and preventing abuse.
- **Jest & Supertest**: Automated test suite covering endpoints, calculations, and AI responses.

### Frontend
- **Next.js (App Router, React 18)**: High-performance SSR and client-side rendering.
- **Tailwind CSS**: Clean environmental color palette (emeralds, mints, glassmorphic cards).
- **Framer Motion**: Smooth interface transitions and animated alerts.
- **Recharts**: Responsive area and bar charts for 24h trends and monthly impact.
- **Lucide React**: Clean iconography across all pages.

---

## 📁 Repository Structure

```
Promptwar- 6/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection + in-memory fallback
│   │   │   └── openai.js            # OpenAI GPT client configuration
│   │   ├── controllers/
│   │   │   ├── airQualityController.js
│   │   │   ├── aiController.js
│   │   │   ├── authController.js
│   │   │   ├── communityController.js
│   │   │   ├── familyController.js
│   │   │   ├── impactController.js
│   │   │   └── routineController.js
│   │   ├── models/
│   │   │   ├── ChatHistory.js
│   │   │   ├── CommunityPost.js
│   │   │   ├── FamilyProfile.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── airQualityRoutes.js
│   │   │   ├── aiRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── communityRoutes.js
│   │   │   ├── familyRoutes.js
│   │   │   ├── impactRoutes.js
│   │   │   └── routineRoutes.js
│   │   ├── services/
│   │   │   ├── airQualityService.js  # Open-Meteo & OpenWeatherMap + caching
│   │   │   ├── impactCalculator.js   # Empirical emission & fuel calculator
│   │   │   ├── openaiService.js      # GPT reasoning & structured response
│   │   │   └── recommendationService.js # 4-block routines & DIY guides
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── utils/
│   │   │   └── promptTemplates.js
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   │   ├── aiService.test.js
│   │   ├── airQualityService.test.js
│   │   ├── api.test.js
│   │   ├── impactCalculator.test.js
│   │   └── recommendationService.test.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/page.js         # Authentication page (Login/Register/Demo)
│   │   │   ├── calculator/page.js   # Sustainability impact calculator
│   │   │   ├── chat/page.js         # AI Environmental Chatbot
│   │   │   ├── community/page.js    # Community awareness board
│   │   │   ├── dashboard/page.js    # Real-time air quality dashboard
│   │   │   ├── family/page.js       # Family & household profile
│   │   │   ├── indoor-quality/page.js # Indoor air quality guide
│   │   │   ├── routine/page.js      # Personalized daily routine
│   │   │   ├── globals.css
│   │   │   ├── layout.js
│   │   │   └── page.js              # Modern Landing page
│   │   ├── components/
│   │   │   ├── AqiBadge.js
│   │   │   ├── AqiGauge.js
│   │   │   ├── Footer.js
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   ├── AirDataContext.js
│   │   │   └── AuthContext.js
│   │   └── lib/
│   │       └── api.js
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── package.json
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm** or **yarn**

### Quick Start (Out of the Box)

1. **Clone or Open Project Directory**:
   ```bash
   cd "Promptwar- 6"
   ```

2. **Start Backend Server**:
   In your first terminal:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   *The backend will automatically start on `http://localhost:5000` with an in-memory MongoDB store if no external MongoDB URI is provided.*

3. **Start Frontend Web Application**:
   In your second terminal:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *The frontend will launch on `http://localhost:3000`.*

4. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧪 Running Automated Tests

A comprehensive test suite with 44 automated tests verifies all aspects of backend services, global city geocoding, autocomplete search, EPA breakpoints, emission calculations, routine generation, AI response schema validation, and REST endpoints:

```bash
cd server
npm test
```

### Test Suite Summary:
- `tests/api.test.js`: Health check, Air Quality endpoints, Routine generator, Impact calculator, AI chat, Community posts, and Auth registration/login flow.
- `tests/airQualityService.test.js`: EPA PM2.5 breakpoints calculation (Good, Moderate, USG, Unhealthy, Very Unhealthy, Hazardous), color codes, worldwide geocoding, autocomplete search, and 5-day forecasts.
- `tests/recommendationService.test.js`: 4-block schedule (What, Why, How), particulate vs gas differentiation, and budget alternatives.
- `tests/impactCalculator.test.js`: Commute mode shifting, tree absorption equivalents, fuel savings, and scientific disclaimers.
- `tests/aiService.test.js`: Required JSON schema validation, indoor tips, and child/senior vulnerability protections.

---

## 🔑 Environment Variables Reference

See `.env.example` in the project root:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `CORS_ORIGIN` | Allowed client origin | `http://localhost:3000` |
| `MONGO_URI` | MongoDB connection URI | *(Empty = auto in-memory)* |
| `JWT_SECRET` | Secret key for JWT auth | `airaware_ai_secure_jwt_secret_dev_2026` |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |
| `OPENAI_API_KEY` | OpenAI API Key for GPT | *(Optional, falls back to internal engine)* |
| `OPENAI_MODEL` | OpenAI Model | `gpt-4o-mini` |
| `NEXT_PUBLIC_API_URL`| Frontend API endpoint | `http://localhost:5000` |

---

## 🛡️ Security & Performance

- **Zero Key Leaks**: All external APIs (OpenAI, OpenWeatherMap) are accessed strictly from the backend; no sensitive keys are exposed to the client bundle.
- **Rate Limiting**: Protects API endpoints against DDoS and automated brute-force attacks.
- **Defensive Prompt Engineering**: Defends against prompt injection and persona manipulation.
- **In-Memory Caching**: Caches meteorological and air quality queries with a 10-minute TTL to reduce upstream network calls.

---

## 📄 License
This project is licensed under the MIT License.
