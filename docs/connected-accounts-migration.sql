-- Connected Accounts Table
-- This table stores user's connected third-party accounts (Google, Microsoft, etc.)
-- for sending emails and accessing external services

CREATE TABLE IF NOT EXISTS connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(20) NOT NULL CHECK (provider IN ('google', 'microsoft', 'other')),
  account_email VARCHAR(255) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_id VARCHAR(255) NOT NULL, -- Provider's unique identifier for the account
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  scopes TEXT[] NOT NULL DEFAULT '{}', -- Array of granted permissions/scopes
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, provider, account_id), -- One account per user per provider
  CONSTRAINT valid_email CHECK (account_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_connected_accounts_user_id ON connected_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_provider ON connected_accounts(provider);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_is_active ON connected_accounts(is_active);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_is_default ON connected_accounts(is_default);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_user_provider ON connected_accounts(user_id, provider);

-- RLS (Row Level Security) policies
ALTER TABLE connected_accounts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own connected accounts
CREATE POLICY "Users can view their own connected accounts" 
ON connected_accounts FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only insert their own connected accounts
CREATE POLICY "Users can insert their own connected accounts" 
ON connected_accounts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own connected accounts
CREATE POLICY "Users can update their own connected accounts" 
ON connected_accounts FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can only delete their own connected accounts
CREATE POLICY "Users can delete their own connected accounts" 
ON connected_accounts FOR DELETE 
USING (auth.uid() = user_id);

-- Function to ensure only one default account per provider per user
CREATE OR REPLACE FUNCTION ensure_single_default_account()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting this account as default, unset all other defaults for this provider
  IF NEW.is_default = TRUE THEN
    UPDATE connected_accounts 
    SET is_default = FALSE, updated_at = NOW()
    WHERE user_id = NEW.user_id 
      AND provider = NEW.provider 
      AND id != COALESCE(NEW.id, gen_random_uuid());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain single default account per provider
CREATE TRIGGER trigger_ensure_single_default_account
  BEFORE INSERT OR UPDATE ON connected_accounts
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_account();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_connected_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_connected_accounts_updated_at
  BEFORE UPDATE ON connected_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_connected_accounts_updated_at();