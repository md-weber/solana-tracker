/**
 * Process raw investment data with simplified inputs
 * @param {Array} investments - Array of investment objects
 * @param {number} currentPrice - Current SOL price in EUR
 * @returns {Array} Processed data with calculated fields
 */
export const processInvestmentData = (investments, currentPrice) => {
  return investments.map((inv, idx) => {
    const prevInvestments = investments.slice(0, idx);

    // Calculate cumulative EUR invested (including all fees)
    const totalInvestedEUR = [...prevInvestments, inv].reduce(
      (sum, i) => sum + i.amountEUR + i.bitvavoFees,
      0,
    );

    // Calculate cumulative SOL purchased
    const totalSolPurchased = [...prevInvestments, inv].reduce(
      (sum, i) => sum + i.solReceived,
      0,
    );

    // Calculate cumulative fees paid (in SOL)
    const totalStakingFees = [...prevInvestments, inv].reduce(
      (sum, i) => sum + i.stakingFee,
      0,
    );

    // Calculate cumulative Bitvavo fees (in EUR)
    const totalBitvavoFees = [...prevInvestments, inv].reduce(
      (sum, i) => sum + i.bitvavoFees,
      0,
    );

    // Current balances (from wallet snapshots)
    const currentStaked = inv.solStakedNow;
    const currentUnstaked = inv.solUnstakedNow;
    const totalCurrentSOL = currentStaked + currentUnstaked;

    // Calculate staking rewards
    // Rewards = current staked - (all SOL purchased - unstaked - fees)
    const totalSolThatShouldBeStaked =
      totalSolPurchased - currentUnstaked - totalStakingFees;
    const stakedRewards = Math.max(
      0,
      currentStaked - totalSolThatShouldBeStaked,
    );

    // Calculate EUR values
    const stakedValue = currentStaked * currentPrice;
    const unstakedValue = currentUnstaked * currentPrice;
    const portfolioValue = (currentStaked + currentUnstaked) * currentPrice;
    const rewardsValue = stakedRewards * currentPrice;
    const stakingFeesValue = totalStakingFees * currentPrice;

    // Calculate effective cost per SOL (including all fees)
    const effectiveCostPerSOL =
      totalSolPurchased > 0 ? totalInvestedEUR / totalSolPurchased : 0;

    return {
      date: inv.date,
      validator: inv.validator,

      // EUR tracking
      monthlyInvestedEUR: inv.amountEUR,
      monthlyBitvavoFees: inv.bitvavoFees,
      totalInvestedEUR: parseFloat(totalInvestedEUR.toFixed(2)),
      totalBitvavoFeesEUR: parseFloat(totalBitvavoFees.toFixed(2)),

      // SOL tracking
      monthlySolReceived: parseFloat(inv.solReceived.toFixed(8)),
      totalSolPurchased: parseFloat(totalSolPurchased.toFixed(8)),
      currentStakedSOL: parseFloat(currentStaked.toFixed(8)),
      currentUnstakedSOL: parseFloat(currentUnstaked.toFixed(8)),
      totalCurrentSOL: parseFloat(totalCurrentSOL.toFixed(8)),
      rewardsSOL: parseFloat(stakedRewards.toFixed(8)),

      // Fees in SOL
      monthlyStakingFee: parseFloat(inv.stakingFee.toFixed(8)),
      totalStakingFeesSOL: parseFloat(totalStakingFees.toFixed(8)),

      // Portfolio values
      portfolioValue: parseFloat(portfolioValue.toFixed(2)),
      stakedValue: parseFloat(stakedValue.toFixed(2)),
      unstakedValue: parseFloat(unstakedValue.toFixed(2)),
      rewardsValue: parseFloat(rewardsValue.toFixed(2)),
      stakingFeesValue: parseFloat(stakingFeesValue.toFixed(2)),

      // Metrics
      effectiveCostPerSOL: parseFloat(effectiveCostPerSOL.toFixed(2)),
      currentPricePerSOL: parseFloat(currentPrice.toFixed(2)),
    };
  });
};

/**
 * Calculate profit/loss metrics
 * @param {Object} latestData - Latest processed data point
 * @returns {Object} Total profit and profit percentage
 */
export const calculateProfitMetrics = (latestData) => {
  const totalProfit = latestData.portfolioValue - latestData.totalInvestedEUR;
  const profitPercentage =
    latestData.totalInvestedEUR > 0
      ? ((totalProfit / latestData.totalInvestedEUR) * 100).toFixed(2)
      : 0;

  return { totalProfit, profitPercentage };
};

/**
 * Calculate actual realized APY based on staking rewards
 * @param {Array} processedData - All processed investment data
 * @returns {Object} APY calculations
 */
export const calculateRealizedAPY = (processedData) => {
  if (processedData.length === 0) {
    return { annualizedAPY: 0, dailyRate: 0, daysStaked: 0 };
  }

  const firstEntry = processedData[0];
  const latestEntry = processedData[processedData.length - 1];

  // Calculate days between first and last entry
  const firstDate = new Date(firstEntry.date);
  const lastDate = new Date(latestEntry.date);
  const daysStaked = Math.max(
    1,
    Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)),
  );

  // Get total staking rewards in SOL
  const totalRewardsSOL = latestEntry.rewardsSOL;

  // Calculate average staked amount (simple average of all staked amounts)
  const avgStakedSOL =
    processedData.reduce((sum, entry) => sum + entry.currentStakedSOL, 0) /
    processedData.length;

  if (avgStakedSOL === 0 || totalRewardsSOL === 0 || daysStaked === 0) {
    return { annualizedAPY: 0, dailyRate: 0, daysStaked };
  }

  // Calculate daily rate: (total rewards / average staked) / days
  const dailyRate = totalRewardsSOL / avgStakedSOL / daysStaked;

  // Annualize with compound interest: (1 + dailyRate)^365 - 1
  const annualizedAPY = (Math.pow(1 + dailyRate, 365) - 1) * 100;

  return {
    annualizedAPY: parseFloat(annualizedAPY.toFixed(2)),
    dailyRate: parseFloat((dailyRate * 100).toFixed(4)),
    daysStaked,
    totalRewardsSOL,
    avgStakedSOL,
  };
};

/**
 * Create data structure for pie chart
 * @param {Object} latestData - Latest processed data point
 * @returns {Array} Pie chart data array
 */
export const createPieChartData = (latestData) => {
  return [
    { name: "Staked SOL", value: latestData.stakedValue },
    { name: "Unstaked SOL", value: latestData.unstakedValue },
    { name: "Staking Rewards", value: latestData.rewardsValue },
  ];
};
