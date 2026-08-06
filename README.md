# TBC CAR SPA - LINE LIFF Application & Prisma Backend

ระบบแอปพลิเคชันสำหรับลูกค้า TBC CAR SPA เชื่อมต่อ LINE LIFF, Prisma ORM Database, Express.js REST API และ React Clean Code Architecture

## 📁 โครงสร้างโปรเจกต์ (Clean Architecture)

```
linefinal01/
├── package.json               # Root monorepo scripts (Concurrent runner)
├── backend/                    # Node.js + Express + Prisma ORM API
│   ├── prisma/
│   │   ├── schema.prisma      # Prisma Data Models & SQLite/PostgreSQL Database
│   │   └── seed.ts            # Database Seeder (Initial Data)
│   ├── src/
│   │   ├── index.ts           # Express Main API Server
│   │   ├── db/prisma.ts       # Prisma Client Singleton
│   │   └── routes/            # REST API Endpoints (Auth, Bookings, Vehicles, Points, etc.)
│   └── package.json
└── frontend/                   # React + Vite + TailwindCSS + LINE LIFF SDK
    ├── src/
    │   ├── types/             # TypeScript Interfaces & Models
    │   ├── services/          # Backend API Client & LINE LIFF SDK Helper
    │   ├── hooks/             # Custom Hooks (useLiff)
    │   ├── components/        # Reusable UI & Layout Components (LiffShell)
    │   └── screens/           # Categorized Application Views
    │       ├── auth/          # Splash, Welcome, Login, Register, RegSuccess
    │       ├── dashboard/     # HomeDashboard
    │       ├── booking/       # BookingScreen, BookingSuccessScreen
    │       ├── status/        # CarStatusScreen (Live Tracker)
    │       ├── rewards/       # PointSystemScreen, PromotionScreen
    │       └── profile/       # ProfileScreen, VehicleScreen, HistoryScreen, NotificationScreen, Settings
    └── package.json
```

## 🚀 วิธีการรันโปรเจกต์ (Getting Started)

### 1. ติดตั้ง Dependencies ทั้งหมด
```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 2. สร้างและ Seed ข้อมูลลง Prisma Database
```bash
npm run prisma:push
npm run prisma:seed
```

### 3. เริ่มทำงานระบบพร้อมกัน (Frontend + Backend)
```bash
npm run dev
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`

---

## 🔗 LINE LIFF Integration
ตั้งค่า `VITE_LIFF_ID` ในไฟล์ `frontend/.env` หากต้องการเชื่อมต่อกับ LINE Official Account ในสภาพแวดล้อม Production (หากไม่ระบุ ระบบจะรันในโหมด Web Browser Demo อัตโนมัติ)
