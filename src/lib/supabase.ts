import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
// Set these in your .env.local file:
// NEXT_PUBLIC_SUPABASE_URL=your-project-url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return (
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key'
  );
}

// Dispute types
export interface Dispute {
  id: string;
  case_code: string;
  partner_a_name: string | null;
  partner_b_name: string | null;
  category: string;
  status: 'pending' | 'submitted' | 'complete';
  winner: 'partner_a' | 'partner_b' | 'draw' | null;
  reasoning: string | null;
  created_at: string;
  updated_at: string;
}

export interface Response {
  id: string;
  dispute_id: string;
  partner: 'partner_a' | 'partner_b';
  content: string;
  intensity: number;
  round_number: number;
  evidence: string | null;
  created_at: string;
}

// Database operations
export async function createDispute(caseCode: string, category: string): Promise<Dispute | null> {
  const { data, error } = await supabase
    .from('disputes')
    .insert({
      case_code: caseCode,
      category,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating dispute:', error);
    return null;
  }
  return data;
}

export async function getDisputeByCode(caseCode: string): Promise<Dispute | null> {
  const { data, error } = await supabase
    .from('disputes')
    .select('*, responses(*)')
    .eq('case_code', caseCode)
    .single();

  if (error) {
    console.error('Error fetching dispute:', error);
    return null;
  }
  return data;
}

export async function submitResponse(
  disputeId: string,
  partner: 'partner_a' | 'partner_b',
  content: string,
  intensity: number,
  roundNumber: number = 1
): Promise<Response | null> {
  const { data, error } = await supabase
    .from('responses')
    .insert({
      dispute_id: disputeId,
      partner,
      content,
      intensity,
      round_number: roundNumber,
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting response:', error);
    return null;
  }
  return data;
}

export async function updateDisputeStatus(
  disputeId: string,
  status: 'submitted' | 'complete',
  winner?: 'partner_a' | 'partner_b' | 'draw',
  reasoning?: string
): Promise<void> {
  const updates: Partial<Dispute> = { status };
  if (winner) updates.winner = winner;
  if (reasoning) updates.reasoning = reasoning;

  const { error } = await supabase
    .from('disputes')
    .update(updates)
    .eq('id', disputeId);

  if (error) {
    console.error('Error updating dispute:', error);
  }
}

export async function getAllDisputes(): Promise<Dispute[]> {
  const { data, error } = await supabase
    .from('disputes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching disputes:', error);
    return [];
  }
  return data || [];
}

export async function getRecentDisputes(limit: number = 10): Promise<Dispute[]> {
  const { data, error } = await supabase
    .from('disputes')
    .select('*')
    .eq('status', 'complete')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent disputes:', error);
    return [];
  }
  return data || [];
}