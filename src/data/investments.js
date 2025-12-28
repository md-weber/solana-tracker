// src/data/investments.js
// Update this file with your actual investment data

export const investmentData = {
  investments: [
    { 
    date: "2025-12-24", 
    amount: 49.94, 
    solPrice: 102.89, 
    solAmount: 0.48003377,
    solStaked: 0.47753377,
    stakingFee: 0.00009551,
    currentStaked: 0.47753377,
    unstakedSol: 0.0024
  },
{ 
      date: "2024-12-28",              // Today - just updating rewards
      amount: 0,                       // No new investment
      solPrice: 0,                     // Not applicable
      solAmount: 0,                    // No purchase
      solStaked: 0,                    // No new staking action
      stakingFee: 0,                   // No fee
      currentStaked: 0.4776793,        // ← YOUR CURRENT WALLET BALANCE
      unstakedSol: 0.0024              // Still the same as before
    }
  ],
  currentSolPrice: 104.90
  // investments: [
  //   { 
  //     date: "2024-02", 
  //     amount: 25, 
  //     solPrice: 102.30, 
  //     solAmount: 0.2443,
  //     solStaked: 0.2441,
  //     stakingFee: 0.0002,
  //     currentStaked: 0.2619,
  //     unstakedSol: 0.0004
  //   },
  //   { 
  //     date: "2024-03", 
  //     amount: 25, 
  //     solPrice: 135.20, 
  //     solAmount: 0.1849,
  //     solStaked: 0.1847,
  //     stakingFee: 0.0002,
  //     currentStaked: 0.4468,
  //     unstakedSol: 0.0006
  //   },
  //   { 
  //     date: "2024-12", 
  //     amount: 50.26, 
  //     solPrice: 104.69, 
  //     solAmount: 0.48003377,
  //     solStaked: 0.47753377,
  //     stakingFee: 0.00009551,
  //     currentStaked: 0.4776793,
  //     unstakedSol: 0.0025
  //   }
  // ],
  // currentSolPrice: 104.69
};
