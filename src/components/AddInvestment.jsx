import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export const AddInvestmentForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    solAmount: '',
    currentStaked: '',
    stakingFee: '',
    unstakedSol: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const investment = {
      date: formData.date,
      amount: parseFloat(formData.amount) || 0,
      solPrice: formData.amount && formData.solAmount 
        ? parseFloat(formData.amount) / parseFloat(formData.solAmount) 
        : 0,
      solAmount: parseFloat(formData.solAmount) || 0,
      solStaked: parseFloat(formData.currentStaked) - parseFloat(formData.stakingFee || 0),
      stakingFee: parseFloat(formData.stakingFee) || 0,
      currentStaked: parseFloat(formData.currentStaked) || 0,
      unstakedSol: parseFloat(formData.unstakedSol) || 0
    };
    
    onAdd(investment);
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      solAmount: '',
      currentStaked: '',
      stakingFee: '',
      unstakedSol: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Add Investment Entry
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Amount Invested (€)"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
        />
        <input
          type="number"
          step="0.00000001"
          placeholder="SOL Amount"
          value={formData.solAmount}
          onChange={(e) => setFormData({...formData, solAmount: e.target.value})}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
        />
        <input
          type="number"
          step="0.00000001"
          placeholder="Current Staked SOL"
          value={formData.currentStaked}
          onChange={(e) => setFormData({...formData, currentStaked: e.target.value})}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
          required
        />
        <input
          type="number"
          step="0.00000001"
          placeholder="Staking Fee (SOL)"
          value={formData.stakingFee}
          onChange={(e) => setFormData({...formData, stakingFee: e.target.value})}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
        />
        <input
          type="number"
          step="0.00000001"
          placeholder="Unstaked SOL"
          value={formData.unstakedSol}
          onChange={(e) => setFormData({...formData, unstakedSol: e.target.value})}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
      >
        Add Entry
      </button>
    </form>
  );
};
