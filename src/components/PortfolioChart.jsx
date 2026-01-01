import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useSolPrice } from "../hooks/useSolPrice";

export default function PortfolioChart({ txns }) {
  const {
    currentPrice,
    loading: priceLoading,
    error: priceError,
  } = useSolPrice(104.9);

  // Process data for the chart
  const chartData = txns
    .map((tx, index) => {
      const totalInvested = parseFloat(tx.total_invested_eur || 0);
      const totalPortfolioSolBalance = parseFloat(
        tx.portfolio_sol_balance || 0,
      );
      const portfolioValue = parseFloat(tx.portfolio_value_eur || 0);
      const rewardsSol = parseFloat(tx.total_rewards_sol || 0);
      const solPrice = parseFloat(currentPrice || 0);
      const rewardsValue = rewardsSol * solPrice;

      return {
        date: tx.date,
        totalInvested: totalInvested,
        portfolioValue: portfolioValue,
        rewardsValue: rewardsValue,
        rewardsSol: rewardsSol,
        totalPortfolioSolBalance: totalPortfolioSolBalance,
        // Keep track of index for unique keys
        id: index,
      };
    })
    .reverse();
  // Get latest values for summary cards
  const latestData = chartData[chartData.length - 1] || {
    totalInvested: 0,
    portfolioValue: 0,
    rewardsValue: 0,
  };

  const gainLoss = latestData.portfolioValue - latestData.totalInvested;
  const gainLossPercent =
    latestData.totalInvested > 0
      ? ((gainLoss / latestData.totalInvested) * 100).toFixed(2)
      : 0;

  const currentLiveValue =
    parseFloat(latestData.totalPortfolioSolBalance) * currentPrice;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: €{entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Chart */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            Portfolio Performance
          </h2>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="date"
                stroke="#fff"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#fff"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `€${value.toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
              <Line
                type="monotone"
                dataKey="totalInvested"
                name="Total Invested"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="portfolioValue"
                name="Portfolio Value"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="rewardsValue"
                name="Total Rewards Value"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={{ fill: "#fbbf24", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Legend Explanation */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded mt-1"></div>
              <div>
                <div className="text-white font-semibold">Total Invested</div>
                <div className="text-white/60">
                  Your cumulative EUR investments over time
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-green-500 rounded mt-1"></div>
              <div>
                <div className="text-white font-semibold">Portfolio Value</div>
                <div className="text-white/60">
                  Current worth of your SOL holdings in EUR
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded mt-1"></div>
              <div>
                <div className="text-white font-semibold">
                  Total Rewards Value
                </div>
                <div className="text-white/60">
                  EUR value of accumulated staking rewards
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">
            Performance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
            <div>
              <p className="text-sm mb-2">
                <span className="font-semibold text-white">
                  Investment Strategy:
                </span>{" "}
                Your portfolio shows consistent staking with rewards
                accumulating over time.
              </p>
            </div>
            <div>
              <p className="text-sm mb-2">
                <span className="font-semibold text-white">
                  Current Status:
                </span>
                {gainLoss >= 0 ? (
                  <span className="text-green-400">
                    {" "}
                    Your portfolio is up €{gainLoss.toFixed(2)} (
                    {gainLossPercent}%)
                  </span>
                ) : (
                  <span className="text-red-400">
                    {" "}
                    Your portfolio is down €{Math.abs(gainLoss).toFixed(2)} (
                    {gainLossPercent}%)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
