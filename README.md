# Student Placement Portal

A modern, production-ready web application designed to digitize, streamline, and centralize the entire college campus placement ecosystem. Built with the **MERN** stack (MongoDB, Express.js, React, Node.js) and Tailwind CSS.

---

## Key Features

1. **Role-Based Portals**:
   - 🎓 **Student**: Complete placement profiles, upload PDF resumes, explore active campus drives with live eligibility checks, apply in 1-click, and track hiring stages (`Applied` $\to$ `Under Review` $\to$ `Shortlisted` $\to$ `Interview` $\to$ `Selected`).
   - 🏢 **Corporate Recruiter**: Create drive postings with customizable eligibility thresholds (CGPA, backlogs, branch, 10th/12th %), review candidate profiles and resumes, schedule interviews, and transition hiring statuses.
   - 🏛️ **Placement Cell / Admin**: Executive dashboard with placement percentages, package analytics (highest & average LPA), branch-wise hiring breakdown, company oversight, and 1-click **CSV Report Export** for university records.

2. **Automated Eligibility Engine**:
   - Compares student academic credentials with job requirements in real-time.
   - Evaluates:
     - Minimum CGPA
     - Maximum Active Backlogs
     - Eligible Branches / Disciplines
     - 10th & 12th minimum percentages
   - Visual `✓ Eligible` / `✗ Not Eligible` badges with an interactive breakdown modal.

3. **Resume Management**:
   - Secure PDF/DOCX resume file upload via Multer.
   - Resumes automatically attached to job applications with instant preview and download capabilities.

4. **Zero-Setup Database Architecture**:
   - Backend automatically connects to `MONGODB_URI` if provided (e.g. MongoDB Atlas).
   - If no MongoDB instance is provided or running locally, it gracefully starts an in-memory MongoDB instance (`mongodb-memory-server`) with pre-seeded campus data so you can test it immediately without installing MongoDB!

---

## 🚀 Quick Start Guide

### 1. Pre-requisites
- Node.js (v18+) & npm

### 2. Run the Application

From the root directory:
```bash
# Terminal 1: Run Backend Server
cd server
npm start

# Terminal 2: Run Frontend Client
cd client
npm run dev
```

Open your browser at:
**`http://localhost:5173`**

---

## 🔑 Pre-seeded Demo Accounts (Instant Test)

The login screen includes **1-Click Quick Demo Login** buttons for instant testing:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Placement Admin** | `admin@placement.edu` | `admin123` | Dean of Placements (Full system oversight & CSV export) |
| **Recruiter** | `recruiter@techcorp.com` | `recruiter123` | Google HR (Post jobs & manage applicants) |
| **Student (Eligible)** | `student@placement.edu` | `student123` | Arjun Patel (8.85 CGPA, CSE, 0 backlogs, Resume attached) |
| **Student (Placed)** | `sneha@student.edu` | `student123` | Sneha Nair (9.42 CGPA, Placed at Google for ₹24 LPA) |

---

## 📂 Project Architecture

```
student-placement-portal/
├── server/
│   ├── config/db.js              # Database connection + memory fallback
│   ├── models/                   # Mongoose schemas (User, StudentProfile, Company, Job, Application, Placement)
│   ├── controllers/              # Business logic & eligibility engine
│   ├── routes/                   # REST endpoints (/api/auth, /api/jobs, /api/applications, etc.)
│   ├── middleware/               # JWT authentication & Multer upload
│   ├── seed/seedData.js          # Realistic demo accounts & placement data
│   └── server.js                 # Server entry point
└── client/
    ├── src/
    │   ├── context/AuthContext.jsx # Global JWT session & profile state
    │   ├── components/            # Reusable UI (Navbar, EligibilityBadge, StatusStepper, etc.)
    │   └── pages/
    │       ├── Home.jsx           # Landing page with stats
    │       ├── Login.jsx          # Login with 1-click demo switcher
    │       ├── Register.jsx       # Student & Recruiter onboarding
    │       ├── student/           # Dashboard, Profile, Job Listings, Job Details, Applications
    │       ├── recruiter/         # Dashboard, Post Job, Manage Applicants, Company Profile
    │       └── admin/             # Analytics Dashboard, Students, Companies, Drives, CSV Records
```
