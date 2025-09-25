import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";


const BASE_URL = process.env.NODE_ENV === "development" ? bcUrlLocal : bcUrl;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      console.log("Attempting login with email:", email);
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password
      });

      console.log("Login response:", response.data);

      localStorage.setItem("jwt_token", response.data.token);
      
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed, please try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-800 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Login</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded shadow-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded shadow-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <label className="block mb-2 font-semibold text-gray-600 dark:text-gray-300">
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mt-1 mb-4 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="block mb-4 font-semibold text-gray-600 dark:text-gray-300">
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your password"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
