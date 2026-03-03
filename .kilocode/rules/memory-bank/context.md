# Active Context: RFID Digital Attendance System

## Current State

**Project Status**: ✅ RFID Attendance System — Fully Built + Role-Based Auth + Advanced Features

A complete digital attendance management system using RFID technology (RC522 reader). The system supports teachers, parents, and administrators with role-appropriate access.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] **Role-Based Authentication** — login page, AuthProvider, AuthGuard:
  - [x] Login page (`/login`) with ID number input + password (no dropdown)
  - [x] `src/lib/auth.tsx` — AuthContext, mock users with `idNumber` field (ADM001, TCH001, PAR001–PAR006)
  - [x] `src/components/AuthGuard.tsx` — role-based route protection
  - [x] Navbar updated with role-specific links + logout button
  - [x] Each page wrapped with AuthGuard + correct allowed roles
  - [x] Parents locked to their own child's data only
- [x] **RFID Attendance System** — full implementation:
  - [x] Dashboard (`/`) — real-time stats, recent scans, quick access portals
  - [x] Teacher Portal (`/teacher`) — view/filter attendance, edit records, mark absent
  - [x] RFID Card Manager (`/cards`) — activate/deactivate/renew cards
  - [x] Parent Portal (`/parent`) — attendance history, absence reason submission
  - [x] Student Registry (`/students`) — RFID tag ↔ student mapping, register students
  - [x] API: `/api/attendance` (GET/POST/PATCH/PUT)
  - [x] API: `/api/cards` (GET/POST/PATCH)
  - [x] Shared data layer `src/lib/data.ts`
  - [x] Navbar component with active route highlighting
- [x] **Advanced Attendance Features**:
  - [x] Configurable time thresholds: `lateAfter` (default 07:00) and `absentAfter` (default 12:30)
  - [x] Admin dashboard time settings panel — adjust cutoff times in-browser
  - [x] `attendanceSettings` exported from `data.ts`, used by API and dashboard
  - [x] Parent portal: submit absence reason per absent record (editable)
  - [x] Teacher portal: view parent-submitted absence reasons + add/edit teacher notes
  - [x] `absentReason` and `teacherNote` fields added to `AttendanceRecord` type
- [x] **Student Dashboard**:
  - [x] Add `student` role to UserRole type in auth system
  - [x] Add student users (STU001-STU006) with passwords
  - [x] Create student dashboard at `/student` with attendance rate display
  - [x] Filter by period (7 days, 30 days, all time)
  - [x] Show recent attendance records with status
  - [x] Update navbar with student-specific navigation and badge
- [x] **Streak System & Rewards**:
  - [x] Replace attendance rate with streak tracking (consecutive present/late days)
  - [x] Streak resets to 0 when student is absent for a day
  - [x] Add reward claim functionality when streak reaches 100 days
  - [x] Show current streak, longest streak, and progress bar
  - [x] Add encouraging messages based on streak milestones
  - [x] Students must contact teacher to receive reward after claiming

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Admin dashboard + time settings | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/app/login/page.tsx` | Login with ID number input | ✅ Ready |
| `src/app/teacher/page.tsx` | Teacher portal + notes | ✅ Ready |
| `src/app/cards/page.tsx` | RFID card manager | ✅ Ready |
| `src/app/parent/page.tsx` | Parent portal + absence reasons | ✅ Ready |
| `src/app/students/page.tsx` | Student registry | ✅ Ready |
| `src/app/student/page.tsx` | Student dashboard + streak tracking + reward claims | ✅ Ready |
| `src/app/api/attendance/route.ts` | Attendance API (GET/POST/PATCH/PUT) | ✅ Ready |
| `src/app/api/cards/route.ts` | RFID card API | ✅ Ready |
| `src/components/layout/Navbar.tsx` | Navigation bar | ✅ Ready |
| `src/components/AuthGuard.tsx` | Role-based route protection | ✅ Ready |
| `src/lib/auth.tsx` | Auth context + ID-based login | ✅ Ready |
| `src/lib/data.ts` | Mock data store + settings | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## System Features

### Hardware Integration
- RC522 RFID reader at classroom entrance
- Green LED = successful scan
- Red LED = card inactive or unknown
- Buzzer = confirmation on successful scan
- API endpoint `/api/attendance` (POST) handles scan events

### Attendance Time Rules
| Scan Time | Status |
|-----------|--------|
| At or before `lateAfter` (07:00) | Present |
| After `lateAfter`, before `absentAfter` (12:30) | Late |
| After `absentAfter` or no scan | Absent |

Admin can adjust both thresholds from the dashboard.

### User Roles & Login
Users log in with their **ID number** (e.g. `ADM001`, `TCH001`, `PAR001`) + password.

| Role | ID Format | Access | Pages |
|------|-----------|--------|-------|
| Admin | ADM001 | Full read + write + settings | `/`, `/teacher`, `/cards`, `/students`, `/parent` |
| Teacher | TCH001 | Read + write attendance | `/teacher`, `/cards`, `/students` |
| Parent | PAR001–PAR006 | View + submit absence reasons | `/parent` (own child only) |
| Student | STU001–STU006 | View own attendance streak & claim rewards | `/student` |

### Absence Reason Workflow
1. Student is absent → no RFID scan recorded
2. Parent logs in → `/parent` → clicks "Add Reason" on absent record → submits text
3. Teacher logs in → `/teacher` → sees parent reason in blue box under absent record
4. Teacher can add their own note (purple box) visible to both teacher and admin

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-02-25 | Full RFID attendance system built — 5 pages, 2 API routes, shared data layer |
| 2026-02-25 | Role-based auth added — login page, AuthProvider, AuthGuard, role-specific nav |
| 2026-02-25 | ID-based login, configurable time thresholds, absence reasons, teacher notes |
| 2026-03-03 | Added student role and dashboard with attendance rate |
| 2026-03-03 | Added streak system with reward claims - streak resets when absent, claim reward at 100 days |
