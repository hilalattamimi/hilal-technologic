-- Create Admin User for Hilal Technologic
-- Password: admin123456 (bcrypt hashed)
-- Jalankan SQL ini di Supabase SQL Editor setelah schema.sql

INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Admin',
  'admin@hilaltechnologic.com',
  '$2b$12$U1JR9ZxaRMyAnaRQeAUYyutQL.yldSh8Y1tT74x4fplsPKGFjUOuu',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
