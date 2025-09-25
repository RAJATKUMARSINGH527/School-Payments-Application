import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";


const BASE_URL = process.env.NODE_ENV === "development" ? bcUrlLocal : bcUrl;

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nestedDropdownOpen, setNestedDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch user from backend using JWT token
  const checkUser = async () => {
    console.log("[Navbar] checkUser called");
    const token = localStorage.getItem("jwt_token");
    console.log("[Navbar] token from localStorage:", token);

    if (!token) {
      console.log("[Navbar] No token found, clearing user state");
      setUser(null);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/view`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("[Navbar] fetch '/auth/view' response status:", res.status);

      if (res.ok) {
        const userData = await res.json();
        console.log("[Navbar] User fetched:", userData);
        setUser({ name: userData.name || userData.username || "User" });
      } else {
        console.warn("[Navbar] fetch response not okay, clearing user state");
        setUser(null);
      }
    } catch (error) {
      console.error("[Navbar] Error fetching user profile:", error);
      setUser(null);
    }
  };

  // Setup event listeners on mount
  useEffect(() => {
    console.log("[Navbar] useEffect on mount");
    checkUser();

    // Respond to localStorage changes (other tabs)
    const handleStorageChange = (e) => {
      console.log("[Navbar] storage event detected", e.key);
      if (e.key === "jwt_token") {
        checkUser();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Listen for custom authChanged event
    const handleAuthChangeEvent = () => {
      console.log("[Navbar] authChanged event detected");
      checkUser();
    };
    window.addEventListener("authChanged", handleAuthChangeEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChanged", handleAuthChangeEvent);
    };
  }, []);

  // Close dropdowns if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log("[Navbar] Click outside dropdown detected, closing dropdowns");
        setDropdownOpen(false);
        setNestedDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("[Navbar] Logging out user");
    localStorage.removeItem("jwt_token");
    setUser(null);
    setDropdownOpen(false);
    setNestedDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/home");

    // Dispatch custom event to notify listeners
    window.dispatchEvent(new Event("authChanged"));

    // Immediate re-check to update UI without waiting for event propagation
    checkUser();
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 sm:px-6 py-4">
        <Link to="/home" className="text-2xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition">
          SchoolPay
        </Link>

        <button
          onClick={() => {
            console.log("[Navbar] toggling mobileMenuOpen:", !mobileMenuOpen);
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="block sm:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        <div className={`w-full sm:flex sm:items-center sm:w-auto ${mobileMenuOpen ? "block" : "hidden"}`}>
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 mt-4 sm:mt-0">
            <Link to="/home" className="block px-3 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition font-medium" onClick={() => {
              console.log("[Navbar] Home clicked, closing mobile menu");
              setMobileMenuOpen(false);
            }}>
              Home
            </Link>

            {user ? (
              <>
                <Link to="/" className="block px-3 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition font-medium" onClick={() => {
                  console.log("[Navbar] Transactions Overview clicked");
                  setMobileMenuOpen(false);
                }}>
                  Transactions Overview
                </Link>
                <Link to="/orders" className="block px-3 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition font-medium" onClick={() => {
                  console.log("[Navbar] Orders clicked");
                  setMobileMenuOpen(false);
                }}>
                  Orders
                </Link>
                <Link to="/school/:schoolId" className="block px-3 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition font-medium" onClick={() => {
                  console.log("[Navbar] Transactions By School clicked");
                  setMobileMenuOpen(false);
                }}>
                  Transactions By School
                </Link>
                <Link to="/status/:custom_order_id" className="block px-3 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition font-medium" onClick={() => {
                  console.log("[Navbar] Transaction Status clicked");
                  setMobileMenuOpen(false);
                }}>
                  Transaction Status
                </Link>
                <button onClick={() => {
                  console.log("[Navbar] Webhook clicked");
                  navigate("/webhook");
                  setMobileMenuOpen(false);
                }} className="block px-3 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition font-medium text-left">
                  Webhook
                </button>

                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => {
                    console.log("[Navbar] toggling dropdownOpen:", !dropdownOpen);
                    setDropdownOpen(!dropdownOpen);
                  }} className="flex items-center space-x-1 px-3 py-2 rounded text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition w-full sm:w-auto">
                    <span>Hi, {user.name}</span>
                    <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-30 w-48">
                      <button onClick={() => {
                        console.log("[Navbar] toggling nestedDropdownOpen:", !nestedDropdownOpen);
                        setNestedDropdownOpen((open) => !open);
                      }} className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center">
                        Profile
                        <svg className={`w-4 h-4 transition-transform ${nestedDropdownOpen ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {nestedDropdownOpen && (
                        <div className="bg-white dark:bg-gray-700 rounded-b-md">
                          <Link to="/auth/view" className="block px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => {
                            console.log("[Navbar] View Profile clicked");
                            setDropdownOpen(false);
                            setNestedDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}>
                            View Profile
                          </Link>
                          <Link to="/auth/edit" className="block px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => {
                            console.log("[Navbar] Settings clicked");
                            setDropdownOpen(false);
                            setNestedDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}>
                            Settings
                          </Link>
                        </div>
                      )}

                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 rounded-b-md font-semibold">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition font-medium" onClick={() => {
                  console.log("[Navbar] Login clicked");
                  setMobileMenuOpen(false);
                }}>
                  Login
                </Link>
                <Link to="/signup" className="block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-medium" onClick={() => {
                  console.log("[Navbar] Sign Up clicked");
                  setMobileMenuOpen(false);
                }}>
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
