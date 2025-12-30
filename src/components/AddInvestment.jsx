import { addInvestment, updateInvestment } from "../services/supabase";

export const AddInvestment = ({
  showForm,
  editingId,
  formData,
  loadInvestments,
  syncing,
  setFormData,
  setEditingId,
  setEditingIndex,
  setShowForm,
  setSyncing,
}) => {
  const handleAddInvestment = async (e) => {
    e.preventDefault();
    setSyncing(true);

    try {
      const investmentData = {
        date: formData.date,
        amount: parseFloat(formData.amount) || 0,
        solPrice:
          formData.amount && formData.solAmount
            ? parseFloat(formData.amount) / parseFloat(formData.solAmount)
            : 0,
        solAmount: parseFloat(formData.solAmount) || 0,
        solStaked: parseFloat(formData.currentStaked) || 0, // Use currentStaked as the amount originally staked
        stakingFee: parseFloat(formData.stakingFee) || 0,
        currentStaked: parseFloat(formData.currentStaked) || 0,
        unstakedSol: parseFloat(formData.unstakedSol) || 0,
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
        date: new Date().toISOString().split("T")[0],
        amount: "",
        solAmount: "",
        currentStaked: "",
        stakingFee: "",
        unstakedSol: "",
      });
      setEditingIndex(null);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError("Failed to save investment");
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingIndex(null);
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      amount: "",
      solAmount: "",
      currentStaked: "",
      stakingFee: "",
      unstakedSol: "",
    });
  };
  return (
    showForm && (
      <form
        onSubmit={handleAddInvestment}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8"
      >
        <h2 className="text-xl font-bold text-white mb-4">
          {editingId ? "Edit Investment Entry" : "Add Investment Entry"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-purple-200 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-purple-200 mb-1">
              Amount Invested (€)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="25.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30"
            />
          </div>
          <div>
            <label className="block text-sm text-purple-200 mb-1">
              SOL Received
            </label>
            <input
              type="number"
              step="0.00000001"
              placeholder="0.48003377"
              value={formData.solAmount}
              onChange={(e) =>
                setFormData({ ...formData, solAmount: e.target.value })
              }
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30"
            />
          </div>
          <div>
            <label className="block text-sm text-purple-200 mb-1">
              Current Staked SOL *
            </label>
            <input
              type="number"
              step="0.00000001"
              placeholder="0.4776793"
              value={formData.currentStaked}
              onChange={(e) =>
                setFormData({ ...formData, currentStaked: e.target.value })
              }
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-purple-200 mb-1">
              Staking Fee (SOL)
            </label>
            <input
              type="number"
              step="0.00000001"
              placeholder="0.00009551"
              value={formData.stakingFee}
              onChange={(e) =>
                setFormData({ ...formData, stakingFee: e.target.value })
              }
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30"
            />
          </div>
          <div>
            <label className="block text-sm text-purple-200 mb-1">
              Unstaked SOL
            </label>
            <input
              type="number"
              step="0.00000001"
              placeholder="0.0024"
              value={formData.unstakedSol}
              onChange={(e) =>
                setFormData({ ...formData, unstakedSol: e.target.value })
              }
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
            {editingId ? "Update Entry" : "Save Entry"}
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
    )
  );
};
