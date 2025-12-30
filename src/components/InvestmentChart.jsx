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

export const InvestmentChart = ({ processedData }) => {
  return (
    <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h2 className="text-xl font-bold text-white mb-4">Investment Growth</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis dataKey="date" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalInvestedEUR"
            stroke="#8b5cf6"
            name="Invested €"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="portfolioValue"
            stroke="#14b8a6"
            name="Portfolio €"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="rewardsValue"
            stroke="#fbbf24"
            name="Rewards €"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
