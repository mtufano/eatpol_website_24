-- Update program_type ENUM to change country_manager to community_manager
-- This will update the database schema to support the new Community Manager program name

ALTER TABLE testers 
MODIFY COLUMN program_type ENUM('standard', 'community_manager', 'country_manager') DEFAULT 'standard';

-- Update any existing country_manager entries to community_manager
UPDATE testers 
SET program_type = 'community_manager' 
WHERE program_type = 'country_manager';

-- Now we can remove the old country_manager option
ALTER TABLE testers 
MODIFY COLUMN program_type ENUM('standard', 'community_manager') DEFAULT 'standard';