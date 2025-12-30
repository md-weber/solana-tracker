// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get all investments from Supabase
 */
export const getInvestments = async () => {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) {
    console.error('Error fetching investments:', error);
    throw error;
  }
  
  // Transform data to match our app's format
  return data.map(inv => ({
    id: inv.id,
    date: inv.date,
    amountEUR: parseFloat(inv.amount_eur || inv.amount || 0),
    solReceived: parseFloat(inv.sol_received || inv.sol_amount || 0),
    solStakedNow: parseFloat(inv.sol_staked_now || inv.current_staked || 0),
    solUnstakedNow: parseFloat(inv.sol_unstaked_now || inv.unstaked_sol || 0),
    stakingFee: parseFloat(inv.staking_fee || 0),
    bitvavoFees: parseFloat(inv.bitvavo_fees || 0),
    validator: inv.validator || 'Unknown'
  }));
};

/**
 * Add new investment to Supabase
 */
export const addInvestment = async (investment) => {
  const dbInvestment = {
    amount_eur: investment.amountEUR,
    sol_received: investment.solReceived,
    sol_staked_now: investment.solStakedNow,
    sol_unstaked_now: investment.solUnstakedNow,
    staking_fee: investment.stakingFee,
    bitvavo_fees: investment.bitvavoFees,
    validator: investment.validator,
    date: investment.date
  };

  const { data, error } = await supabase
    .from('investments')
    .insert([dbInvestment])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding investment:', error);
    throw error;
  }
  
  return {
    id: data.id,
    date: data.date,
    amountEUR: parseFloat(data.amount_eur || 0),
    solReceived: parseFloat(data.sol_received || 0),
    solStakedNow: parseFloat(data.sol_staked_now || 0),
    solUnstakedNow: parseFloat(data.sol_unstaked_now || 0),
    stakingFee: parseFloat(data.staking_fee || 0),
    bitvavoFees: parseFloat(data.bitvavo_fees || 0),
    validator: data.validator || 'Unknown'
  };
};

/**
 * Update existing investment in Supabase
 */
export const updateInvestment = async (id, investment) => {
  const dbInvestment = {
    amount_eur: investment.amountEUR,
    sol_received: investment.solReceived,
    sol_staked_now: investment.solStakedNow,
    sol_unstaked_now: investment.solUnstakedNow,
    staking_fee: investment.stakingFee,
    bitvavo_fees: investment.bitvavoFees,
    validator: investment.validator,
    date: investment.date,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('investments')
    .update(dbInvestment)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating investment:', error);
    throw error;
  }
  
  return {
    id: data.id,
    date: data.date,
    amountEUR: parseFloat(data.amount_eur || 0),
    solReceived: parseFloat(data.sol_received || 0),
    solStakedNow: parseFloat(data.sol_staked_now || 0),
    solUnstakedNow: parseFloat(data.sol_unstaked_now || 0),
    stakingFee: parseFloat(data.staking_fee || 0),
    bitvavoFees: parseFloat(data.bitvavo_fees || 0),
    validator: data.validator || 'Unknown'
  };
};

/**
 * Delete investment from Supabase
 */
export const deleteInvestment = async (id) => {
  const { error } = await supabase
    .from('investments')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting investment:', error);
    throw error;
  }
};
