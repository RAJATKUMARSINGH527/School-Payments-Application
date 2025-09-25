import { useState, useEffect } from "react";
import axios from "axios";
import TableWithHover from "../components/TableWithHover";

const columns = [
  "srno",
  "school_id",
  "order_id",
  "edviron_order_id",
  "order_amount",
  "transaction_amount",
  "payment_method",
  "status",
  "date_time",
  "student_name",
  "student_id",
  "phone_no",
  "gateway",
];

const TransactionsOverviewPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const FILTER_OPTIONS = ["All", "Order ID", "Student ID", "Phone No"];
  const DATE_OPTIONS = ["All Dates", "Last 7 Days", "Last 30 Days", "This Month", "Last Month"];
  const STATUS_OPTIONS = ["All Statuses", "Success", "Failed", "Pending"];
  const ADVANCED_FILTERS = ["No Filter", "High to Low Amount", "Low to High Amount"];
  const [filterBy, setFilterBy] = useState(FILTER_OPTIONS[0]);
  const [dateFilter, setDateFilter] = useState(DATE_OPTIONS[0]);
  const [statusFilter, setStatusFilter] = useState(STATUS_OPTIONS[0]);
  const [advancedFilter, setAdvancedFilter] = useState(ADVANCED_FILTERS[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) return;
        const res = await axios.get(
          `http://localhost:3000/transactions?limit=${limit}&page=${page}&sort=payment_time&order=desc`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const dataWithSrNo = (res.data.data || []).map((item, index) => ({
          ...item,
          srno: (page - 1) * limit + index + 1,
        }));
        setTransactions(dataWithSrNo);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit]);

  // Filter helpers
  const filterBySearch = (data) => {
    if (!search.trim() || filterBy === "All") return data;
    const keyMap = {
      "Order ID": "order_id",
      "Student ID": "student_id",
      "Phone No": "phone_no",
    };
    const key = keyMap[filterBy];
    if (!key) return data;
    return data.filter(tx =>
      tx[key]?.toString().toLowerCase().includes(search.toLowerCase())
    );
  };

  const filterByDate = (data) => {
    if (dateFilter === "All Dates") return data;
    const now = new Date();
    return data.filter(tx => {
      const txDate = new Date(tx.date_time);
      switch (dateFilter) {
        case "Last 7 Days":
          return txDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case "Last 30 Days":
          return txDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case "This Month":
          return (
            txDate.getMonth() === new Date().getMonth() &&
            txDate.getFullYear() === new Date().getFullYear()
          );
        case "Last Month":
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return (
            txDate.getMonth() === lastMonth.getMonth() &&
            txDate.getFullYear() === lastMonth.getFullYear()
          );
        default:
          return true;
      }
    });
  };

  const filterByStatus = (data) => {
    if (statusFilter === "All Statuses") return data;
    return data.filter(tx => tx.status?.toLowerCase() === statusFilter.toLowerCase());
  };

  const sortByAdvancedFilter = (data) => {
    if (advancedFilter === "No Filter") return data;
    const sorted = [...data];
    sorted.sort((a, b) => {
      const amtA = Number(a.order_amount) || 0;
      const amtB = Number(b.order_amount) || 0;
      if (advancedFilter === "High to Low Amount") {
        return amtB - amtA;
      } else if (advancedFilter === "Low to High Amount") {
        return amtA - amtB;
      }
      return 0;
    });
    return sorted;
  };

  // Apply all filters together
  const filteredTransactions = sortByAdvancedFilter(
    filterByStatus(
      filterByDate(
        filterBySearch(transactions)
      )
    )
  );

  // Export filtered data as CSV
  const exportToCSV = () => {
    const csvHeader = columns.join(",") + "\n";
    const csvRows = filteredTransactions.map(tx =>
      columns.map(col => {
        const val = tx[col] !== undefined && tx[col] !== null ? tx[col].toString() : "";
        return `"${val.replace(/"/g, '""')}"`;
      }).join(",")
    );
    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `transactions_filtered_page_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header controls */}
      <div className="bg-white dark:bg-gray-900 rounded-t-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 mb-0 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search (Order ID...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="hidden sm:inline-block">Rows per page:</span>
          <input
            type="number"
            min={1}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-16 px-2 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-end sm:justify-start">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="min-w-[6.5rem] bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
          >
            {DATE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[6.5rem] bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <select
            value={advancedFilter}
            onChange={(e) => setAdvancedFilter(e.target.value)}
            className="min-w-[6.5rem] bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
          >
            {ADVANCED_FILTERS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            onClick={exportToCSV}
            className="border border-blue-600 text-blue-600 font-semibold px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            Export
          </button>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-6 pt-4 pb-2 px-4">Transactions Overview</h1>
      <div className="overflow-x-auto rounded-b-lg px-4">
        {loading ? (
          <div className="py-10 text-center text-blue-600 text-lg">Loading transactions...</div>
        ) : (
          <TableWithHover columns={columns} data={filteredTransactions} />
        )}
      </div>
      <div className="mt-6 mb-2 flex flex-col sm:flex-row justify-between px-4 pb-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-2 bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg disabled:opacity-50 mb-2 sm:mb-0"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300 font-medium mb-2 sm:mb-0 flex-1 text-center">
          Page {page}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-2 bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsOverviewPage;
