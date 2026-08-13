# 🏛️ HackFushion Prototype — Implementation Plan

## Goal
Build a complete, polished, end-to-end working prototype for the AI-Powered Citizen Grievance Intelligence Platform.

The single demo flow:
**Citizen submits → AI understands → Incident detected → Priority scored → Officer resolves → Citizen verifies → Reopen if unresolved**

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Fast dev, type-safe, hackathon standard |
| Styling | Tailwind CSS 3 | Rapid professional UI |
| Charts | Recharts | Priority score visualization |
| State | Zustand | Simple, no boilerplate |
| Data Fetching | Axios + React Query | Clean async patterns |
| Backend | Node.js + Express + TypeScript | Simple REST API |
| Database | JSON file (demo data) → MongoDB optional | Zero setup for hackathon |
| AI | Mock AI service (no API key needed) | Always works in demo |
| Routing | React Router v6 | Standard |
| Icons | Lucide React | Clean civic-tech look |
| Animations | Framer Motion | WOW moments (AI processing) |

---

## 7 Screens to Build

| # | Screen | Role | Key Feature |
|---|---|---|---|
| 1 | Landing Page | Public | Hero + workflow + 4 role buttons |
| 2 | Citizen Dashboard | Citizen | Submit form + previous complaints |
| 3 | AI Analysis | Citizen | Step-by-step AI processing animation |
| 4 | Incident View | Citizen | 47 complaints → 1 incident card |
| 5 | Priority + Routing | Citizen | Scored breakdown + department recommendation |
| 6 | Officer Dashboard | Officer | Incident list + accept + resolve |
| 7 | Citizen Verification | Citizen | YES close / NO reopen |

---

## Folder Structure

```
HackFushion/
│
├── client/                         ← React frontend (Vite + TS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 ← Button, Badge, Card, Timeline, Spinner
│   │   │   ├── layout/             ← Navbar, Sidebar, Layout wrappers
│   │   │   └── shared/             ← StatusBadge, PriorityBadge, AIStep
│   │   │
│   │   ├── features/
│   │   │   ├── landing/            ← LandingPage.tsx
│   │   │   ├── citizen/            ← CitizenDashboard, ComplaintForm
│   │   │   ├── ai-analysis/        ← AIAnalysisPage (the WOW screen)
│   │   │   ├── incident/           ← IncidentView, IncidentCard
│   │   │   ├── priority/           ← PriorityScore, DepartmentRoute
│   │   │   ├── officer/            ← OfficerDashboard, IncidentDetail
│   │   │   └── verification/       ← CitizenVerification (YES/NO)
│   │   │
│   │   ├── store/                  ← Zustand stores
│   │   │   ├── complaint.store.ts
│   │   │   ├── incident.store.ts
│   │   │   └── demo.store.ts       ← Killer demo state machine
│   │   │
│   │   ├── services/               ← API calls
│   │   │   ├── complaint.service.ts
│   │   │   ├── incident.service.ts
│   │   │   └── ai.service.ts
│   │   │
│   │   ├── types/                  ← TypeScript interfaces
│   │   └── utils/                  ← formatters, helpers
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── server/                         ← Node.js + Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── complaints.ts
│   │   │   ├── incidents.ts
│   │   │   ├── ai.ts
│   │   │   └── dashboard.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── complaint.controller.ts
│   │   │   ├── incident.controller.ts
│   │   │   └── ai.controller.ts
│   │   │
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   ├── orchestrator.ts      ← Master AI orchestrator
│   │   │   │   ├── languageDetector.ts
│   │   │   │   ├── complaintAnalyzer.ts
│   │   │   │   ├── duplicateDetector.ts
│   │   │   │   ├── incidentDetector.ts
│   │   │   │   └── priorityEngine.ts
│   │   │   ├── complaint.service.ts
│   │   │   └── incident.service.ts
│   │   │
│   │   ├── models/                 ← TypeScript interfaces / Mongoose schemas
│   │   ├── data/                   ← Demo JSON data
│   │   │   └── demoComplaints.json
│   │   └── app.ts
│   │
│   └── package.json
│
└── README.md
```

---

