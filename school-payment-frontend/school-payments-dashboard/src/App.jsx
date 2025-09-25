import { BrowserRouter, Routes, Route } from "react-router-dom";
import TransactionsOverviewPage from "./pages/TransactionsOverviewPage";
import TransactionStatusCheckPage from "./pages/TransactionStatusCheckPage";
import TransactionsBySchoolPage from "./pages/TransactionsBySchoolPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Webhook from "./pages/Webhook";
import Settings from "./components/Settings";
import ViewProfile from "./components/Viewprofile";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    window.location.href = "/login";
    return null;
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
            <Route path="/home" element={<Home />} />
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
             <Route
              path="/auth/view"
              element={
                <RequireAuth>
                  <ViewProfile/>
                </RequireAuth>
              }
            />
             <Route
              path="/auth/edit"
              element={
                <RequireAuth>
                  <Settings/>
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
