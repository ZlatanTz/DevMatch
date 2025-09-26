-- seed.sql

BEGIN;

-- enable pgcrypto so we can use crypt() to hash passwords in the seed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Start fresh
TRUNCATE TABLE
  applications,
  job_skills,
  candidate_skills,
  jobs,
  employers,
  candidates,
  skills,
  users,
  roles
RESTART IDENTITY CASCADE;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS seniority varchar;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS prefers_remote boolean;
-- ===== Roles =====
INSERT INTO roles (name) VALUES
  ('admin'),
  ('employer'),
  ('candidate');

-- ===== Users =====
-- Note: hashed_password values are placeholders
-- role ids will be 1: admin, 2: employer, 3: candidate
INSERT INTO users (email, hashed_password, is_active, is_suspended, role_id)
VALUES
  ('admin@devmatch.com', crypt('admin', gen_salt('bf', 12)), true,  false, 1),
  ('employer1@example.com', crypt('employer1', gen_salt('bf', 12)), true,  false, 2),
  ('employer2@example.com', crypt('employer2', gen_salt('bf', 12)), true,  false, 2),
  ('cand1@example.com', crypt('cand1', gen_salt('bf', 12)), true,  false, 3),
  ('cand2@example.com', crypt('cand2', gen_salt('bf', 12)), true,  false, 3);

-- ===== Admin (ties to user 1) =====
INSERT INTO admins (user_id) VALUES (1);

-- ===== Employers =====
-- user_id must be unique and present in users
INSERT INTO employers (user_id, company_name, website, about, location, country, tel)
VALUES
  (2, 'Acme Corp', 'https://acme.example.com', 'We build anvils and rockets.', 'Podgorica', 'Montenegro', '+382-20-111111'),
  (3, 'Globex LLC', 'https://globex.example.com', 'Global solutions provider.', 'Belgrade', 'Serbia', '+381-11-222222');

-- ===== Candidates =====
INSERT INTO candidates (
  user_id, first_name, last_name, location, years_exp, bio, resume_url, desired_salary,
  seniority, prefers_remote
)
VALUES
  (4, 'Mila', 'Jovanović', 'Podgorica', 3, 'Backend dev, Python, FastAPI.',
   'https://files.example.com/resumes/mila.pdf', 1800,
   'medior', true),

  (5, 'Luka', 'Marković', 'Novi Sad', 5, 'Full-stack JS, Node and React.',
   'https://files.example.com/resumes/luka.pdf', 2200,
   'senior', false);
-- ===== Skills =====
INSERT INTO skills (name) VALUES
  ('Python'),
  ('FastAPI'),
  ('PostgreSQL'),
  ('Docker'),
  ('JavaScript'),
  ('React'),
  ('Node.js');

-- ===== Jobs =====
-- employer_id must exist, benefits is text[] and created_at has default
INSERT INTO jobs (
  title, location, employment_type, seniority,
  min_salary, max_salary, is_remote, status,
  description, company_description, benefits, employer_id
) VALUES
  ('Backend Engineer', 'Remote', 'full-time', 'medior',
   1500, 2500, true, 'open',
   'APIs in Python, async SQLAlchemy.', 'Engineering culture, code reviews.',
   ARRAY['health','pto']::varchar[], 1),

  ('Full-stack Developer', 'Podgorica', 'contract', 'senior',
   2500, 3500, false, 'open',
   'React front, Node backend, CI/CD.', 'Fast paced, product focused.',
   ARRAY['remote-friendly','equipment']::varchar[], 2),

  ('Data Engineer', 'Belgrade', 'full-time', 'medior',
   1800, 3000, true, 'open',
   'ETL pipelines, Postgres, Docker.', 'Data platform team.',
   ARRAY['health','bonus']::varchar[], 2);

-- ===== Job ↔ Skills (many-to-many) =====
-- Link jobs to skills by ids
-- Job 1: Python, FastAPI, PostgreSQL, Docker
INSERT INTO job_skills (job_id, skill_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4);

-- Job 2: JavaScript, React, Node.js, Docker
INSERT INTO job_skills (job_id, skill_id) VALUES
  (2, 5), (2, 6), (2, 7), (2, 4);

-- Job 3: Python, PostgreSQL, Docker
INSERT INTO job_skills (job_id, skill_id) VALUES
  (3, 1), (3, 3), (3, 4);

-- ===== Candidate ↔ Skills (many-to-many) =====
-- Candidate 1: Python, FastAPI, PostgreSQL
INSERT INTO candidate_skills (candidate_id, skill_id) VALUES
  (1, 1), (1, 2), (1, 3);

-- Candidate 2: JavaScript, React, Node.js
INSERT INTO candidate_skills (candidate_id, skill_id) VALUES
  (2, 5), (2, 6), (2, 7);

-- ===== Applications =====
-- ApplicationStatus is an enum in your DB. Using 'pending' which exists in your code.
INSERT INTO applications (
  candidate_id, job_id,
  first_name, last_name, email, year_of_birth, phone, location,
  years_experience, seniority_level, skills, cv_path, cover_letter, status
) VALUES
  (1, 1,
   'Mila','Jovanović','mila@example.com', 1997, '+382-67-700000', 'Podgorica',
   3, 'medior', ARRAY['Python','FastAPI','PostgreSQL']::varchar[], '/cv/mila.pdf', 'Excited to join the backend team.', 'pending'),

  (2, 2,
   'Luka','Marković','luka@example.com', 1995, '+381-60-800000', 'Novi Sad',
   5, 'senior', ARRAY['JavaScript','React','Node.js']::varchar[], '/cv/luka.pdf', NULL, 'pending');

COMMIT;
