/*
# Bus Pass Management System — initial schema

## Overview
Creates the data model for a cloud-based bus pass management system for a
college / transport department. Students register, apply for a bus pass, and
track the status of their application. Admins log in separately and can approve
or reject applications. When an application is approved a bus_pass row is
created (pass_id generated) which the student can view and print.

## New Tables

1. `profiles` — extends auth.users with full_name, college, phone, role ('student'|'admin').
2. `applications` — a student's bus pass application with status (pending/approved/rejected).
3. `bus_passes` — issued pass for an approved application, with human-readable pass_id.

## Security (RLS)
- profiles: authenticated SELECT all; owner INSERT/UPDATE only.
- applications: students read their own; admins read all; students insert own; admins update status.
- bus_passes: students read own; admins read all; inserts only via SECURITY DEFINER RPC.

## SECURITY DEFINER functions
- approve_application(app_id): admin-only; approves app + creates bus_pass with generated pass_id.
- reject_application(app_id, reason): admin-only; sets rejected status with reason.
*/

-- ---------- profiles ----------
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  college text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'student',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_profiles" ON profiles;
CREATE POLICY "select_profiles" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ---------- applications ----------
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  college text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  source text NOT NULL,
  destination text NOT NULL,
  pass_type text NOT NULL DEFAULT 'monthly',
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_applications" ON applications;
CREATE POLICY "select_applications" ON applications FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_own_applications" ON applications;
CREATE POLICY "insert_own_applications" ON applications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_applications" ON applications;
CREATE POLICY "update_applications" ON applications FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "delete_applications" ON applications;
CREATE POLICY "delete_applications" ON applications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ---------- bus_passes ----------
CREATE TABLE IF NOT EXISTS bus_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid UNIQUE NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pass_id text UNIQUE NOT NULL,
  full_name text NOT NULL,
  college text NOT NULL,
  email text NOT NULL,
  source text NOT NULL,
  destination text NOT NULL,
  pass_type text NOT NULL DEFAULT 'monthly',
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'approved',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE bus_passes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_bus_passes" ON bus_passes;
CREATE POLICY "select_bus_passes" ON bus_passes FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ---------- sequence for pass ids ----------
CREATE SEQUENCE IF NOT EXISTS pass_seq START 1;

-- ---------- admin RPCs ----------
CREATE OR REPLACE FUNCTION approve_application(app_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  acting uuid := auth.uid();
  is_admin boolean;
  rec applications%ROWTYPE;
  new_pass_id text;
  new_pass uuid;
BEGIN
  SELECT role INTO is_admin FROM profiles WHERE id = acting;
  IF is_admin IS NULL OR is_admin <> 'admin' THEN
    RAISE EXCEPTION 'Not authorized: admin only';
  END IF;

  SELECT * INTO rec FROM applications WHERE id = app_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found';
  END IF;

  UPDATE applications SET status = 'approved', updated_at = now() WHERE id = app_id;

  new_pass_id := 'BP-' || extract(year FROM now())::text || '-' || lpad(nextval('pass_seq')::text, 4, '0');

  INSERT INTO bus_passes (application_id, user_id, pass_id, full_name, college, email, source, destination, pass_type, start_date, end_date)
  VALUES (rec.id, rec.user_id, new_pass_id, rec.full_name, rec.college, rec.email, rec.source, rec.destination, rec.pass_type, rec.start_date, rec.end_date)
  RETURNING id INTO new_pass;

  RETURN new_pass;
END;
$$;

CREATE OR REPLACE FUNCTION reject_application(app_id uuid, reason text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  acting uuid := auth.uid();
  is_admin boolean;
BEGIN
  SELECT role INTO is_admin FROM profiles WHERE id = acting;
  IF is_admin IS NULL OR is_admin <> 'admin' THEN
    RAISE EXCEPTION 'Not authorized: admin only';
  END IF;

  UPDATE applications SET status = 'rejected', rejection_reason = reason, updated_at = now() WHERE id = app_id;
END;
$$;

GRANT EXECUTE ON FUNCTION approve_application(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_application(uuid, text) TO authenticated;

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_bus_passes_user_id ON bus_passes(user_id);