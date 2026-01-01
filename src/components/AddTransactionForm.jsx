import { useState } from "react";
import { addTransaction } from "../services/supabase";

export default function TransactionForm({ currentSolPrice }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    transaction_type: "purchase",
    amount_eur: "",
    sol_price: currentSolPrice,
    sol_received: "",
    sol_staked: "",
    sol_unstaked: "",
    fee_sol: "",
    fee_eur: "",
    reward_sol: "",
    reward_eur: "",
    validator: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const transaction = {
        date: formData.date,
        transaction_type: formData.transaction_type,
        amount_eur: parseFloat(formData.amount_eur) || 0,
        sol_price: parseFloat(formData.sol_price) || null,
        sol_received: parseFloat(formData.sol_received) || 0,
        sol_staked: parseFloat(formData.sol_staked) || 0,
        sol_unstaked: parseFloat(formData.sol_unstaked) || 0,
        fee_sol: parseFloat(formData.fee_sol) || 0,
        fee_eur: parseFloat(formData.fee_eur) || 0,
        reward_sol: parseFloat(formData.reward_sol) || 0,
        reward_eur: parseFloat(formData.reward_eur) || 0,
        validator: formData.validator || null,
        notes: formData.notes || null,
      };

      const { data, error } = await addTransaction(transaction);

      if (error) {
        setMessage({ type: "error", text: `Error: ${error.message}` });
      } else {
        setMessage({
          type: "success",
          text: "Transaction added successfully!",
        });
        // Reset form
        setFormData({
          date: new Date().toISOString().split("T")[0],
          transaction_type: "purchase",
          amount_eur: "",
          sol_price: "",
          sol_received: "",
          sol_staked: "",
          sol_unstaked: "",
          fee_sol: "",
          fee_eur: "",
          reward_sol: "",
          reward_eur: "",
          validator: "",
          notes: "",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: `Unexpected error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Transaction</h2>
        </div>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type *
              </label>
              <select
                name="transaction_type"
                value={formData.transaction_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="purchase">Purchase</option>
                <option value="reward">Reward</option>
                <option value="unstake">Unstake</option>
                <option value="restake">Restake</option>
                <option value="transfer">Transfer</option>
                <option value="reward_snapshot">Reward Snapshot</option>
              </select>
            </div>
          </div>

          {/* EUR Amount and SOL Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (EUR)
              </label>
              <input
                type="number"
                name="amount_eur"
                value={formData.amount_eur}
                onChange={handleChange}
                step="0.01"
                placeholder="50.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SOL Price (EUR)
              </label>
              <input
                type="number"
                name="sol_price"
                value={formData.sol_price}
                onChange={handleChange}
                step="0.01"
                placeholder="103.03"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* SOL Amounts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SOL Received
              </label>
              <input
                type="number"
                name="sol_received"
                value={formData.sol_received}
                onChange={handleChange}
                step="0.00000001"
                placeholder="0.48403377"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SOL Staked
              </label>
              <input
                type="number"
                name="sol_staked"
                value={formData.sol_staked}
                onChange={handleChange}
                step="0.00000001"
                placeholder="0.48403377"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SOL Unstaked
              </label>
              <input
                type="number"
                name="sol_unstaked"
                value={formData.sol_unstaked}
                onChange={handleChange}
                step="0.00000001"
                placeholder="0.00000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Fees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee (SOL)
              </label>
              <input
                type="number"
                name="fee_sol"
                value={formData.fee_sol}
                onChange={handleChange}
                step="0.00000001"
                placeholder="0.00000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee (EUR)
              </label>
              <input
                type="number"
                name="fee_eur"
                value={formData.fee_eur}
                onChange={handleChange}
                step="0.01"
                placeholder="0.13"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Rewards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reward (SOL)
              </label>
              <input
                type="number"
                name="reward_sol"
                value={formData.reward_sol}
                onChange={handleChange}
                step="0.00000001"
                placeholder="0.00000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reward (EUR)
              </label>
              <input
                type="number"
                name="reward_eur"
                value={formData.reward_eur}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Validator */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validator / Exchange
            </label>
            <input
              type="text"
              name="validator"
              value={formData.validator}
              onChange={handleChange}
              placeholder="Bitvavo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Optional notes about this transaction..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Transaction"}
            </button>
          </div>
        </div>

        {/* Summary Preview */}
        {formData.amount_eur && formData.sol_received && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">
              Transaction Summary
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Paid:</span> €
                {formData.amount_eur}
              </p>
              <p>
                <span className="font-medium">Fee:</span> €
                {formData.fee_eur || "0.00"}
              </p>
              <p>
                <span className="font-medium">Received:</span>{" "}
                {formData.sol_received} SOL
              </p>
              {formData.sol_price && (
                <p>
                  <span className="font-medium">Price per SOL:</span> €
                  {formData.sol_price}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
