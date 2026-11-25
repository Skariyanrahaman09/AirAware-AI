# AirAware AI – Smart Winter Smog & Air Pollution Assistant

[![GitHub Repository](https://img.shields.io/badge/GitHub-AirAware--AI-emerald?style=flat&logo=github)](https://github.com/Skariyanrahaman09/AirAware-AI)
[![Tests Passing](https://img.shields.io/badge/Tests-88%20passed%20(100%25)-brightgreen?style=flat&logo=jest)](server/tests/)
[![CI Pipeline](https://img.shields.io/badge/CI-GitHub%20Actions-blue?style=flat&logo=github-actions)](.github/workflows/ci.yml)
[![WCAG 2.2 AA](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-success?style=flat)](client/src/components/)
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
├── .github/
│   └── workflows/
│       └── ci.yml                   # Automated CI quality pipeline
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
│   │   │   ├── airQualityService.js  # CPCB NAQI + US EPA dual-standard air quality
│   │   │   ├── impactCalculator.js   # Empirical emission & fuel calculator
│   │   │   ├── openaiService.js      # GPT reasoning & structured response
│   │   │   └── recommendationService.js # 4-block routines & DIY guides
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT authentication & route protection
│   │   │   ├── errorMiddleware.js    # Production sanitized error handling
│   │   │   ├── rateLimiters.js       # Dedicated auth, AI & general rate limiters
│   │   │   ├── securityMiddleware.js # OWASP security headers & NoSQL injection sanitizer
│   │   │   └── validationMiddleware.js # Strict API input validation schemas
│   │   ├── utils/
│   │   │   └── promptTemplates.js    # Prompt injection defense & contextual framing
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   │   ├── aiService.test.js
│   │   ├── airQualityService.test.js
│   │   ├── api.test.js
│   │   ├── cpcbAndEnvironmentalAccuracy.test.js
│   │   ├── externalApiMocking.test.js
│   │   ├── impactCalculator.test.js
│   │   ├── recommendationService.test.js
│   │   └── securityAndValidation.test.js
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

A comprehensive automated test suite with **88 passing tests across 9 test suites** (100% pass rate) validates all aspects of backend services, security middleware, input validation schemas, prompt sanitization, statutory CPCB NAQI calculation, US EPA breakpoints, deterministic external API mocking, production deployment readiness, and REST API routes:

```bash
cd server
npm test
```

### Complete Test Suites:
- `tests/productionDeploymentReadiness.test.js`: Health monitoring endpoints (`/api/health` and `/health`), database connectivity status, Express reverse-proxy trust header for cloud load balancers, production refusal of missing `MONGO_URI`, credential sanitization in logs, and CORS origin restrictions.
- `tests/api.test.js`: Health checks, Air Quality endpoints, Routine generator, Impact calculator, AI chat, Community posts, and Auth registration/login flows.
- `tests/cpcbAndEnvironmentalAccuracy.test.js`: Indian statutory Central Pollution Control Board (CPCB NAQI) sub-indices calculation across all 6 breakpoint bands (Good, Satisfactory, Moderate, Poor, Very Poor, Severe), EPA vs CPCB distinctions, dual standards response schema, source provenance validation (`live`, `cached`, `simulated`), dynamic standard resolution on cache hits, and sensor telemetry integrity (ensuring absent gases are strictly `null` and never fabricated).
- `tests/securityAndValidation.test.js`: OWASP security headers (`nosniff`, `DENY`, HSTS, Referrer-Policy, Permissions-Policy), recursive NoSQL query injection sanitizer stripping `$` and `.` operators, input validation middleware (rejecting weak passwords, invalid emails, empty queries, invalid distance ranges), prompt injection defense (`sanitizeQuery`), and production error information leakage prevention.
- `tests/externalApiMocking.test.js`: Deterministic Open-Meteo & OpenAI API mocking, testing network timeouts, 500 server errors, and verifying robust zero-crash fallbacks.
- `tests/airQualityService.test.js`: EPA PM2.5 breakpoints calculation (Good, Moderate, USG, Unhealthy, Very Unhealthy, Hazardous), color codes, worldwide geocoding, autocomplete search, and 5-day forecasts.
- `tests/recommendationService.test.js`: 4-block schedule (What, Why, How), particulate vs gas differentiation, and budget alternatives.
- `tests/impactCalculator.test.js`: Commute mode shifting, tree absorption equivalents, fuel savings, and scientific disclaimers.
- `tests/aiService.test.js`: Required JSON schema validation, indoor tips, and child/senior vulnerability protections.

---

## 🌐 Production Deployment Guide (Vercel + Render + MongoDB Atlas)

Follow this step-by-step guide to launch AirAware AI for real-world public access.

### Deployment Architecture
- **Frontend (Vercel)**: Next.js App Router, SSR, edge caching, and internal API rewrites to the backend.
- **Backend (Render)**: Node.js/Express REST API Web Service running behind reverse proxy, with OWASP headers and rate limiting.
- **Database (MongoDB Atlas)**: Dedicated cloud MongoDB cluster with encrypted storage, automated backups, and replica sets.

---

### Step 1: Set Up MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account (or log in).
2. Click **"Build a Database"** and select the free **M0 Shared** tier.
3. Select your preferred cloud provider (AWS / Google Cloud) and nearest geographic region.
4. Set up security credentials:
   - **Database User**: Create a username (e.g. `airaware_admin`) and a strong password. Note these down securely.
   - **IP Access List**: Go to **Network Access** -> **Add IP Address** -> Select **"Allow Access from Anywhere"** (`0.0.0.0/0`) so Render's dynamic container IPs can connect.
5. Retrieve the Connection URI:
   - Click **Connect** -> **Drivers** (Node.js).
   - Copy the connection string:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/airaware?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.

---

### Step 2: Deploy Backend to Render
1. Go to [Render.com](https://render.com) and create or log in to your account.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `https://github.com/Skariyanrahaman09/AirAware-AI`.
4. Configure the service settings:
   - **Name**: `airaware-ai-backend` (or your chosen name)
   - **Region**: Nearest region to your users (e.g. Frankfurt, Oregon, Singapore)
   - **Branch**: `feature/production-engineering-upgrade` (or `main` after pull request approval)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Click **Advanced** and set **Health Check Path** to `/api/health`.
6. Add **Environment Variables** in the Render Dashboard:
   | Variable | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enforces production security, sanitizes errors, requires Atlas DB |
   | `PORT` | `5000` | Render injects this automatically |
   | `HOST` | `0.0.0.0` | Binds server to all container network interfaces |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string from Step 1 |
   | `JWT_SECRET` | *(Random 32+ char key)* | Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
   | `JWT_EXPIRES_IN`| `7d` | Token expiration duration |
   | `CORS_ORIGIN` | `https://your-frontend.vercel.app` | Temporarily set or update after Vercel deployment in Step 3 |
   | `OPENAI_API_KEY`| *(Optional)* | Your OpenAI API key (optional; built-in AI engine active if empty) |
   | `OPENAI_MODEL` | `gpt-4o-mini` | Recommended OpenAI model |
7. Click **Create Web Service**.
8. Once deployed, copy your public backend URL (e.g. `https://airaware-ai-backend.onrender.com`).
9. Verify health by visiting `https://airaware-ai-backend.onrender.com/api/health` in your browser. You should receive:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "service": "AirAware AI Backend",
     "version": "1.0.0"
   }
   ```

---

### Step 3: Deploy Frontend to Vercel
1. Go to [Vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** -> **Project**.
3. Select your repository `AirAware-AI` and click **Import**.
4. Configure the Project:
   - **Framework Preset**: `Next.js` (automatically detected)
   - **Root Directory**: Click **Edit** and select `client`
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)
5. Expand **Environment Variables** and add:
   | Name | Value |
   | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://airaware-ai-backend.onrender.com` *(your Render URL from Step 2, no trailing slash)* |
6. Click **Deploy**.
7. Vercel will build and deploy the Next.js production bundle.
8. Once complete, copy your public frontend domain (e.g. `https://airaware-ai.vercel.app`).

---

### Step 4: Finalize CORS on Render
1. Return to your [Render Dashboard](https://dashboard.render.com).
2. Open your `airaware-ai-backend` Web Service -> **Environment**.
3. Update `CORS_ORIGIN` with your live Vercel URL from Step 3:
   ```text
   CORS_ORIGIN=https://airaware-ai.vercel.app
   ```
4. Click **Save Changes**. Render will automatically redeploy the backend with the new allowed origin.

---

### Step 5: Troubleshooting Common Deployment Issues
- **Render Free Tier Spin-Down**: On Render's free tier, backend instances sleep after 15 minutes of inactivity. The first incoming request may take 30–50 seconds to wake up the server. The client automatically has a 15-second timeout and retry logic.
- **CORS Error (`Access-Control-Allow-Origin`)**: Ensure `CORS_ORIGIN` in Render matches your exact Vercel URL without a trailing slash (`https://your-app.vercel.app`, not `https://your-app.vercel.app/`).
- **MongoDB Connection Timed Out**: In MongoDB Atlas, verify that **Network Access** has IP `0.0.0.0/0` enabled and the database user has Read and Write permissions.
- **Double `/api/api` in Requests**: In Vercel, ensure `NEXT_PUBLIC_API_URL` is set to `https://your-backend.onrender.com` without `/api` or trailing slashes. Next.js internal rewrites automatically map `/api/*` to the backend.

---

### Step 6: Automatic GitHub CI/CD Deployments
- Pushes to your tracked feature branch or `main` automatically run the GitHub Actions CI pipeline (`.github/workflows/ci.yml`), executing all 88 automated backend tests and Next.js production builds.
- Render and Vercel automatically trigger zero-downtime redeployments whenever code is pushed to your production branch.

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
