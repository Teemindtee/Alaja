
-- Create user_verifications table
CREATE TABLE IF NOT EXISTS user_verifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('national_id', 'passport', 'voters_card')),
    document_front_image TEXT NOT NULL,
    document_back_image TEXT,
    selfie_image TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    rejection_reason TEXT,
    reviewed_by TEXT REFERENCES users(id),
    submitted_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add identity verification status to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS identity_verification_status TEXT DEFAULT 'not_verified' CHECK (identity_verification_status IN ('not_verified', 'pending', 'verified', 'rejected'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_verifications_user_id ON user_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verifications_status ON user_verifications(status);
CREATE INDEX IF NOT EXISTS idx_user_verifications_submitted_at ON user_verifications(submitted_at);
CREATE INDEX IF NOT EXISTS idx_users_identity_verification_status ON users(identity_verification_status);

-- Add verification required admin setting
INSERT INTO admin_settings (key, value) 
VALUES ('verification_required', 'false')
ON CONFLICT (key) DO NOTHING;
