-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  resume_url TEXT,
  job_id UUID REFERENCES jobs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Roles Table (for Admin management)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'owner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Storage Buckets (Policies need to be set manually or via SQL if possible on this tier)
-- Note: You need to create 'job-images' (public) and 'resumes' (private) buckets in the Storage dashboard.

-- RLS Policies
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public jobs are viewable by everyone" ON jobs;
CREATE POLICY "Public jobs are viewable by everyone" ON jobs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert jobs" ON jobs;
CREATE POLICY "Public can insert jobs" ON jobs FOR INSERT WITH CHECK (true); -- WARNING: For testing. Ideally restricted to authenticated users.

DROP POLICY IF EXISTS "Admins can update jobs" ON jobs;
CREATE POLICY "Admins can update jobs" ON jobs FOR UPDATE USING (auth.role() = 'authenticated');

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view candidates" ON candidates;
CREATE POLICY "Admins can view candidates" ON candidates FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public can insert candidates" ON candidates;
CREATE POLICY "Public can insert candidates" ON candidates FOR INSERT WITH CHECK (true);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view roles" ON user_roles;
CREATE POLICY "Admins can view roles" ON user_roles FOR SELECT USING (auth.role() = 'authenticated');

-- Storage Policies (Run these in the Supabase SQL Editor if needed)
-- Note: Buckets 'job-images' and 'resumes' must exist.

-- Job Images (Public Access)
DROP POLICY IF EXISTS "Job images are public" ON storage.objects;
CREATE POLICY "Job images are public" ON storage.objects FOR SELECT USING (bucket_id = 'job-images');

DROP POLICY IF EXISTS "Public can upload job images" ON storage.objects;
CREATE POLICY "Public can upload job images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'job-images');

-- Resumes (Private Access for Admin, Public Upload)
DROP POLICY IF EXISTS "Public can upload resumes" ON storage.objects;
CREATE POLICY "Public can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Admins can view resumes" ON storage.objects;
CREATE POLICY "Admins can view resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');
