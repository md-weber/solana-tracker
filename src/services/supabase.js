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
    amount: parseFloat(inv.amount),
    solPrice: parseFloat(inv.sol_price || 0),
    solAmount: parseFloat(inv.sol_amount),
    solStaked: parseFloat(inv.sol_staked),
    stakingFee: parseFloat(inv.staking_fee),
    currentStaked: parseFloat(inv.current_staked),
    unstakedSol: parseFloat(inv.unstaked_sol)
  }));
};

/**
 * Add new investment to Supabase
 */
export const addInvestment = async (investment) => {
  const dbInvestment = {
    date: investment.date,
    amount: investment.amount,
    sol_price: investment.solPrice,
    sol_amount: investment.solAmount,
    sol_staked: investment.solStaked,
    staking_fee: investment.stakingFee,
    current_staked: investment.currentStaked,
    unstaked_sol: investment.unstakedSol
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
  
  // Transform back to app format
  return {
    id: data.id,
    date: data.date,
    amount: parseFloat(data.amount),
    solPrice: parseFloat(data.sol_price || 0),
    solAmount: parseFloat(data.sol_amount),
    solStaked: parseFloat(data.sol_staked),
    stakingFee: parseFloat(data.staking_fee),
    currentStaked: parseFloat(data.current_staked),
    unstakedSol: parseFloat(data.unstaked_sol)
  };
};

/**
 * Update existing investment in Supabase
 */
export const updateInvestment = async (id, investment) => {
  const dbInvestment = {
    date: investment.date,
    amount: investment.amount,
    sol_price: investment.solPrice,
    sol_amount: investment.solAmount,
    sol_staked: investment.solStaked,
    staking_fee: investment.stakingFee,
    current_staked: investment.currentStaked,
    unstaked_sol: investment.unstakedSol,
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
    amount: parseFloat(data.amount),
    solPrice: parseFloat(data.sol_price || 0),
    solAmount: parseFloat(data.sol_amount),
    solStaked: parseFloat(data.sol_staked),
    stakingFee: parseFloat(data.staking_fee),
    currentStaked: parseFloat(data.current_staked),
    unstakedSol: parseFloat(data.unstaked_sol)
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
