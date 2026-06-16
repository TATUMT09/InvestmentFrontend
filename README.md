# Yer Momo Tizim — Infrastructure Issue Management System

A modern, role-based web application for reporting, tracking, and managing infrastructure problems (electricity, roads, gas, water, pipelines) across regions of Uzbekistan.

Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **Leaflet.js**.

---

## Features

- **Multi-role access control** — Superadmin, Admin, Organization, and User roles with dedicated dashboards
- **Issue (Momo) management** — Submit, track, and resolve infrastructure problems with photo attachments and GPS location
- **Interactive map** — Leaflet-powered map showing issues and investment objects across Tashkent districts
- **Status workflow** — Full lifecycle tracking: `yuborildi → korib_chiqilmoqda → bajarilmoqda → bajarildi`
- **AI analysis** — AI-powered problem analysis and reporting
- **Statistics & reports** — Daily, weekly, and monthly reporting per organization
- **Responsive UI** — Works on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| State | Zustand 4.5 |
| HTTP | Axios 1.6 |
| Maps | Leaflet 1.9 + React-Leaflet 4.2 |
| Runtime | Node.js 20+ |

---

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/yer-momo-tizim.git
cd yer-momo-tizim

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME="Yer Momo Tizim"
```

> Never commit `.env.local` or any `.env.*` files — they are already excluded in `.gitignore`.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login / auth pages
│   └── (dashboard)/        # Protected role-based dashboards
│       ├── admin/
│       ├── superadmin/
│       ├── tashkilot/
│       └── user/
├── components/
│   ├── dashboard/          # Stats cards, recent issues
│   ├── layout/             # Header, Sidebar, RoleGuard
│   ├── map/                # Leaflet map components
│   ├── momo/               # Issue cards, filters, status stepper
│   ├── hisobot/            # Report components
│   └── shared/             # Modal, Spinner, ImageUploader, etc.
├── hooks/                  # Custom React hooks
├── store/                  # Zustand stores (auth, momo, ui, notifications)
├── lib/                    # API client, constants, utilities
├── types/                  # TypeScript type definitions
└── data/                   # Mock / seed data
```

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## User Roles

| Role | Access |
|---|---|
| `superadmin` | Full system control — admins, organizations, all reports |
| `admin` | Regional management — users, organizations, scheduling, reports |
| `tashkilot` | Organization view — assigned issues, statistics |
| `user` | Submit issues, track own submissions, view map |

---

## Issue Categories (`MomoTuri`)

`elektr` · `quvur` · `yol` · `gaz` · `suv` · `boshqa`

---

## License

This project is private. All rights reserved.

---

## Author

**Asadbek** — [GitHub](https://github.com/<your-username>)
