import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get all transactions, ordered by date (newest first)
 * @param {Object} options - Optional filters
 * @param {number} options.limit - Limit number of results
 * @param {string} options.transactionType - Filter by transaction type
 * @returns {Promise<{data: Array, error: Object}>}
 */
export const getTransactions = async (options = {}) => {
  try {
    let query = supabase
      .from("sol_transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    // Apply optional filters
    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.transactionType) {
      query = query.eq("transaction_type", options.transactionType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching transactions:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error in getTransactions:", err);
    return { data: null, error: err };
  }
};

/**
 * Get a single transaction by ID
 * @param {string} id - Transaction UUID
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const getTransactionById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("sol_transactions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching transaction:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error in getTransactionById:", err);
    return { data: null, error: err };
  }
};

/**
 * Add a new transaction
 * @param {Object} transaction - Transaction object
 * @param {string} transaction.date - Transaction date (YYYY-MM-DD)
 * @param {string} transaction.transaction_type - Type: 'purchase', 'reward', 'unstake', 'restake', 'transfer'
 * @param {number} transaction.amount_eur - EUR amount
 * @param {number} transaction.sol_price - SOL price at transaction time
 * @param {number} transaction.sol_received - SOL received
 * @param {number} transaction.sol_staked - SOL staked in this transaction
 * @param {number} transaction.sol_unstaked - SOL unstaked in this transaction
 * @param {number} transaction.fee_sol - Fee in SOL
 * @param {number} transaction.fee_eur - Fee in EUR
 * @param {number} transaction.reward_sol - Reward in SOL
 * @param {number} transaction.reward_eur - Reward in EUR
 * @param {string} transaction.validator - Validator name
 * @param {string} transaction.notes - Optional notes
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const addTransaction = async (transaction) => {
  try {
    // Ensure required fields are present
    if (!transaction.date || !transaction.transaction_type) {
      return {
        data: null,
        error: new Error("Date and transaction_type are required fields"),
      };
    }

    // Set default values for optional fields
    const transactionData = {
      date: transaction.date,
      transaction_type: transaction.transaction_type,
      amount_eur: transaction.amount_eur || 0,
      sol_price: transaction.sol_price || null,
      sol_received: transaction.sol_received || 0,
      sol_staked: transaction.sol_staked || 0,
      sol_unstaked: transaction.sol_unstaked || 0,
      fee_sol: transaction.fee_sol || 0,
      fee_eur: transaction.fee_eur || 0,
      reward_sol: transaction.reward_sol || 0,
      reward_eur: transaction.reward_eur || 0,
      validator: transaction.validator || null,
      notes: transaction.notes || null,
    };

    const { data, error } = await supabase
      .from("sol_transactions")
      .insert([transactionData])
      .select()
      .single();

    if (error) {
      console.error("Error adding transaction:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error in addTransaction:", err);
    return { data: null, error: err };
  }
};

/**
 * Update an existing transaction
 * @param {string} id - Transaction UUID
 * @param {Object} updates - Fields to update
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const updateTransaction = async (id, updates) => {
  try {
    if (!id) {
      return {
        data: null,
        error: new Error("Transaction ID is required"),
      };
    }

    // Remove fields that shouldn't be updated
    const { idx, created_at, ...updateData } = updates;

    const { data, error } = await supabase
      .from("sol_transactions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating transaction:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error in updateTransaction:", err);
    return { data: null, error: err };
  }
};

/**
 * Delete a transaction
 * @param {string} id - Transaction UUID
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const deleteTransaction = async (id) => {
  try {
    if (!id) {
      return {
        data: null,
        error: new Error("Transaction ID is required"),
      };
    }

    const { data, error } = await supabase
      .from("sol_transactions")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error deleting transaction:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error in deleteTransaction:", err);
    return { data: null, error: err };
  }
};

/**
 * Get dashboard summary data
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const getDashboardSummary = async () => {
  try {
    const { data, error } = await supabase
      .from("sol_transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching dashboard summary:", error);
      return { data: null, error };
    }

    // Return the latest transaction which contains all running totals
    const latestTransaction = data?.[0] || null;

    if (latestTransaction) {
      return {
        data: {
          totalInvested: latestTransaction.total_invested_eur,
          totalRewards: latestTransaction.total_rewards_sol,
          portfolioBalance: latestTransaction.portfolio_sol_balance,
          portfolioValue: latestTransaction.portfolio_value_eur,
          unrealizedGain: latestTransaction.unrealized_gain_eur,
          currentSolPrice: latestTransaction.sol_price,
        },
        error: null,
      };
    }

    return { data: null, error: null };
  } catch (err) {
    console.error("Unexpected error in getDashboardSummary:", err);
    return { data: null, error: err };
  }
};

/**
 * Get chart data for the dashboard
 * @returns {Promise<{data: Array, error: Object}>}
 */
export const getChartData = async () => {
  try {
    const { data, error } = await supabase
      .from("sol_transactions")
      .select(
        "date, total_invested_eur, portfolio_value_eur, total_rewards_sol, sol_price",
      )
      .order("date", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching chart data:", error);
      return { data: null, error };
    }

    // Transform data for charting
    const chartData = data.map((transaction) => ({
      date: transaction.date,
      invested: parseFloat(transaction.total_invested_eur || 0),
      portfolioValue: parseFloat(transaction.portfolio_value_eur || 0),
      rewardsValue:
        parseFloat(transaction.total_rewards_sol || 0) *
        parseFloat(transaction.sol_price || 0),
    }));

    return { data: chartData, error: null };
  } catch (err) {
    console.error("Unexpected error in getChartData:", err);
    return { data: null, error: err };
  }
};

export default {
  getTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardSummary,
  getChartData,
};
