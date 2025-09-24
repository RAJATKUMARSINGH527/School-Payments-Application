import { useState } from "react";
import axios from "axios";
import TableWithHover from "../components/TableWithHover";

const columns = [
  "srno",
  "collect_id",
  "school_id",
  "gateway",
  "order_amount",
  "transaction_amount",
  "status",
  "edviron_order_id",
];

const TransactionsBySchoolPage = () => {
  const [schoolId, setSchoolId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBySchool = async () => {
    setError(null);
    if (!schoolId || schoolId.length < 24) {
      setError("Please enter a valid School ID.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("jwt_token");
    try {
      const res = await axios.get(
        `http://localhost:3000/transactions/school/${schoolId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const dataWithSrNo = (res.data.data || []).map((item, index) => ({
        ...item,
        srno: index + 1,
      }));
      setTransactions(dataWithSrNo);
    } catch {
      setError("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center sm:text-left">
        Transactions By School
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter School ID"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full sm:w-96"
        />
        <button
          onClick={fetchBySchool}
          disabled={loading}
          className="mt-4 sm:mt-0 inline-flex justify-center items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 text-white font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
              Loading...
            </>
          ) : (
            "Fetch"
          )}
        </button>
      </div>
      {error && (
        <p className="text-red-600 mb-6 text-center font-semibold">{error}</p>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <TableWithHover columns={columns} data={transactions} />
      </div>
    </div>
  );
};

export default TransactionsBySchoolPage;
