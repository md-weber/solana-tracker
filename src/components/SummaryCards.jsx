// src/components/SummaryCards.jsx
import React from 'react';
import { TrendingUp, Wallet, Coins } from 'lucide-react';

export const SummaryCards = ({ latestData, totalProfit, profitPercentage, currentPrice, loading, priceError }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-2 text-purple-200 mb-2">
          <Wallet className="w-5 h-5" />
          <span className="text-sm font-medium">Total Invested</span>
        </div>
        <p className="text-3xl font-bold text-white">€{latestData.totalInvestedEUR}</p>
        <p className="text-xs text-purple-200 mt-1">Fees: €{latestData.stakingFeesValue.toFixed(2)}</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-2 text-teal-200 mb-2">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm font-medium">Portfolio Value</span>
        </div>
        <p className="text-3xl font-bold text-white">€{latestData.portfolioValue.toFixed(2)}</p>
        <p className={`text-sm mt-1 ${totalProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
          {totalProfit >= 0 ? '+' : ''}€{totalProfit.toFixed(2)} ({profitPercentage}%)
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-2 text-yellow-200 mb-2">
          <Coins className="w-5 h-5" />
          <span className="text-sm font-medium">Staking Rewards</span>
        </div>
        <p className="text-3xl font-bold text-white">€{latestData.rewardsValue.toFixed(2)}</p>
        <p className="text-sm text-yellow-200 mt-1">{latestData.rewardsSOL.toFixed(6)} SOL</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-2 text-indigo-200 mb-2">
          <Coins className="w-5 h-5" />
          <span className="text-sm font-medium">Total SOL Holdings</span>
        </div>
        <p className="text-3xl font-bold text-white">{latestData.totalCurrentSOL}</p>
        <p className="text-sm text-indigo-200 mt-1">
          Price: €{currentPrice.toFixed(2)}
          {loading && <span className="ml-2 text-xs">⟳</span>}
          {priceError && <span className="ml-2 text-xs text-yellow-300">({priceError})</span>}
        </p>
      </div>
    </div>
  );
};
