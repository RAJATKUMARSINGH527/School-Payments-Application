import { useState } from "react";
import axios from "axios";

function getStatusColor(status) {
  if (!status) return "bg-gray-300 text-gray-700";
  if (status.toLowerCase() === "success") return "bg-green-100 text-green-700 border-green-400";
  if (status.toLowerCase() === "pending") return "bg-yellow-100 text-yellow-700 border-yellow-400";
  if (status.toLowerCase() === "failed") return "bg-red-100 text-red-700 border-red-400";
  if (status.toLowerCase() === "cancelled") return "bg-blue-100 text-blue-700 border-blue-400";
  return "bg-red-100 text-red-700 border-red-400";
}

const TransactionStatusCheckPage = () => {
  const [customOrderId, setCustomOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setError(null);
    setStatus(null);

    if (!customOrderId.trim()) {
      setError("Please enter a valid Custom Order ID.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("jwt_token");

    try {
      const res = await axios.get(
        `http://localhost:3000/transactions/status/${customOrderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatus(res.data);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-2">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 sm:p-10 mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center sm:text-left">
          Check Transaction Status
        </h1>
        <form
          className="flex flex-col sm:flex-row gap-4 mb-8"
          onSubmit={(e) => {
            e.preventDefault();
            checkStatus();
          }}
        >
          <input
            type="text"
            placeholder="Enter Custom Order ID"
            value={customOrderId}
            onChange={(e) => setCustomOrderId(e.target.value)}
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
            required
          />
          <button
            type="submit"
            disabled={loading || !customOrderId.trim()}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold shadow text-white flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            {loading ? "Checking..." : "Check Status"}
          </button>
        </form>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-100 text-red-700 font-semibold text-center border border-red-300">
            {error}
          </div>
        )}

        {status && (
          <div
            className={`mb-2 border-l-4 rounded-lg p-6 shadow-sm ${getStatusColor(
              status.status
            )}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl font-semibold">Status: {status.status}</span>
              {status.status && (
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-xs ${getStatusColor(
                    status.status
                  )}`}
                >
                  {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-base">
              <div>
                <span className="font-semibold">Order Amount:</span> ₹{status.order_amount}
              </div>
              <div>
                <span className="font-semibold">Transaction Amount:</span> ₹{status.transaction_amount}
              </div>
              <div>
                <span className="font-semibold">Payment Mode:</span> {status.payment_mode}
              </div>
              <div>
                <span className="font-semibold">Custom Order ID:</span> {status.collect_id}
              </div>
              <div>
                <span className="font-semibold">Bank Reference:</span> {status.bank_reference}
              </div>
              <div>
                <span className="font-semibold">Payment Time:</span>{" "}
                {new Date(status.payment_time).toLocaleString()}
              </div>
              <div className="col-span-1 sm:col-span-2">
                <span className="font-semibold">Payment Message:</span> {status.payment_message}
              </div>
              {status.payment_details && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="font-semibold">Card Info:</span> {status.payment_details}
                </div>
              )}
              {status.error_message && status.error_message !== "NA" && (
                <div className="col-span-1 sm:col-span-2 text-red-500">
                  <span className="font-semibold">Error:</span> {status.error_message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionStatusCheckPage;
