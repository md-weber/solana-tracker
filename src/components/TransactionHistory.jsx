import { useState } from "react";
import {
  Edit2,
  Trash2,
  TrendingUp,
  ArrowRightLeft,
  ShoppingCart,
  Coins,
} from "lucide-react";

export default function TransactionsTable({ txns }) {
  const [transactions] = useState(txns.data);

  const getTransactionIcon = (type) => {
    switch (type) {
      case "purchase":
        return <ShoppingCart className="w-4 h-4" />;
      case "transfer":
        return <ArrowRightLeft className="w-4 h-4" />;
      case "restake":
        return <Coins className="w-4 h-4" />;
      case "reward":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Coins className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "purchase":
        return "text-green-400 bg-green-400/10";
      case "transfer":
        return "text-blue-400 bg-blue-400/10";
      case "restake":
        return "text-purple-400 bg-purple-400/10";
      case "reward":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const handleEdit = (id) => {
    console.log("Edit transaction:", id);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      console.log("Delete transaction:", id);
      // Implement delete functionality
    }
  };

  return (
    <div className="bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            Transaction History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-white text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-3">Date</th>
                  <th className="text-left py-3 px-3">Type</th>
                  <th className="text-left py-3 px-3">Validator</th>
                  <th className="text-right py-3 px-3">Invested €</th>
                  <th className="text-right py-3 px-3">SOL Received</th>
                  <th className="text-right py-3 px-3">Staked SOL</th>
                  <th className="text-right py-3 px-3">Unstaked SOL</th>
                  <th className="text-right py-3 px-3">Fees</th>
                  <th className="text-right py-3 px-3">Total Invested</th>
                  <th className="text-right py-3 px-3">Portfolio Value</th>
                  <th className="text-right py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const feeDisplay =
                    parseFloat(tx.fee_eur) > 0
                      ? `€${parseFloat(tx.fee_eur).toFixed(2)}`
                      : parseFloat(tx.fee_sol) > 0
                        ? `${parseFloat(tx.fee_sol).toFixed(6)} SOL`
                        : "-";

                  return (
                    <tr
                      key={tx.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-3">{tx.date}</td>
                      <td className="py-3 px-3">
                        <div
                          className={`inline-flex items-center gap-2 px-2 py-1 rounded-md ${getTransactionColor(tx.transaction_type)}`}
                        >
                          {getTransactionIcon(tx.transaction_type)}
                          <span className="capitalize">
                            {tx.transaction_type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-purple-300">
                        {tx.validator || "-"}
                      </td>
                      <td className="text-right py-3 px-3">
                        {parseFloat(tx.amount_eur) > 0
                          ? `€${parseFloat(tx.amount_eur).toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="text-right py-3 px-3 text-cyan-300">
                        {parseFloat(tx.sol_received) > 0
                          ? parseFloat(tx.sol_received).toFixed(8)
                          : "-"}
                      </td>
                      <td className="text-right py-3 px-3 text-green-300">
                        {parseFloat(tx.portfolio_staked_sol).toFixed(8)}
                      </td>
                      <td className="text-right py-3 px-3 text-blue-300">
                        {parseFloat(tx.portfolio_unstaked_sol).toFixed(8)}
                      </td>
                      <td className="text-right py-3 px-3 text-red-300">
                        {feeDisplay}
                      </td>
                      <td className="text-right py-3 px-3 font-semibold">
                        €{parseFloat(tx.total_invested_eur).toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-3 font-bold text-yellow-300">
                        {tx.portfolio_value_eur
                          ? `€${parseFloat(tx.portfolio_value_eur).toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="text-right py-3 px-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(tx.id)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
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
      </div>
    </div>
  );
}
