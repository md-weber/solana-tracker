import { Coins, Plus, Trash2, Edit2 } from "lucide-react";

export const InvestmentTable = ({
  investments,
  processedData,
  currentPrice,
  setFormData,
  setEditingIndex,
  setEditingId,
  setShowForm,
  loadInvestments,
}) => {
  const handleEdit = (idx) => {
    const inv = investments[idx];
    console.log(inv);
    setFormData({
      date: inv.date,
      amount: inv.amountEUR.toString(),
      solAmount: inv.solReceived.toString(),
      currentStaked: inv.solStakedNow.toString(),
      stakingFee: inv.stakingFee.toString(),
      unstakedSol: inv.solUnstakedNow.toString(),
    });
    setEditingIndex(idx);
    setEditingId(inv.id);
    setShowForm(true);
  };

  const handleDelete = async (idx) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    setSyncing(true);
    try {
      const inv = investments[idx];
      await deleteInvestment(inv.id);
      await loadInvestments();
    } catch (err) {
      setError("Failed to delete investment");
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };
  return investments.length > 0 ? (
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
              const monthlyFee =
                investments[idx]?.stakingFee * currentPrice || 0;

              return (
                <tr
                  key={idx}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="py-3 px-3">{row.date}</td>
                  <td className="text-right py-3 px-3">
                    €{row.monthlyInvestedEUR.toFixed(2)}
                  </td>
                  <td className="text-right py-3 px-3">
                    €{row.totalInvestedEUR}
                  </td>
                  <td className="text-right py-3 px-3 font-semibold">
                    €{row.portfolioValue.toFixed(2)}
                  </td>
                  <td className="text-right py-3 px-3 text-purple-300">
                    {row.stakedSol}
                  </td>
                  <td className="text-right py-3 px-3 text-teal-300">
                    {row.currentUnstakedSOL.toFixed(6)}
                  </td>
                  <td className="text-right py-3 px-3 text-yellow-300">
                    {row.rewardsSOL.toFixed(6)}
                  </td>
                  <td className="text-right py-3 px-3 text-red-300">
                    {monthlyFee > 0 ? `€${monthlyFee.toFixed(2)}` : "-"}
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
      <p className="text-purple-200 mb-6">
        Start tracking your Solana staking journey by adding your first entry!
      </p>
      <button
        onClick={() => setShowForm(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Your First Investment
      </button>
    </div>
  );
};
