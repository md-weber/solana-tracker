import { useState, useEffect } from "react";
import { Coins, Plus, Download, Upload, RefreshCw } from "lucide-react";

// Import services
import { useSolPrice } from "./hooks/useSolPrice";
import { getTransactions } from "./services/supabase";
import TransactionForm from "./components/AddTransactionForm";
import TransactionsTable from "./components/TransactionHistory";
import PortfolioChart from "./components/PortfolioChart";
import { SummaryCards } from "./components/SummaryCards";

const App = () => {
  const [transactions, setTransactions] = useState([]);
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
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      setError("Failed to load investments. Check your Supabase connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const latestTransaction =
    transactions.data != null ? transactions.data[0] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
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
        {showForm && (
          <TransactionForm currentSolPrice={currentPrice}></TransactionForm>
        )}
        {console.log(latestTransaction)}
        {!loading && (
          <SummaryCards
            total_invested_eur={latestTransaction.total_invested_eur}
            portfolio_sol_balance={latestTransaction.portfolio_sol_balance}
            portfolio_staked_sol={latestTransaction.portfolio_staked_sol}
            currentSolPrice={currentPrice}
            currentLiveValue={
              parseFloat(latestTransaction.portfolio_sol_balance) * currentPrice
            }
            currentPrice={latestTransaction.sol_price}
            rewardsValue={latestTransaction.total_rewards_sol * currentPrice}
            rewardsSol={latestTransaction.total_rewards_sol}
            latestData={latestTransaction}
          ></SummaryCards>
        )}
        <PortfolioChart
          txns={transactions.data}
          currentSolPrice={currentPrice}
        ></PortfolioChart>
        <TransactionsTable txns={transactions}></TransactionsTable>
      </div>
    </div>
  );
};

export default App;
