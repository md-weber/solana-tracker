import { Coins, Lock, Unlock, TrendingUp } from "lucide-react";

export const SOLBreakdown = ({ latestData, apyMetrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <div className="flex items-center gap-2 text-purple-300 mb-2">
          <Lock className="w-4 h-4" />
          <span className="text-sm font-medium">Staked SOL</span>
        </div>
        <p className="text-2xl font-bold text-white">
          {latestData.currentStakedSOL}
        </p>
        <p className="text-xs text-purple-200 mt-1">
          €{latestData.stakedValue.toFixed(2)}
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <div className="flex items-center gap-2 text-teal-300 mb-2">
          <Unlock className="w-4 h-4" />
          <span className="text-sm font-medium">Unstaked SOL</span>
        </div>
        <p className="text-2xl font-bold text-white">
          {latestData.currentUnstakedSOL.toFixed(6)}
        </p>
        <p className="text-xs text-teal-200 mt-1">
          €{latestData.unstakedValue.toFixed(2)}
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <div className="flex items-center gap-2 text-red-300 mb-2">
          <Coins className="w-4 h-4" />
          <span className="text-sm font-medium">Total Fees Paid</span>
        </div>
        <p className="text-2xl font-bold text-white">
          {latestData.totalStakingFeesSOL.toFixed(6)}
        </p>
        <p className="text-xs text-red-200 mt-1">
          €{latestData.monthlyStakingFee.toFixed(2)}
        </p>
      </div>

      <div className="bg-linear-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-400/30">
        <div className="flex items-center gap-2 text-yellow-300 mb-2">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Realized APY</span>
        </div>
        <p className="text-2xl font-bold text-white">
          {apyMetrics.annualizedAPY > 0
            ? `${apyMetrics.annualizedAPY}%`
            : "Calculating..."}
        </p>
        <p className="text-xs text-yellow-200 mt-1">
          {apyMetrics.daysStaked > 0
            ? `${apyMetrics.daysStaked} days staked`
            : "Add more entries to calculate"}
        </p>
      </div>
    </div>
  );
};
