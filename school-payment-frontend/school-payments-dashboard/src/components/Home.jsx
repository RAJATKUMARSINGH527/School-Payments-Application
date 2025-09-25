import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-10 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="max-w-5xl w-full flex flex-col md:flex-row md:items-center gap-10 px-4 md:px-10 py-10">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Welcome to SchoolPay
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
            Your modern solution for managing school fee payments, transactions, and reporting.
            Experience seamless, secure, and fast digital finance for institutions, families, and admins.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition font-semibold text-lg">Login</Link>
            <Link to="/signup" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg shadow hover:bg-blue-600 hover:text-white transition font-semibold text-lg">Sign Up</Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          {/* Modern dashboard preview card */}
          <div className="bg-white dark:bg-gray-900 shadow-xl rounded-3xl border dark:border-gray-800 w-[350px] md:w-[400px] h-[300px] flex flex-col p-6">
            <span className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Transactions Overview</span>
            <div className="flex-1 overflow-y-auto">
              {/* Example data rows */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="font-semibold">Fee Payment</span>
                <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">Success</span>
                <span className="text-gray-500 dark:text-gray-300">₹1050</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="font-semibold">Admission</span>
                <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-600 text-xs font-bold">Pending</span>
                <span className="text-gray-500 dark:text-gray-300">₹1500</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="font-semibold">Transport</span>
                <span className="px-2 py-1 rounded bg-red-100 text-red-600 text-xs font-bold">Failed</span>
                <span className="text-gray-500 dark:text-gray-300">₹650</span>
              </div>
            </div>
            <Link to="/" className="mt-4 text-blue-600 hover:underline font-medium text-sm">View Dashboard →</Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl w-full px-4 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-4 rounded-full mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 8c1.104 0 2-.896 2-2V4H10v2c0 1.104.896 2 2 2ZM6 8v2c0 3.313 2.687 6 6 6s6-2.687 6-6V8H6Zm-2 8c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2v-2H4v2Z" />
            </svg>
          </span>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Fast Payments</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Instant digital payment processing through UPI, cards, and bank transfer with real-time updates.</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-4 rounded-full mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M17 9V7a5 5 0 00-10 0v2M5 12v7h14v-7M12 17v2" />
            </svg>
          </span>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Secure Platform</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Industry-grade encryption. Your data and transactions are protected by leading security standards.</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 p-4 rounded-full mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 17v2h6v-2M12 7V3m-4 4v2c0 1.104.896 2 2 2h4c1.104 0 2-.896 2-2V7m-8 8v1a2 2 0 002 2h4a2 2 0 002-2v-1" />
            </svg>
          </span>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Detailed Reporting</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Get comprehensive transaction analytics, export reports, and reconcile accounts seamlessly.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
