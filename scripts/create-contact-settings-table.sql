
-- Create contact_settings table
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

-- Insert default settings if table is empty
INSERT INTO contact_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM contact_settings);
-- Create contact_settings table if it doesn't exist
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

-- Insert default settings if table is empty
INSERT INTO contact_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM contact_settings);
