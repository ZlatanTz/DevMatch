# DevMatch

_A modern job board for the IT sector with role-based workflows for **Candidates**, **Employers**, and an **Admin** back office._

DevMatch lets **employers** publish jobs and manage applicants, while **candidates** build profiles and apply. A dedicated **admin dashboard** enables user and jobs governance. One of the flagship features is **Recommended Jobs**: candidates get tailored job suggestions based on their skills and profile data.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Architecture & Conventions](#architecture--conventions)
- [Getting Started](#getting-started)
  - [Backend (FastAPI)](#backend-fastapi)
  - [Frontend (React + Vite)](#frontend-react--vite)
- [Environment Variables](#environment-variables)
- [User Roles & Permissions](#user-roles--permissions)
- [Authors](#authors)
- [Project Context](#project-context)

---

## Features

- **Authentication & Authorization**
  - JWT-based auth, protected routes, role guards on both backend and frontend.
- **Employers**
  - Create and manage job postings.
  - Review and manage incoming applications.
- **Candidates**
  - Create/edit profile (skills, experience, resume).
  - Apply to jobs, track application status.
  - **Recommended Jobs** based on candidate skills and profile (key feature).
- **Admin Dashboard**
  - Manage users (suspend/unsuspend, etc.).
  - Oversee posted jobs and platform activity.
- **Modern Routing & Data Flows**
  - React Router (Data APIs: loaders/actions, nested routes).
  - Server interactions via a centralized Axios instance with interceptors.
  - Response handling via `ServerResponseWrapper` and/or loader/action flows.
- **Robust Backend**
  - FastAPI routes call service layer functions.
  - Input/output validated with Pydantic schemas.
  - SQLAlchemy ORM + Alembic migrations for PostgreSQL.

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router (Data Router: nested routes, loaders, actions)
- Tailwind CSS
- Context API (auth/user state)
- react-hook-form

**Backend**
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Pydantic

---

## Monorepo Structure
<pre>
DevMatch/
├─ server/ # FastAPI backend
│ ├─ app/
│ │ ├─ api/ # Routers (route handlers)
│ │ ├─ services/ # Business logic + DB access via SQLAlchemy
│ │ ├─ schemas/ # Pydantic models (request/response)
│ │ ├─ models/ # SQLAlchemy models
│ │ └─ main.py # FastAPI app entry
│ ├─ alembic/ # Alembic migrations
│ ├─ requirements.txt
│ └─ .env # Backend env (not committed)
│
└─ client/ # React frontend (Vite)
├─ src/
│ ├─ api/
│ │ ├─ axios.js # Central Axios instance (headers, interceptors)
│ │ ├─ services/ # Service modules calling API endpoints
│ │ └─ transformers/ # Data mappers (request/response transforms)
│ ├─ components/
│ ├─ routes/ # Pages & nested routes
│ ├─ context/ # Auth/Global state (Context API)
│ ├─ Router.jsx # Data Router (loaders/actions)
│ └─ utils/ # Helpers (e.g., ServerResponseWrapper)
├─ index.html
├─ package.json
└─ .env # Frontend env (not committed)
</pre>


---

## Architecture & Conventions

### Backend
- **Routes** (FastAPI routers) are thin: validate input, delegate to services, return validated responses.
- **Services** contain business logic and DB queries via SQLAlchemy sessions.
- **Schemas** (Pydantic) strictly define request/response contracts.
- **Migrations** are managed with Alembic; DB is PostgreSQL.

### Frontend
- **API layer**: a single Axios instance preconfigured with base URL, JSON headers, and auth interceptors.
- **Services**: per-domain modules (e.g., `users`, `jobs`) use the Axios instance.
- **Transformers**: map server payloads to UI-friendly shapes and vice versa.
- **Routing**: React Router Data APIs (nested routes, loaders, actions) for declarative data fetching and mutations.
- **UX**: `ServerResponseWrapper` centralizes loading/error/success handling patterns.

---

## Getting Started

### Prerequisites
- **Node.js** (LTS recommended)
- **Python 3.11+** (recommended)
- **PostgreSQL 14+** (or compatible local instance)

> Make sure PostgreSQL is running and you have a database created for DevMatch.

---

### Backend (FastAPI)

1. **Navigate to backend**
   ```bash
   cd server

2. **(Recommended) Create virtual environment**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt

4. **Create .env in server/**
   ```env
   DATABASE_URL=postgresql+asyncpg://db_username:password@localhost:5432/database_name
   JWT_SECRET=some_string_here
   JWT_EXPIRE_MINUTES=180

5. **Run migrations**
     # Ensure alembic.ini is configured to point at DATABASE_URL, then:
   ```bash
   alembic upgrade head
  This will create/update all tables to the latest schema.

6. **Start the server**
   ```bash
   uvicorn app.main:app --reload
 - API docs (Swagger): http://127.0.0.1:8000/docs
 - ReDoc: http://127.0.0.1:8000/redoc

---
### Frontend (React + Vite)

1. **Open a new terminal and navigate to client**
   ```bash
   cd client

2. **Create .env in client/**
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   VITE_CLOUDINARY_CLOUD_NAME=dp5exacds
   VITE_CLOUDINARY_UPLOAD_PRESET=devmatch_preset

3. **Install and run**
   ```bash
   npm install
   npm run dev

---

### Environment Variables

#### Backend (server/.env)
    ```bash
    DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/database_name
    JWT_SECRET=some_string_here
    JWT_EXPIRE_MINUTES=180

#### Frontend (client/.env)
    ```bash
    VITE_API_BASE_URL=http://127.0.0.1:8000
    VITE_CLOUDINARY_CLOUD_NAME=dp5exacds
    VITE_CLOUDINARY_UPLOAD_PRESET=devmatch_preset
  > Values above are examples for local development. Do not commit real secrets.

---

### User Roles & Permissions
- **Candidate**
  - Create/edit profile, upload resume, manage skills and preferences.
  - Apply to jobs.
  - See Recommended Jobs based on profile and skills.
- **Employer**
  - Create/manage job postings.
  - Apply to jobs.
  - Review candidate applications.
- **Admin**
  - Access Admin Dashboard.
  - Manage users (suspend/unsuspend).
  - Oversee and moderate job postings.
    
> Frontend guards prevent non-admins from accessing /admin. Backend enforces permissions on protected endpoints.

---

### Authors
- Eris Šutković
- Zlatan Tuzović
- Luka Vučinić
- Đorđe Marojević

---

### Project Context

This project was built as part of a one-month Advanced Intensive Web Application Development Training, held September 1 – September 29, 2025. at Developers Lab (powered by Coinis ltd)

