# TechSaathi (ٹیک ساتھی) — Digital Skills Made Simple

> **Interactive digital literacy simulation platform designed specifically for older Pakistani adults to safely learn, practice, and master everyday smartphone tasks without fear of financial loss, missteps, or data compromise.**

---

## 👥 Team Members & Responsibilities

Four engineers developed TechSaathi cooperatively in parallel feature branches, seamlessly unified on `mergedweb`:

| Team Member | Module / Responsibility | Core Contribution |
| :--- | :--- | :--- |
| **Ahmed** | **Payment Simulation (`send-money`)** | Wallet-to-wallet & bank transfers, non-blocking pulsing ripple guidance (`#087F72`), bank-account consistency engine, deliberate review interactions, and action-based progress calculations. |
| **Daniyal** | **Ride-Booking Simulation (`book-ride`)** | Karachi interactive Leaflet map route picker, pickup/drop-off geocoding, dynamic fare estimation (Car/Rickshaw), and driver plate verification. |
| **Areeba** | **PakID Proof-of-Life Simulation (`proof-of-life`)** | NADRA biometric pension attestation guide, camera orientation tutorial, free certificate policy orientation, and interactive identity questionnaire. |
| **Basim** | **Audio & Video Calling Simulation (`video-call`)** | High-fidelity WhatsApp-style interface, Web Audio API ringtone/call sound synthesizer, camera flip, mic mute, and safe call hang-up mechanics. |

---

## 🎯 Target User & The Problem

### Target User
Older adults (55+ years old) in Pakistan who are transitioning to smartphones, pensioners verifying identity for life pensions, and digital novices who rely on family members for basic mobile tasks.

### The Problem
1. **Fear of Irreversible Financial Mistakes**: Anxious that typing an extra zero or tapping the wrong bank button will drain their life savings.
2. **Cognitive & Visual Clutter**: Modern fintech and utility apps are filled with complex navigation, ads, promotional popups, and small fonts.
3. **Language Barriers**: Most technical tutorials are in rapid English, lacking clear Urdu Nastaliq support and intuitive cultural context.
4. **Bureaucratic Anxiety**: Annual pension proof-of-life biometric verification is intimidating; many travel hours to physical NADRA centers simply out of fear of making a smartphone error.
5. **Over-Instruction Paradox**: Traditional tutorials either overwhelm users with lengthy text manuals or blindly tell them "tap here" without teaching them *how* to recognize and verify critical details themselves.

---

## 💡 Solution & Core Philosophy

**Philosophy**: *Teach the learner to recognize, understand, and safely complete digital tasks rather than simply telling them which buttons to press.*

### Key Architectural Pillars
- **Zero-Risk Sandbox**: High-fidelity simulated apps (Practice Wallet, Careem/Indrive-style Ride Booking, PakID, WhatsApp-style Calling) operating with pretend data. No real money, actual rides, or government credentials are ever touched.
- **Dual Learning Modes**:
  - **Guide Me Mode**: Employs non-blocking pulsing teal ripple indicators (`#087F72`), directional indicators, and rich educational cards explaining *why* each step matters, verification checklists, and common mistakes to avoid.
  - **Let Me Try Mode**: Complete unguided independence. Targets are hidden by default; learners can request contextual hints, and mistakes trigger constructive safety guidance without penalization.
- **Action-Based Progress Accuracy**: Progress percentages reflect verified completed actions, keeping users informed (e.g. 83% on review screen, reaching 100% only upon confirmation).
- **Accessible Bilingual Support**: Full English and Urdu Nastaliq layout switching with proper RTL handling, generous tap targets (minimum 48–56px), and high-contrast typography.

---

## 🚀 Core Features

### 1. Payment Simulator (`send-money`)
- **Transfer Methods**: Wallet to Wallet (Easypaisa/JazzCash pattern) and Bank Transfer.
- **Searchable Banks**: Instant search filter across Pakistani banks (Meezan Bank, HBL, UBL, Bank Alfalah).
- **Bank-Recipient Consistency Engine**: Detects when an entered account belongs to a different bank (e.g., entering a Meezan account while HBL is selected), displaying an explicit mismatch explanation and a one-tap "Switch Bank" resolution.
- **1Link Title Fetch Simulation**: Displays realistic verified account titles (e.g., Fatima Bibi, Tariq Mehmood) to instill the habit of verifying names before confirming.
- **Deliberate Review Checkbox**: Requires the learner to tick *"I checked the recipient name, bank, and amount"* before confirming payment.
- **Educational Error Handling**: Contextual balance feedback explaining both entered amounts and task requirements.

### 2. Ride-Booking Simulator (`book-ride`)
- **Interactive Route Entry**: Searchable Karachi practice pickup and drop-off destinations (Gulshan-e-Iqbal, Saddar Hospital, Tariq Road Market, Clifton Masjid).
- **Interactive Leaflet Map**: Interactive draggable map picker with dynamic route polyline rendering.
- **Fare Breakdown**: Transparent fare estimation comparing Car and Rickshaw options.
- **Safety Trip Verification**: Teaches riders to verify the driver's license plate (`KHI-4821`) before entering the vehicle.

