-- Love Court Database Schema for Supabase
-- Run this in your Supabase project's SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS responses CASCADE;
DROP TABLE IF EXISTS disputes CASCADE;

-- Create disputes table
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_code TEXT UNIQUE NOT NULL,
  partner_a_name TEXT,
  partner_b_name TEXT,
  category TEXT NOT NULL CHECK (category IN ('chores', 'money', 'communication', 'time', 'affection', 'other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'complete')),
  winner TEXT CHECK (winner IN ('partner_a', 'partner_b', 'draw')),
  reasoning JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create responses table
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  partner TEXT NOT NULL CHECK (partner IN ('partner_a', 'partner_b')),
  content TEXT NOT NULL,
  intensity INTEGER NOT NULL DEFAULT 3 CHECK (intensity BETWEEN 1 AND 5),
  round_number INTEGER NOT NULL DEFAULT 1,
  evidence TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_disputes_case_code ON disputes(case_code);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_created ON disputes(created_at DESC);
CREATE INDEX idx_responses_dispute ON responses(dispute_id);
CREATE INDEX idx_responses_partner ON responses(partner);

-- Enable Row Level Security (optional - can be configured later)
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allows public read/write for prototype)
CREATE POLICY "Allow public access for disputes" ON disputes
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access for responses" ON responses
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_disputes_updated_at
  BEFORE UPDATE ON disputes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO disputes (case_code, category, status, winner, reasoning) VALUES
  ('DEMO-001', 'chores', 'complete', 'partner_a', '{"text": "Partner A Wins!", "reasoning": "After review, Partner A is correct."}'),
  ('DEMO-002', 'money', 'complete', 'draw', '{"text": "It''s a Draw!", "reasoning": "Both have valid points."}'),
  ('DEMO-003', 'communication', 'pending', NULL, NULL);

-- Grant necessary permissions
GRANT ALL ON disputes TO anon, authenticated;
GRANT ALL ON responses TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;