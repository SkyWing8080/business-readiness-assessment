-- Database schema for Business Readiness Assessment leads
-- Run this in Vercel Postgres SQL editor

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  
  -- Contact Information
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  
  -- Assessment Results
  total_score INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  readiness_level VARCHAR(100) NOT NULL,
  
  -- Dimensional Scores
  data_score INTEGER NOT NULL,
  process_score INTEGER NOT NULL,
  team_score INTEGER NOT NULL,
  strategic_score INTEGER NOT NULL,
  change_score INTEGER NOT NULL,
  
  -- Email Sequence Tracking
  email_sequence_step INTEGER DEFAULT 0,
  -- 0 = not started, 1 = Email #1 sent, 2 = Email #2 sent, 3 = Email #3 sent (complete)
  
  last_email_sent_at TIMESTAMP,
  
  -- Status
  unsubscribed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for efficient email sequence queries
CREATE INDEX IF NOT EXISTS idx_email_sequence 
ON leads(email_sequence_step, last_email_sent_at, unsubscribed);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_email ON leads(email);

-- Index for created date queries
CREATE INDEX IF NOT EXISTS idx_created_at ON leads(created_at);
