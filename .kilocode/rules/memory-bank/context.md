# Active Context: Fingerprint Attendance System with Truancy Detection

## Current State

**Project Status**: ✅ Fingerprint Attendance System — Changed from RFID to Fingerprint Sensor + Truancy Detection

A complete digital attendance management system using fingerprint sensor. The system supports teachers, parents, and administrators with role-appropriate access. Includes truancy detection with automatic parent notifications.

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
- [x] **Fingerprint Attendance System** — migrated from RFID:
  - [x] Changed `rfidTag` to `fingerprintId` in Student model
  - [x] Changed `rfidStatus` to `fingerprintStatus` in Student model
  - [x] Changed `rfidTag` to `fingerprintId` in AttendanceRecord model
  - [x] Updated all pages: Dashboard, Teacher, Parent, Student, Cards, Students
  - [x] API: `/api/attendance` (GET/POST/PATCH/PUT) — fingerprint-based
  - [x] API: `/api/cards` — fingerprint management
  - [x] Shared data layer `src/lib/data.ts`
- [x] **Truancy Detection + Parent Notifications**:
  - [x] Added `truancyNotified` field to AttendanceRecord
  - [x] Automatic notification when student marked absent without reason
  - [x] Truancy alert: "TRUANCY ALERT: Your child [name] was marked absent on [date] without a reason"
  - [x] Notifications stored in localStorage and shown in parent portal
  - [x] Parents can submit absence reason to clear truancy status
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
  - [x] Teacher can mark rewards as received with optional notes
  - [x] Reward history tracking with received status
  - [x] Students can claim new reward after 100 more days from last claim
- [x] **Manual Fingerprint Entry**:
  - [x] Students can manually type their ID if fingerprint not recognized
  - [x] Limited to 3 attempts per day (stored in localStorage)
  - [x] Warning displayed after exceeding 3 attempts
  - [x] ID must match logged-in student's ID to record attendance
  - [x] **Parent Notification**: Automatic notification when student uses manual entry

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Admin dashboard + time settings | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/app/login/page.tsx` | Login with ID number input | ✅ Ready |
| `src/app/teacher/page.tsx` | Teacher portal + notes | ✅ Ready |
| `src/app/cards/page.tsx` | Fingerprint manager | ✅ Ready |
| `src/app/parent/page.tsx` | Parent portal + truancy notifications | ✅ Ready |
| `src/app/students/page.tsx` | Student registry | ✅ Ready |
| `src/app/student/page.tsx` | Student dashboard + streak tracking + reward claims + manual entry | ✅ Ready |
| `src/app/api/attendance/route.ts` | Attendance API (GET/POST/PATCH/PUT) + truancy check | ✅ Ready |
| `src/app/api/cards/route.ts` | Fingerprint API | ✅ Ready |
| `src/components/layout/Navbar.tsx` | Navigation bar | ✅ Ready |
| `src/components/AuthGuard.tsx` | Role-based route protection | ✅ Ready |
| `src/lib/auth.tsx` | Auth context + ID-based login | ✅ Ready |
| `src/lib/data.ts` | Mock data store + settings | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## System Features

### Hardware Integration
- Fingerprint sensor at classroom entrance
- Green LED = successful scan
- Red LED = fingerprint inactive or unknown
- Buzzer = confirmation on successful scan
- API endpoint `/api/attendance` (POST) handles scan events
- Query param `?checkTruancy=true` checks for unexcused absences and notifies parents

### Attendance Time Rules
| Scan Time | Status |
|-----------|--------|
| At or before `lateAfter` (07:00) | Present |
| After `lateAfter`, before `absentAfter` (12:30) | Late |
| After `absentAfter` or no scan | Absent |

Admin can adjust both thresholds from the dashboard.

### Truancy Detection
- When student is marked absent without a reason → truancy
- Automatic notification sent to parent: "TRUANCY ALERT: Your child [name] was marked absent on [date] without a reason"
- Parent can submit reason through parent portal to clear truancy
- `truancyNotified` flag tracks if notification sent

### User Roles & Login
Users log in with their **ID number** (e.g. `ADM001`, `TCH001`, `PAR001`) + password.

| Role | ID Format | Access | Pages |
|------|-----------|--------|-------|
| Admin | ADM001 | Full read + write + settings | `/`, `/teacher`, `/cards`, `/students`, `/parent` |
| Teacher | TCH001 | Read + write attendance | `/teacher`, `/cards`, `/students` |
| Parent | PAR001–PAR006 | View + submit absence reasons | `/parent` (own child only) |
| Student | STU001–STU006 | View own attendance streak & claim rewards | `/student` |

### Absence Reason Workflow
1. Student is absent → no fingerprint scan recorded
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
| 2026-03-03 | Added teacher reward management panel - view pending, mark as received, track history |
| 2026-03-03 | Students can claim new reward after 100+ days from last claim streak |
| 2026-03-09 | Added manual RFID entry for forgotten cards - 3 attempts per day limit with warning |
| 2026-03-09 | Added automatic parent notification when student uses manual entry |
| 2026-04-10 | Changed from RFID to fingerprint sensor system |
| 2026-04-10 | Added truancy detection - absent without reason = truancy |
| 2026-04-10 | Added automatic parent notification for truancy |
