// src/App.jsx
// Main component with Supabase integration

import React, { useState, useEffect } from 'react';
import { Coins, Lock, Unlock, Plus, Download, Upload, Trash2, Edit2, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Import services
import { useSolPrice } from './hooks/useSolPrice';
import { processInvestmentData, calculateProfitMetrics, createPieChartData } from './utils/calculations';
import { SummaryCards } from './components/SummaryCards';
import { getInvestments, addInvestment, updateInvestment, deleteInvestment } from './services/supabase';

const COLORS = ['#8b5cf6', '#14b8a6', '#fbbf24'];

const App = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    solAmount: '',
    currentStaked: '',
    stakingFee: '',
    unstakedSol: ''
  });

  // Fetch current SOL price
  const { currentPrice, loading: priceLoading, error: priceError } = useSolPrice(104.90);

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
      setError('Failed to load investments. Check your Supabase connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Process investment data
  const processedData = investments.length > 0 
    ? processInvestmentData(investments, currentPrice)
    : [];
  
  const latestData = processedData.length > 0 
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
        feesSol: 0
      };

  const { totalProfit, profitPercentage } = calculateProfitMetrics(latestData);
  const pieData = createPieChartData(latestData);

  // Add or update investment
  const handleAddInvestment = async (e) => {
    e.preventDefault();
    setSyncing(true);
    
    try {
      const investmentData = {
        date: formData.date,
        amount: parseFloat(formData.amount) || 0,
        solPrice: formData.amount && formData.solAmount 
          ? parseFloat(formData.amount) / parseFloat(formData.solAmount) 
          : 0,
        solAmount: parseFloat(formData.solAmount) || 0,
        solStaked: parseFloat(formData.currentStaked) || 0, // Use currentStaked as the amount originally staked
        stakingFee: parseFloat(formData.stakingFee) || 0,
        currentStaked: parseFloat(formData.currentStaked) || 0,
        unstakedSol: parseFloat(formData.unstakedSol) || 0
      };

      if (editingId) {
        // Update existing
        await updateInvestment(editingId, investmentData);
      } else {
        // Add new
        await addInvestment(investmentData);
      }

      // Reload data
      await loadInvestments();
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        solAmount: '',
        currentStaked: '',
        stakingFee: '',
        unstakedSol: ''
      });
      setEditingIndex(null);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError('Failed to save investment');
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  // Edit investment
  const handleEdit = (idx) => {
    const inv = investments[idx];
    setFormData({
      date: inv.date,
      amount: inv.amount.toString(),
      solAmount: inv.solAmount.toString(),
      currentStaked: inv.currentStaked.toString(),
      stakingFee: inv.stakingFee.toString(),
      unstakedSol: inv.unstakedSol.toString()
    });
    setEditingIndex(idx);
    setEditingId(inv.id);
    setShowForm(true);
  };

  // Delete investment
  const handleDelete = async (idx) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    setSyncing(true);
    try {
      const inv = investments[idx];
      await deleteInvestment(inv.id);
      await loadInvestments();
    } catch (err) {
      setError('Failed to delete investment');
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setShowForm(false);
    setEditingIndex(null);
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      solAmount: '',
      currentStaked: '',
      stakingFee: '',
      unstakedSol: ''
    });
  };

  // Export data to JSON file
  const handleExport = () => {
    const dataStr = JSON.stringify({ investments, currentSolPrice: currentPrice }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `solana-investments-${new Date().toISOString().split('T')[0]}.json`;
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
          alert(`Successfully imported ${data.investments.length} investments!`);
        }
      } catch (error) {
        alert('Invalid JSON file');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6">
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
              <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
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
          <form onSubmit={handleAddInvestment} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? 'Edit Investment Entry' : 'Add Investment Entry'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-purple-200 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-purple-200 mb-1">Amount Invested (€)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="25.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30"
                />
              </div>
              <div>
                <label className="block text-sm text-purple-200 mb-1">SOL Received</label>
                <input
                  type="number"
                  step="0.00000001"
                  placeholder="0.48003377"
                  value={formData.solAmount}
                  onChange={(e) => setFormData({...formData, solAmount: e.target.value})}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30"
                />
              </div>
              <div>
                <label className="block text-sm text-purple-200 mb-1">Current Staked SOL *</label>
                <input
                  type="number"
                  step="0.00000001"
                  placeholder="0.4776793"
                  value={formData.currentStaked}
                  onChange={(e) => setFormData({...formData, currentStaked: e.target.value})}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-purple-200 mb-1">Staking Fee (SOL)</label>
                <input
                  type="number"
                  step="0.00000001"
                  placeholder="0.00009551"
                  value={formData.stakingFee}
                  onChange={(e) => setFormData({...formData, stakingFee: e.target.value})}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30"
                />
              </div>
              <div>
                <label className="block text-sm text-purple-200 mb-1">Unstaked SOL</label>
                <input
                  type="number"
                  step="0.00000001"
                  placeholder="0.0024"
                  value={formData.unstakedSol}
                  onChange={(e) => setFormData({...formData, unstakedSol: e.target.value})}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={syncing}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Update Entry' : 'Save Entry'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Summary Cards Component */}
        <SummaryCards 
          latestData={latestData}
          totalProfit={totalProfit}
          profitPercentage={profitPercentage}
          currentPrice={currentPrice}
          loading={priceLoading}
          priceError={priceError}
        />

        {/* SOL Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 text-purple-300 mb-2">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Staked SOL</span>
            </div>
            <p className="text-2xl font-bold text-white">{latestData.stakedSol}</p>
            <p className="text-xs text-purple-200 mt-1">€{latestData.stakedValue.toFixed(2)}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 text-teal-300 mb-2">
              <Unlock className="w-4 h-4" />
              <span className="text-sm font-medium">Unstaked SOL</span>
            </div>
            <p className="text-2xl font-bold text-white">{latestData.unstakedSol.toFixed(6)}</p>
            <p className="text-xs text-teal-200 mt-1">€{latestData.unstakedValue.toFixed(2)}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 text-red-300 mb-2">
              <Coins className="w-4 h-4" />
              <span className="text-sm font-medium">Total Fees Paid</span>
            </div>
            <p className="text-2xl font-bold text-white">{latestData.feesSol.toFixed(6)}</p>
            <p className="text-xs text-red-200 mt-1">€{latestData.feesValue.toFixed(2)}</p>
          </div>
        </div>

        {/* Charts */}
        {processedData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Investment Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="date" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="totalInvested" stroke="#8b5cf6" name="Invested €" strokeWidth={2} />
                  <Line type="monotone" dataKey="portfolioValue" stroke="#14b8a6" name="Portfolio €" strokeWidth={2} />
                  <Line type="monotone" dataKey="rewardsValue" stroke="#fbbf24" name="Rewards €" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Portfolio Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => `€${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Data Table */}
        {investments.length > 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Investment History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-white text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-3">Date</th>
                    <th className="text-right py-3 px-3">Invested €</th>
                    <th className="text-right py-3 px-3">Total Invested</th>
                    <th className="text-right py-3 px-3">Portfolio €</th>
                    <th className="text-right py-3 px-3">Staked SOL</th>
                    <th className="text-right py-3 px-3">Unstaked SOL</th>
                    <th className="text-right py-3 px-3">Rewards SOL</th>
                    <th className="text-right py-3 px-3">Fees €</th>
                    <th className="text-right py-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.map((row, idx) => {
                    const monthlyFee = investments[idx]?.stakingFee * currentPrice || 0;
                    
                    return (
                      <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-3">{row.date}</td>
                        <td className="text-right py-3 px-3">€{row.monthlyInvest.toFixed(2)}</td>
                        <td className="text-right py-3 px-3">€{row.totalInvested}</td>
                        <td className="text-right py-3 px-3 font-semibold">€{row.portfolioValue.toFixed(2)}</td>
                        <td className="text-right py-3 px-3 text-purple-300">{row.stakedSol}</td>
                        <td className="text-right py-3 px-3 text-teal-300">{row.unstakedSol.toFixed(6)}</td>
                        <td className="text-right py-3 px-3 text-yellow-300">{row.rewardsSol.toFixed(6)}</td>
                        <td className="text-right py-3 px-3 text-red-300">
                          {monthlyFee > 0 ? `€${monthlyFee.toFixed(2)}` : '-'}
                        </td>
                        <td className="text-right py-3 px-3">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleEdit(idx)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(idx)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
            <Coins className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No investments yet</h3>
            <p className="text-purple-200 mb-6">Start tracking your Solana staking journey by adding your first entry!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Investment
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-3">☁️ Supabase Sync Active</h3>
          <div className="text-purple-200 text-sm space-y-2">
            <p>Your data is automatically synced to Supabase (EU servers). You can:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Access from any device with your Supabase credentials</li>
              <li>Click "Refresh" to load latest data</li>
              <li>Export for backup (recommended monthly)</li>
              <li>Import to bulk-add historical data</li>
            </ul>
            <p className="mt-3 text-yellow-200">
              💡 <strong>Tip:</strong> Just update "Current Staked SOL" each month - rewards are auto-calculated!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