### 3. PakID Proof-of-Life Simulation (`proof-of-life`)
- **Pensioner Biometric Attestation**: Guided walk-through explaining that pension verification is 100% free under government rules.
- **Camera & Lighting Orientation**: Visual picture tutorial showing optimal lighting, neutral expression, and steady camera distance.
- **NADRA Emblem & POLC Watermark**: Authentic visual styling to build familiarity with official government interfaces.

### 4. Audio & Video Calling Simulator (`video-call`)
- **WhatsApp-Style Interface**: Authentic calling screen featuring clean Pakistani contact entries.
- **Synthesized Audio Effects**: Uses the Web Audio API to generate realistic telephone dialing tones, ringing cadences, and tap feedbacks.
- **In-Call Controls**: Practice muting the microphone, turning video on/off, flipping cameras, and cleanly ending calls.

### 5. Learning Progress & Cloud Sync
- **Client-First Offline Resilience**: All visited modules, steps completed, mistakes, and hints are instantly saved in `localStorage`.
- **Non-Blocking Supabase Persistence**: Automatically syncs guest learner progress to Supabase `module_progress` and `lesson_attempts` tables without interrupting offline usage.

---

## 🛠️ Technology Stack & Dependencies

### Frontend Framework
- **React 19** (`react`, `react-dom`): Modern React component architecture.
- **TypeScript**: Strict type-checking with zero build errors.
- **TanStack Start & TanStack React Router** (`@tanstack/react-router`, `@tanstack/react-start`): Full-stack type-safe routing, SSR rendering, and layouts.
- **TanStack React Query** (`@tanstack/react-query`): Asynchronous data caching and state hydration.

### Styling & Design System
- **Tailwind CSS v4** (`@tailwindcss/vite`, `tailwindcss`): Utility-first styling with tailored design tokens.
- **Vanilla CSS Tokens** (`src/styles.css`): Custom ripple keyframes, target glow animations, card surfaces, and phone frame shells.
- **Lucide React** (`lucide-react`): Consistent, accessible iconography.

### Mapping & Media
- **Leaflet & OpenStreetMap**: Lightweight client-side route maps.
- **Web Audio API**: Browser-native synthesized telephone frequencies and ring tones.

### Backend & Persistence
- **Supabase** (`@supabase/supabase-js`):
  - Anonymous Guest Authentication (`signInAnonymously`) to prevent onboarding friction.
  - PostgreSQL database tables (`module_progress`, `lesson_attempts`) protected by Row Level Security (RLS) and check constraints.

### Build Tooling & Testing
- **Vite 8** / **Rolldown** & **Nitro**: High-speed module bundling and SSR compilation.
- **Vitest** (`vitest`): Automated unit and integration test runner.

---

## 💻 Setup & Run Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18.18+ or v20+
- `npm` v10+

### 1. Clone the Repository
```bash
git clone https://github.com/ahmedlogics/TechSaathi.git
cd TechSaathi
git checkout mergedweb
```

### 2. Environment Configuration
Create a `.env` or `.env.local` file in the project root:
```env
VITE_SUPABASE_URL=https://buzfopmfnuluemxbsvxj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1emZvcG1mbnVsdWVteGJzdnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAsImV4cCI6MjAwMH0.placeholder
```
*(Note: If environment keys are omitted, the application automatically falls back to local storage and continues functioning seamlessly).*

### 3. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:8080/`

### 5. Run Test Suite
```bash
npm test
```
Executes all 19 automated unit and integration tests across all modules.

### 6. Run TypeScript Typecheck
```bash
npx tsc --noEmit
```

### 7. Production Build
```bash
npm run build
```

---

## 🤖 AI Tools & Third-Party Credits

- **Google Antigravity IDE**: Deep architectural pair-programming, prompt engineering, agentic subagent browser testing, conflict resolution, and TypeScript refinement using Gemini Advanced Agentic Coding.
- **Lovable.dev**: Initial foundational layout and page scaffolding.
- **Lucide Icons**: Clean, scalable open-source iconography.
- **OpenStreetMap & Leaflet**: Free, open geographic map tiles and geospatial visualizer.
- **Google Fonts**:
  - *Inter* & *Plus Jakarta Sans* for Latin typography.
  - *Noto Nastaliq Urdu* & *Noto Sans Arabic* for authentic Urdu rendering.

---

## ⚠️ Known Limitations & Mocked Features

1. **Simulated Financial Transactions**:
   - Money transfers operate on a fictional practice balance (`Rs. 25,000`). No actual 1Link interbank switch, Raast API, or banking credentials are utilized.
2. **Curated Fictional Beneficiaries**:
   - Recipient lookup uses curated practice Pakistani profiles (Meezan, HBL, UBL). Entering unlisted accounts displays educational validation feedback explaining that the account is not recognized in practice records.
3. **Simulated Ride Dispatch**:
   - Ride matching, driver car arrival, and GPS tracking are pedagogical state transitions demonstrating safe verification patterns rather than querying commercial ride-hailing dispatch systems.
4. **Government Identity Demonstration**:
   - The PakID module is an independent educational training simulator. It does not interface with NADRA's internal biometrics database and cannot issue legal life certificates.

---

## 📌 Final Submitted Commit Identifier

- **Branch**: `mergedweb`
- **Submitted Commit Hash**: `13e636d328ac90c3aacaabfdd5235840e751581c`
- **Short Identifier**: `13e636d`
- **Merge Status**: Fully unified branch containing all four developer modules, official illustration logo branding, tailored card watermarks, and green test passes.
