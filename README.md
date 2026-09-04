# LIVE-SATELLITE 🛰️🔥
### AI-Based Detection and Classification of Industrial Fires & Persistent Thermal Sources Using NASA FIRMS, OSM & Satellite Data

**LIVE-SATELLITE** is an enterprise-grade full-stack geospatial intelligence platform engineered to detect, classify, visualize, and monitor industrial fires, wildland fires, and persistent thermal sources in near real-time using NASA FIRMS orbital satellite telemetry and OpenStreetMap (OSM) spatial infrastructure data.

---

## 🚀 Key Features

1. **Near Real-Time NASA FIRMS Ingestion**:
   - Ingests VIIRS (375m I-Band) and MODIS (1km) sensor observations from Suomi-NPP, NOAA-20, NOAA-21, Terra, and Aqua satellites.
   - Fallback to calibrated high-fidelity satellite archive when upstream API keys are absent.

2. **OpenStreetMap (OSM) Spatial Correlation**:
   - Spatial proximity buffer matching against heavy industrial facilities (steel plants, petroleum refineries, petrochemical hubs, gas flare nodes, and thermal power stations).

3. **Multi-Factor AI Fire Classifier**:
   - Algorithmic and heuristic classifier synthesizing Fire Radiative Power (MW), Brightness Temperature (Kelvin), day/night passes, temporal persistence, and distance to industrial zones.
   - Categories: `Industrial Fire`, `Forest / Wildland Fire`, `Agricultural Burning`, `Persistent Thermal Source`, `Gas/Oil Facility Hotspot`, `Unknown Thermal Anomaly`.

4. **Persistent Thermal Source Detector**:
   - Automated spatial-temporal clustering algorithm aggregating rolling multi-pass observations.
   - Calculates first-seen date, last-seen date, recurrence frequency, and persistence score (0–100%).

5. **Interactive Geospatial Radar**:
   - Leaflet-powered dark and satellite imagery tile switching.
   - Dynamic pulsing SVG markers coded by alert severity (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
   - OSM industrial infrastructure overlays with buffer boundary rings.
   - Instant geocoding search (city, facility, coordinates `lat,lng`) and "Use My Location" proximity alerts.

6. **Automated Report Generator**:
   - One-click PDF incident report generation and CSV dataset export for disaster management operations.

7. **Security & Authentication**:
   - Bcrypt password hashing, signed JWT in HTTP-only secure cookies, role-based access control (`ADMIN`, `USER`), Next.js route protection middleware.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Leaflet, jsPDF
- **Backend**: Next.js API Routes, Prisma ORM, Jose (JWT), Bcryptjs, PapaParse
- **Database**: SQLite (local) / PostgreSQL (Neon / Supabase production)
- **External Feeds**: NASA FIRMS NRT API, OpenStreetMap Overpass API, Esri World Imagery

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```bash
DATABASE_URL="file:./dev.db" # Or postgresql://... for Supabase / Neon
NASA_FIRMS_API_KEY=""        # Free MAP_KEY from https://firms.modaps.eosdis.nasa.gov/api/map_key
AUTH_SECRET="live-satellite-super-secure-production-jwt-secret-2026-sih"
NEXT_PUBLIC_APP_URL="https://live-satellite.vercel.app"
```

---

## 📦 Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Initialize database and seed demo data**:
   ```bash
   npx prisma generate
   npx prisma db push
   node prisma/seed.js
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the terminal**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials:
- **Admin**: `admin@live-satellite.org` / `admin123`
- **Analyst**: `demo@live-satellite.org` / `user123`

---

## 🌐 Public Deployment (Vercel)

1. Push this repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Under Project Settings, set Environment Variables (`DATABASE_URL`, `AUTH_SECRET`, `NASA_FIRMS_API_KEY`).
4. Set the project domain to `live-satellite.vercel.app` (or closest available `live-satellite-*.vercel.app`).
