-- Create support departments table
CREATE TABLE IF NOT EXISTS support_departments (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create support agents table
CREATE TABLE IF NOT EXISTS support_agents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) NOT NULL UNIQUE,
    agent_id TEXT NOT NULL UNIQUE, -- Human-readable ID like "AGT001"
    department TEXT NOT NULL, -- 'general', 'technical', 'billing', 'disputes'
    permissions TEXT[] NOT NULL, -- Array of permission strings
    is_active BOOLEAN DEFAULT true,
    max_tickets_per_day INTEGER DEFAULT 20,
    response_time_target INTEGER DEFAULT 24, -- hours
    specializations TEXT[], -- Areas of expertise
    languages TEXT[] DEFAULT ARRAY['en'], -- Languages spoken
    assigned_by TEXT REFERENCES users(id) NOT NULL,
    suspended_at TIMESTAMP,
    suspension_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create support_departments table
CREATE TABLE IF NOT EXISTS support_departments (
    id TEXT PRIMARYKEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT NOT NULL UNIQUE,
    submitter_id TEXT REFERENCES users(id) NOT NULL,
    assigned_to TEXT REFERENCES support_agents(id),
    category TEXT NOT NULL,
    priority TEXT NOT NULL, -- 'low', 'medium', 'high', 'urgent'
    status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[],
    attachments TEXT[],
    internal_notes TEXT,
    resolution TEXT,
    satisfaction_rating INTEGER, -- 1-5 stars
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP
);

-- Create support_ticket_messages table
CREATE TABLE IF NOT EXISTS support_ticket_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id TEXT REFERENCES support_tickets(id) NOT NULL,
    sender_id TEXT REFERENCES users(id) NOT NULL,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false, -- Internal notes vs customer-facing
    attachments TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create contact_settings table if not exists
CREATE TABLE IF NOT EXISTS contact_settings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    support_email TEXT NOT NULL DEFAULT 'findermeisterinnovations@gmail.com',
    support_phone TEXT NOT NULL DEFAULT '+234-7039391065',
    office_address TEXT NOT NULL DEFAULT '18 Back of Road safety office, Moniya, Ibadan',
    business_hours TEXT NOT NULL DEFAULT 'Mon-Fri, 9 AM - 6 PM WAT',
    facebook_url TEXT DEFAULT 'https://facebook.com/findermeister',
    twitter_url TEXT DEFAULT 'https://twitter.com/findermeister',
    instagram_url TEXT DEFAULT 'https://instagram.com/findermeister',
    tiktok_url TEXT DEFAULT 'https://tiktok.com/@findermeisterinnovations',
    linkedin_url TEXT DEFAULT 'https://linkedin.com/company/findermeister',
    whatsapp_number TEXT DEFAULT '+234-7039391065',
    response_time_low TEXT DEFAULT '2-3 business days',
    response_time_medium TEXT DEFAULT '1-2 business days',
    response_time_high TEXT DEFAULT '4-8 hours',
    response_time_urgent TEXT DEFAULT '1-2 hours',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create faq_categories table if not exists
CREATE TABLE IF NOT EXISTS faq_categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'HelpCircle',
    color TEXT DEFAULT 'bg-blue-100 text-blue-800',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_verifications table if not exists
CREATE TABLE IF NOT EXISTS user_verifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) NOT NULL,
    document_type TEXT NOT NULL, -- 'national_id', 'passport', 'drivers_license'
    document_front_image TEXT NOT NULL,
    document_back_image TEXT,
    selfie_image TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    rejection_reason TEXT,
    reviewed_by TEXT REFERENCES users(id),
    submitted_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default support departments
INSERT INTO support_departments (name, description) VALUES 
('general', 'General Support and Inquiries'),
('technical', 'Technical Issues and Platform Support'),
('billing', 'Billing, Payments, and Financial Issues'),
('disputes', 'Disputes, Moderation, and Resolution'),
('verification', 'Account and Identity Verification')
ON CONFLICT (name) DO NOTHING;

-- Insert default contact settings if table is empty
INSERT INTO contact_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM contact_settings);