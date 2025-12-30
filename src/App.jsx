import { useState, useEffect } from "react";
import {
  Coins,
  Lock,
  Unlock,
  Plus,
  Download,
  Upload,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

// Import services
import { useSolPrice } from "./hooks/useSolPrice";
import {
  processInvestmentData,
  calculateProfitMetrics,
  createPieChartData,
  calculateRealizedAPY,
} from "./utils/calculations";
import { SummaryCards } from "./components/SummaryCards";
import { InvestmentTable } from "./components/InvestmentTable";
import {
  getInvestments,
  addInvestment,
  updateInvestment,
  deleteInvestment,
} from "./services/supabase";
import { InvestmentChart } from "./components/InvestmentChart";
import { PortfolioPie } from "./components/PortfolioPie";
import { SOLBreakdown } from "./components/SOLBreakdown";
import { AddInvestment } from "./components/AddInvestment";

const App = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    solAmount: "",
    currentStaked: "",
    stakingFee: "",
    unstakedSol: "",
  });

  // Fetch current SOL price
  const {
    currentPrice,
    loading: priceLoading,
    error: priceError,
  } = useSolPrice(104.9);

  // Load investments from Supabase on mount
  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInvestments();
      setInvestments(data);
    } catch (err) {
      setError("Failed to load investments. Check your Supabase connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Process investment data
  const processedData =
    investments.length > 0
      ? processInvestmentData(investments, currentPrice)
      : [];

  const latestData =
    processedData.length > 0
      ? processedData[processedData.length - 1]
      : {
          totalInvested: 0,
          portfolioValue: 0,
          stakedValue: 0,
          unstakedValue: 0,
          rewardsValue: 0,
          feesValue: 0,
          totalSol: 0,
          stakedSol: 0,
          unstakedSol: 0,
          rewardsSol: 0,
          feesSol: 0,
        };

  const { totalProfit, profitPercentage } = calculateProfitMetrics(latestData);
  const pieData = createPieChartData(latestData);
  const apyMetrics = calculateRealizedAPY(processedData);

  // Export data to JSON file
  const handleExport = () => {
    const dataStr = JSON.stringify(
      { investments, currentSolPrice: currentPrice },
      null,
      2,
    );
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `solana-investments-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import data from JSON file
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.investments && Array.isArray(data.investments)) {
          setSyncing(true);

          // Import each investment
          for (const inv of data.investments) {
            await addInvestment(inv);
          }

          await loadInvestments();
          alert(
            `Successfully imported ${data.investments.length} investments!`,
          );
        }
      } catch (error) {
        alert("Invalid JSON file");
        console.error(error);
      } finally {
        setSyncing(false);
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Coins className="w-10 h-10" />
            Solana Staking Portfolio
          </h1>
          <div className="flex gap-2">
            <button
              onClick={loadInvestments}
              disabled={syncing}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw
                className={`w-5 h-5 ${syncing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Entry
            </button>
            <button
              onClick={handleExport}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
            <label className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
              <Upload className="w-5 h-5" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Syncing indicator */}
        {syncing && (
          <div className="bg-blue-500/20 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Syncing with Supabase...
          </div>
        )}

        {/* Add Investment Form */}
        <AddInvestment
          showForm={showForm}
          editingId={editingId}
          formData={formData}
          syncing={syncing}
          loadInvestments={loadInvestments}
          setFormData={setFormData}
          setSyncing={setSyncing}
          setEditingId={setEditingId}
          setEditingIndex={setEditingIndex}
          setShowForm={setShowForm}
        ></AddInvestment>

        <SummaryCards
          latestData={latestData}
          totalProfit={totalProfit}
          profitPercentage={profitPercentage}
          currentPrice={currentPrice}
          loading={priceLoading}
          priceError={priceError}
        />

        {/* SOL Breakdown Cards */}
        <SOLBreakdown
          latestData={latestData}
          apyMetrics={apyMetrics}
        ></SOLBreakdown>

        {/* Charts */}
        {processedData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <InvestmentChart processedData={processedData}></InvestmentChart>
            <PortfolioPie pieData={pieData}></PortfolioPie>
          </div>
        )}

        <InvestmentTable
          investments={investments}
          processedData={processedData}
          currentPrice={currentPrice}
          setFormData={setFormData}
          setEditingIndex={setEditingIndex}
          setEditingId={setEditingId}
          setShowForm={setShowForm}
        />

        {/* Instructions */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-3">
            ☁️ Supabase Sync Active
          </h3>
          <div className="text-purple-200 text-sm space-y-2">
            <p>
              Your data is automatically synced to Supabase (EU servers). You
              can:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Access from any device with your Supabase credentials</li>
              <li>Click "Refresh" to load latest data</li>
              <li>Export for backup (recommended monthly)</li>
              <li>Import to bulk-add historical data</li>
            </ul>
            <p className="mt-3 text-yellow-200">
              💡 <strong>Tip:</strong> Just update "Current Staked SOL" each
              month - rewards are auto-calculated!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
