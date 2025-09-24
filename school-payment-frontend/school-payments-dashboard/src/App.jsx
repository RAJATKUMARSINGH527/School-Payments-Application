import { BrowserRouter, Routes, Route } from "react-router-dom";
import TransactionsOverviewPage from "./pages/TransactionsOverviewPage";
import TransactionStatusCheckPage from "./pages/TransactionStatusCheckPage";
import TransactionsBySchoolPage from "./pages/TransactionsBySchoolPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Webhook from "./pages/Webhook";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-800 dark:text-gray-200">
        <p className="text-xl mb-4">Please login to view this page.</p>
        <a
          href="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Login
        </a>
      </div>
    );
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 text-gray-900 dark:text-gray-100">
        <Navbar />

        <main className="flex-grow p-4 sm:p-8">
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <TransactionsOverviewPage />
                </RequireAuth>
              }
            />
            <Route
              path="/school/:schoolId"
              element={
                <RequireAuth>
                  <TransactionsBySchoolPage />
                </RequireAuth>
              }
            />
            <Route
              path="/status/:custom_order_id"
              element={
                <RequireAuth>
                  <TransactionStatusCheckPage />
                </RequireAuth>
              }
            />
             <Route
              path="/orders"
              element={
                <RequireAuth>
                  <Orders />
                </RequireAuth>
              }
            />
             <Route
              path="/webhook"
              element={
                <RequireAuth>
                  <Webhook />
                </RequireAuth>
              }
            />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
