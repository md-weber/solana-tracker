import { TrendingUp } from "lucide-react";
export const SummaryCards = ({
  total_invested_eur,
  portfolio_sol_balance,
  portfolio_staked_sol,
  priceLoading,
  currentLiveValue,
  currentPrice,
  rewardsValue,
  rewardsSol,
  latestData,
}) => {
  const gainLoss =
    latestData.portfolio_value_eur - latestData.total_invested_eur;
  const gainLossPercent =
    latestData.total_invested_eur > 0
      ? ((gainLoss / latestData.total_invested_eur) * 100).toFixed(2)
      : 0;

  return (
    <div>
      <div className="m-4 grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-white/60 text-sm mb-1">Total Invested</div>
          <div className="text-white text-2xl font-bold">
            €{parseFloat(total_invested_eur || 0).toFixed(2)}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-white/60 text-sm mb-1">Total SOL</div>
          <div className="text-cyan-300 text-2xl font-bold">
            {parseFloat(portfolio_sol_balance || 0).toFixed(6)}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-white/60 text-sm mb-1">Staked SOL</div>
          <div className="text-green-300 text-2xl font-bold">
            {parseFloat(portfolio_staked_sol || 0).toFixed(6)}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-white/60 text-sm mt-3 mb-1">
            Current Live Value
            {priceLoading && <span className="ml-2">⟳</span>}
          </div>
          <div className="text-yellow-300 text-2xl font-bold">
            €{currentLiveValue.toFixed(2)}
          </div>
          <div className="text-white/40 text-xs mt-1">
            @ €{currentPrice.toFixed(2)}/SOL
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Total Rewards</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-white text-3xl font-bold">
            €{rewardsValue.toFixed(2)}
          </div>
          <div className="text-white/40 text-xs mt-1">
            {rewardsSol.toFixed(8)} SOL
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Gain/Loss</span>
            <TrendingUp
              className={`w-5 h-5 ${gainLoss >= 0 ? "text-green-400" : "text-red-400"}`}
            />
          </div>
          <div
            className={`text-3xl font-bold ${gainLoss >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            €{gainLoss.toFixed(2)}
          </div>
          <div className="text-white/60 text-sm mt-1">{gainLossPercent}%</div>
        </div>
      </div>
    </div>
  );
};
