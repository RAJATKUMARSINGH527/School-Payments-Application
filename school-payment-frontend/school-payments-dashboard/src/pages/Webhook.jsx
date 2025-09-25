import { useState } from "react";
import axios from "axios";


const BASE_URL = "https://school-payments-application.onrender.com"


const statusStyles = {
  success: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const WebhookUpdatePage = () => {
  const [orderId, setOrderId] = useState("");
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setError(null);
    setStatusData(null);
    if (!orderId.trim()) {
      setError("Please enter the collect_id (order ID).");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.get(
        `${BASE_URL}/orders/status/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatusData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch status from server."
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper to render status card
  const renderOrderStatus = (orderStatus) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 max-w-xl mx-auto grid gap-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-lg font-bold text-gray-900 dark:text-white">Order Status</span>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusStyles[orderStatus.status] || "bg-gray-200 text-gray-700"}`}>
          {orderStatus.status}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <StatusField label="Order ID" value={orderStatus.custom_order_id} />
        <StatusField label="Payment Mode" value={orderStatus.payment_mode} />
        <StatusField label="Amount" value={`₹${orderStatus.order_amount}`} />
        <StatusField label="Transaction Amount" value={`₹${orderStatus.transaction_amount}`} />
        <StatusField label="Payment Details" value={orderStatus.payment_details} />
        <StatusField label="Bank Reference" value={orderStatus.bank_reference} />
        <StatusField label="Payment Time" value={new Date(orderStatus.payment_time).toLocaleString()} />
        <StatusField label="Payment Msg" value={orderStatus.payment_message} />
        <StatusField label="Error Msg" value={orderStatus.error_message !== "NA" ? orderStatus.error_message : "--"} />
      </div>
    </div>
  );

  const StatusField = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-semibold text-gray-900 dark:text-white break-all">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-2 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-8 text-center text-gray-800 dark:text-white">
          Webhook Order Status Update
        </h1>
        <form
          className="flex flex-col md:flex-row gap-4 mb-6 items-center"
          onSubmit={e => {e.preventDefault();fetchStatus();}}
        >
          <input
            type="text"
            placeholder="Enter collect_id (Order ID)"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-lg disabled:opacity-60"
          >
            {loading ? "Fetching..." : "Fetch Status"}
          </button>
        </form>

        {error && (
          <p className="mb-6 p-4 bg-red-50 border border-red-400 text-red-700 rounded-lg shadow">
            {error}
          </p>
        )}

        {statusData?.orderStatus ? (
          renderOrderStatus(statusData.orderStatus)
        ) : statusData ? (
          <div className="text-center py-6 text-gray-600 dark:text-gray-400">
            No order status found.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WebhookUpdatePage;
