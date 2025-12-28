/// src/utils/calculations.js
// All calculation logic in one place

/**
 * Process raw investment data and calculate cumulative values
 * @param {Array} investments - Array of investment objects
 * @param {number} currentPrice - Current SOL price in EUR
 * @returns {Array} Processed data with calculated fields
 */
export const processInvestmentData = (investments, currentPrice) => {
  return investments.map((inv, idx) => {
    const prevInvestments = investments.slice(0, idx);
    
    // Calculate cumulative totals
    const totalInvested = [...prevInvestments, inv].reduce((sum, i) => sum + i.amount, 0);
    const totalSolPurchased = [...prevInvestments, inv].reduce((sum, i) => sum + i.solAmount, 0);
    const totalFees = [...prevInvestments, inv].reduce((sum, i) => sum + i.stakingFee, 0);
    
    // Use currentStaked from the current entry if available, otherwise calculate cumulative
    const cumulativeStaked = inv.currentStaked > 0
      ? inv.currentStaked 
      : [...prevInvestments, inv].reduce((sum, i) => sum + i.solStaked, 0);
    
    // Calculate total unstaked SOL
    // If unstakedSol is provided in the data, use it; otherwise calculate it
    const totalUnstaked = inv.unstakedSol !== undefined 
      ? inv.unstakedSol 
      : totalSolPurchased - cumulativeStaked - totalFees;
    
    // Staking rewards = current staked - originally staked
    const totalOriginallyStaked = [...prevInvestments, inv].reduce((sum, i) => sum + i.solStaked, 0);
    const stakedRewards = cumulativeStaked - totalOriginallyStaked;
    
    // Calculate EUR values
    const stakedValue = cumulativeStaked * currentPrice;
    const unstakedValue = totalUnstaked * currentPrice;
    const portfolioValue = stakedValue + unstakedValue;
    const rewardsValue = stakedRewards * currentPrice;
    const feesValue = totalFees * currentPrice;

    return {
      date: inv.date,
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      portfolioValue: parseFloat(portfolioValue.toFixed(2)),
      stakedValue: parseFloat(stakedValue.toFixed(2)),
      unstakedValue: parseFloat(unstakedValue.toFixed(2)),
      rewardsValue: parseFloat(rewardsValue.toFixed(2)),
      feesValue: parseFloat(feesValue.toFixed(2)),
      totalSol: parseFloat(totalSolPurchased.toFixed(6)),
      stakedSol: parseFloat(cumulativeStaked.toFixed(6)),
      unstakedSol: parseFloat(totalUnstaked.toFixed(6)),
      rewardsSol: parseFloat(stakedRewards.toFixed(6)),
      feesSol: parseFloat(totalFees.toFixed(6)),
      monthlyInvest: inv.amount
    };
  });
};

/**
 * Calculate profit/loss metrics
 * @param {Object} latestData - Latest processed data point
 * @returns {Object} Total profit and profit percentage
 */
export const calculateProfitMetrics = (latestData) => {
  const totalProfit = latestData.portfolioValue - latestData.totalInvested;
  const profitPercentage = ((totalProfit / latestData.totalInvested) * 100).toFixed(2);
  
  return { totalProfit, profitPercentage };
};

/**
 * Create data structure for pie chart
 * @param {Object} latestData - Latest processed data point
 * @returns {Array} Pie chart data array
 */
export const createPieChartData = (latestData) => {
  return [
    { name: 'Staked SOL', value: latestData.stakedValue },
    { name: 'Unstaked SOL', value: latestData.unstakedValue },
    { name: 'Staking Rewards', value: latestData.rewardsValue }
  ];
};