## Backend API Endpoints (MVP Only)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/complaints` | Submit complaint → triggers AI analysis |
| `GET` | `/api/complaints` | List all complaints |
| `GET` | `/api/complaints/:id` | Get complaint + timeline |
| `GET` | `/api/incidents` | List all incidents |
| `GET` | `/api/incidents/:id` | Get incident detail |
| `POST` | `/api/incidents/:id/accept` | Officer accepts incident |
| `POST` | `/api/incidents/:id/resolve` | Officer marks resolved |
| `POST` | `/api/incidents/:id/verify` | Citizen confirms YES or NO |
| `GET` | `/api/dashboard/citizen/:id` | Citizen stats |
| `GET` | `/api/dashboard/officer` | Officer stats |
| `POST` | `/api/ai/analyze` | Run AI orchestrator on text |

---

## Mock AI Service — Modules

```
AI Orchestrator
│
├── Language Detector     → Tanglish / Tamil / English
├── Complaint Analyzer    → Category, Severity, Time, Issue
├── Category Classifier   → Water / Road / Garbage / etc.
├── Duplicate Detector    → Same citizen + same content check
├── Incident Detector     → Semantic + ward-based clustering
├── Priority Engine       → Weighted score 0-100
└── Department Router     → Map category → department
```

All mock — no API key needed. Works offline.

---

## Demo Data

Pre-seeded complaints that form INC-1042 (Water Supply, Ward 12, 47 complaints):

```json
[
  { "id": "CMP001", "text": "Enga street la water varala", "ward": "Ward 12", "language": "tanglish" },
  { "id": "CMP002", "text": "No water supply for 2 days", "ward": "Ward 12", "language": "english" },
  { "id": "CMP003", "text": "Water problem in our area since morning", "ward": "Ward 12", "language": "english" },
  ...47 total
]
```

---

## Build Order (Step-by-Step)

- `[ ]` **Step 1** — Initialize Vite + React + TS + Tailwind frontend
- `[ ]` **Step 2** — Initialize Express + TS backend
- `[ ]` **Step 3** — Create demo data JSON (47 complaints)
- `[ ]` **Step 4** — Build Mock AI Orchestrator (backend service)
- `[ ]` **Step 5** — Build backend API routes
- `[ ]` **Step 6** — Build shared UI components (Button, Badge, Card, Timeline, StatusBadge)
- `[ ]` **Step 7** — Build Landing Page
- `[ ]` **Step 8** — Build Citizen Dashboard + Complaint Form
- `[ ]` **Step 9** — Build AI Analysis Page (animated step-by-step)
- `[ ]` **Step 10** — Build Incident View (47 → 1 incident)
- `[ ]` **Step 11** — Build Priority + Department Routing screen
- `[ ]` **Step 12** — Build Officer Dashboard
- `[ ]` **Step 13** — Build Citizen Verification screen (YES / NO)
- `[ ]` **Step 14** — Connect frontend to backend
- `[ ]` **Step 15** — Wire up Zustand stores
- `[ ]` **Step 16** — Add demo "Killer Demo" auto-play button
- `[ ]` **Step 17** — Polish UI, test all flows, final review

---

## Open Questions

> [!IMPORTANT]
> **Q1 — Do you want role-based login (separate citizen / officer accounts)?**
> Or should we use a simpler "switch role" toggle for the hackathon demo?
> Role-based login is more realistic but costs ~2 hours of build time.

> [!IMPORTANT]
> **Q2 — Should the AI analysis be animated step-by-step (1 second per step) or instant?**
> Animated processing (like a live terminal output) creates a much better WOW moment for judges.

> [!NOTE]
> **Q3 — Backend or frontend-only?**
> We can build this as a pure frontend prototype with mocked API calls (faster, ~4 hours) OR with a real Express backend (more impressive, ~8 hours). Which do you prefer?

---

## Verification Plan

1. Complete end-to-end flow works: Submit → AI → Incident → Officer → Verify → Reopen
2. All 7 screens render without errors
3. AI mock returns realistic structured data
4. Priority score displays correctly (0-100 with breakdown)
5. Officer "Mark Resolved" triggers citizen verification screen
6. Citizen "Still Unresolved" triggers incident reopen + priority boost
7. Responsive on 1280px+ screens
