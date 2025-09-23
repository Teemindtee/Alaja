
-- Create new admin account
-- Replace the email, password hash, and names as needed

INSERT INTO "users" (
  "id", 
  "email", 
  "password", 
  "first_name", 
  "last_name", 
  "role", 
  "is_verified", 
  "is_banned", 
  "created_at", 
  "phone", 
  "banned_reason", 
  "banned_at"
) VALUES (
  gen_random_uuid(),
  'admin@findermeister.com',
  '$2b$10$PNn1SkqhHrKWfY6mBNhMoO6VqyJZUrZH/ll08W4XI6eefurvphF.y',
  'Admin',
  'User',
  'admin',
  true,
  false,
  now(),
  NULL,
  NULL,
  NULL
);

-- Alternative: Create admin with specific credentials
-- You'll need to hash the password using bcrypt first

-- Example with custom details:
/*
INSERT INTO "users" (
  "id", 
  "email", 
  "password", 
  "first_name", 
  "last_name", 
  "role", 
  "is_verified", 
  "is_banned", 
  "created_at"
) VALUES (
  gen_random_uuid(),
  'superadmin@findermeister.com',
  -- Replace this with actual bcrypt hash of your desired password
  '$2b$12$YOUR_BCRYPT_HASHED_PASSWORD_HERE',
  'Super',
  'Admin',
  'admin',
  true,
  false,
  now()
);
*/

-- To generate a proper bcrypt hash, you can use the create-admin-user.js script
-- or hash your password using bcrypt with a salt rounds of 10-12
