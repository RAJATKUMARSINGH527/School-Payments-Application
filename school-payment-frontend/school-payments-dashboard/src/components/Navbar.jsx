import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nestedDropdownOpen, setNestedDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      setUser({ name: "Admin User" }); // Replace with actual user info
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setNestedDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setUser(null);
    setDropdownOpen(false);
    setNestedDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 sm:px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition"
        >
          SchoolPay
        </Link>

        {/* Hamburger for Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="block sm:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop & Mobile Menu */}
        <div
          className={`w-full sm:flex sm:items-center sm:w-auto ${
            mobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 mt-4 sm:mt-0">
            <Link
              to="/"
              className="block px-3 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Transactions Overview
            </Link>

            {user ? (
              <>
                <Link
                  to="/orders"
                  className="block px-3 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>

                <Link
                  to="/school/:schoolId"
                  className="block px-3 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Transactions By School
                </Link>

                <Link
                  to="/status/:custom_order_id"
                  className="block px-3 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Transaction Status
                </Link>

                <button
                  onClick={() => {
                    navigate("/webhook");
                    setMobileMenuOpen(false);
                  }}
                  className="block px-3 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition font-medium text-left"
                >
                  Webhook
                </button>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1 px-3 py-2 rounded text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition w-full sm:w-auto"
                  >
                    <span>Hi, {user.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-30 w-48">
                      <button
                        onClick={() => setNestedDropdownOpen((open) => !open)}
                        className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                      >
                        Profile
                        <svg
                          className={`w-4 h-4 transition-transform ${nestedDropdownOpen ? "rotate-180" : "rotate-0"}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {nestedDropdownOpen && (
                        <div className="bg-white dark:bg-gray-700 rounded-b-md">
                          <Link
                            to="/profile"
                            className="block px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => {
                              setDropdownOpen(false);
                              setNestedDropdownOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            View Profile
                          </Link>
                          <Link
                            to="/settings"
                            className="block px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() => {
                              setDropdownOpen(false);
                              setNestedDropdownOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            Settings
                          </Link>
                        </div>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 rounded-b-md font-semibold"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
