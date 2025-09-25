
-- Create FAQ Categories table
CREATE TABLE IF NOT EXISTS faq_categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'HelpCircle',
  color TEXT DEFAULT 'bg-blue-100 text-blue-800',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on name for searching
CREATE INDEX IF NOT EXISTS idx_faq_categories_name ON faq_categories(name);

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_faq_categories_active ON faq_categories(is_active);

-- Create index on sort_order for ordering
CREATE INDEX IF NOT EXISTS idx_faq_categories_sort_order ON faq_categories(sort_order);

-- Insert default FAQ categories (only if table is empty)
INSERT INTO faq_categories (name, description, icon, color, sort_order) 
SELECT * FROM (VALUES
  ('Getting Started', 'Questions about joining and basic usage', 'User', 'bg-blue-100 text-blue-800', 1),
  ('Tokens & Payments', 'FinderTokens, payments, and billing questions', 'CreditCard', 'bg-green-100 text-green-800', 2),
  ('Communication', 'Messaging and client-finder interactions', 'MessageSquare', 'bg-purple-100 text-purple-800', 3),
  ('Work Completion', 'Contract fulfillment and deliverables', 'FileText', 'bg-orange-100 text-orange-800', 4),
  ('Account Management', 'Profile settings and security', 'Shield', 'bg-gray-100 text-gray-800', 5),
  ('Gamification', 'Levels, badges, and rewards system', 'Star', 'bg-indigo-100 text-indigo-800', 6)
) AS v(name, description, icon, color, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM faq_categories LIMIT 1);
