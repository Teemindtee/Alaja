
-- Add categories column to finders table
ALTER TABLE finders ADD COLUMN categories TEXT[];

-- Migrate existing category data to categories array
UPDATE finders 
SET categories = ARRAY[category] 
WHERE category IS NOT NULL AND category != '';

-- For finders with no category, set empty array
UPDATE finders 
SET categories = ARRAY[]::TEXT[] 
WHERE category IS NULL OR category = '';
